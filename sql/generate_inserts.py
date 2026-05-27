#!/usr/bin/env python3
"""Generate SQL INSERT statements for ENTREGADO CARPETAS missing 19 records."""
import zipfile, xml.etree.ElementTree as ET
from datetime import datetime, timedelta

def serial_to_date(serial):
    if not serial or not serial.replace('.','').replace('-','').isdigit():
        return 'NULL'
    try:
        val = float(serial)
        if val < 1 or val > 100000:
            return 'NULL'
        base = datetime(1899, 12, 30)
        return "'" + (base + timedelta(days=val)).strftime('%Y-%m-%d') + "'"
    except:
        return 'NULL'

def esc(s):
    """Escape string for SQL."""
    if not s:
        return 'NULL'
    s = s.replace("'", "''").strip()
    return "'" + s + "'" if s else 'NULL'

def parse_name(full):
    full = full.strip().upper()
    parts = full.split()
    if not parts:
        return ('NULL','NULL','NULL','NULL','NULL')
    # Detect "DE" compound
    surname_parts = []
    given_parts = []
    de_mode = False
    for i, p in enumerate(parts):
        if p == 'DE' and i > 0:
            surname_parts.append(p)
            de_mode = True
        elif de_mode and i < len(parts) - 2:
            surname_parts.append(p)
            de_mode = False
        else:
            if len(surname_parts) < 2 and not de_mode:
                surname_parts.append(p)
            else:
                given_parts.append(p)
    ap = surname_parts[0] if len(surname_parts) > 0 else ''
    am = surname_parts[1] if len(surname_parts) > 1 else ''
    ac = ''
    casada_keywords = ['DE']
    if len(surname_parts) > 2:
        # Check if there's "DE something" at end of surnames
        extra = surname_parts[2:]
        if extra[0] == 'DE':
            ac = ' '.join(extra)
        else:
            am = ' '.join(surname_parts[1:])
    pn = given_parts[0] if len(given_parts) > 0 else ''
    sn = given_parts[1] if len(given_parts) > 1 else ''
    return (esc(ap), esc(am), esc(ac), esc(pn), esc(sn))

exp_map = {'OR': '2', 'LP': '1', 'CB': '3', 'PT': '8'}

# Read xlsx
z = zipfile.ZipFile('/media/hitdev/DatosLinux/RRHH-Barrios-Mineros/Statefolder/ENTREGADO CARPETAS.xlsx')
ns = {'s': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
ss_xml = z.read('xl/sharedStrings.xml')
sst = ET.fromstring(ss_xml)
strings = [si.find('.//s:t', ns).text or '' for si in sst.findall('.//s:si', ns)]
sheet_xml = z.read('xl/worksheets/sheet1.xml')
root = ET.fromstring(sheet_xml)

rows = []
for row in root.findall('.//s:row', ns):
    r = row.get('r')
    if r == '1': continue
    col = {}
    for c in row.findall('s:c', ns):
        ref = c.get('r')
        v = c.find('s:v', ns)
        val = v.text if v is not None else ''
        t = c.get('t', '')
        if t == 's' and val:
            idx = int(val)
            val = strings[idx] if idx < len(strings) else val
        col[ref.rstrip('0123456789')] = val.strip()
    ci = col.get('B', '').split('.')[0]
    if not ci or not ci.isdigit() or len(ci) < 6:
        ci = col.get('A', '').split('.')[0]
        if not ci or not ci.isdigit() or len(ci) < 6:
            continue
        name = col.get('C', '')
        ext = ''
    else:
        name = col.get('D', '')
        ext = col.get('C', '')
    rows.append({'ci': ci, 'ext': ext, 'name': name, 'fnac': serial_to_date(col.get('F','')),
        'sexo': col.get('G',''), 'cargo': col.get('H',''), 'contrato': col.get('I',''),
        'fing': serial_to_date(col.get('J','')), 'ffin': serial_to_date(col.get('K','')),
        'haber': col.get('P',''), 'dias': col.get('O',''), 'nro_prev': col.get('L',''),
        'cat_prog': col.get('M',''), 'desc_act': col.get('N','')})

# Get DB CIs to filter
import subprocess
res = subprocess.run(['psql', '-h', '/var/run/postgresql', '-U', 'hitdev', '-d', 'rrhh_barrios_mineros',
    '-Atc', 'SELECT ci FROM personal'], capture_output=True, text=True, env={'PGPASSWORD': 'bm-rrhh'})
db_cis = set(l.strip() for l in res.stdout.strip().split('\n') if l.strip())

missing = [r for r in rows if r['ci'] not in db_cis]

print("-- Migracion: Insertar 19 consultores faltantes de ENTREGADO CARPETAS")
print("BEGIN;")
print()
print("ALTER TABLE personal ADD COLUMN IF NOT EXISTS tipo_personal VARCHAR(20) DEFAULT 'PLANTA';")
print()

for r in missing:
    ap, am, ac, pn, sn = parse_name(r['name'])
    ci = r['ci']
    ext_id = exp_map.get(r['ext'].strip().upper(), '2')
    fnac = r['fnac']
    print(f"INSERT INTO personal (ci, complemento, exp_id, apellido_paterno, apellido_materno, apellido_casada, primer_nombre, segundo_nombre, fecha_nacimiento, tipo_personal)")
    print(f"VALUES ({esc(ci)}, '', {ext_id}, {ap}, {am}, {ac}, {pn}, {sn}, {fnac}, 'CONSULTOR');")

print()
print("-- Insertar 7 empleados ASIS-only")
asis_inserts = [
    ("2786060", "NUÑEZ ALCONCE LUIS ALBERTO"),
    ("3115693", "BERRIOS RAMOS LIDIA"),
    ("3119968", "VASQUEZ CALDERON MARITZA PAULA"),
    ("3532960", "CHACON APAZA JUAN CARLOS"),
    ("5720293", "CHOQUE LAPACA JANNETH"),
    ("7330613", "ESCARZO MAMANI KATTY JOAQUINA"),
    ("5735729", "CHOQUE JACINTO RUTH ROXANA"),
]
for ci, name in asis_inserts:
    ap, am, ac, pn, sn = parse_name(name)
    print(f"INSERT INTO personal (ci, exp_id, apellido_paterno, apellido_materno, apellido_casada, primer_nombre, segundo_nombre, tipo_personal)")
    print(f"VALUES ({esc(ci)}, 2, {ap}, {am}, {ac}, {pn}, {sn}, 'PLANTA');")

print()
print("-- Corregir 4 CI mismatches (ASIS vs DB)")
print("UPDATE personal SET ci = '352786' WHERE ci = '3524786';")
print("UPDATE personal SET ci = '3111381' WHERE ci = '3111381/1P';")
print("UPDATE personal SET ci = '3713178' WHERE ci = '3713175';")
print("UPDATE personal SET ci = '354500' WHERE ci = '3504500';")

print()
print("COMMIT;")
