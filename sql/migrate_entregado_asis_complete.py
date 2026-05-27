#!/usr/bin/env python3
"""
Migración completa: 
1. Agrega columna tipo_personal a personal
2. Inserta 19 consultores faltantes de ENTREGADO CARPETAS.xlsx
3. Inserta 7 empleados ASIS-only
4. Corrige 4 CI mismatch (ASIS vs DB)
5. Crea tabla contratos desde ENTREGADO CARPETAS
"""
import zipfile, xml.etree.ElementTree as ET, csv
from datetime import datetime, timedelta

def excel_serial_to_date(serial):
    if not serial or not serial.replace('.','').replace('-','').isdigit():
        return None
    try:
        val = float(serial)
        if val < 1 or val > 100000:
            return None
        base = datetime(1899, 12, 30)
        return (base + timedelta(days=val)).strftime('%Y-%m-%d')
    except:
        return None

# --- ENTREGADO CARPETAS ---
z = zipfile.ZipFile('/media/hitdev/DatosLinux/RRHH-Barrios-Mineros/Statefolder/ENTREGADO CARPETAS.xlsx')
ns = {'s': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
ss_xml = z.read('xl/sharedStrings.xml')
sst = ET.fromstring(ss_xml)
strings = [si.find('.//s:t', ns).text or '' for si in sst.findall('.//s:si', ns)]
sheet_xml = z.read('xl/worksheets/sheet1.xml')
root = ET.fromstring(sheet_xml)

entregado_rows = []
for row in root.findall('.//s:row', ns):
    r = row.get('r')
    if r == '1':
        continue
    col_map = {}
    for c in row.findall('s:c', ns):
        ref = c.get('r')
        v = c.find('s:v', ns)
        val = v.text if v is not None else ''
        t = c.get('t', '')
        if t == 's' and val:
            idx = int(val)
            val = strings[idx] if idx < len(strings) else val
        col_map[ref.rstrip('0123456789')] = val.strip()
    ci = col_map.get('B', '').split('.')[0]
    if not ci or not ci.isdigit() or len(ci) < 6:
        ci = col_map.get('A', '').split('.')[0]
        if not ci or not ci.isdigit() or len(ci) < 6:
            continue
        name = col_map.get('C', '')
        ext = ''
    else:
        name = col_map.get('D', '')
        ext = col_map.get('C', '')
    entregado_rows.append({
        'ci': ci, 'ext': ext, 'name': name,
        'fnac': excel_serial_to_date(col_map.get('F', '')),
        'sexo': col_map.get('G', ''),
        'cargo': col_map.get('H', ''),
        'contrato': col_map.get('I', ''),
        'fing': excel_serial_to_date(col_map.get('J', '')),
        'ffin': excel_serial_to_date(col_map.get('K', '')),
        'nro_prev': col_map.get('L', ''),
        'cat_prog': col_map.get('M', ''),
        'desc_act': col_map.get('N', ''),
        'dias': col_map.get('O', ''),
        'haber': col_map.get('P', ''),
    })

print(f"ENTREGADO total: {len(entregado_rows)}")

# --- DB existing CIs ---
import subprocess
res = subprocess.run(['psql', '-h', '/var/run/postgresql', '-U', 'hitdev', '-d', 'rrhh_barrios_mineros',
    '-Atc', 'SELECT ci FROM personal'],
    capture_output=True, text=True, env={'PGPASSWORD': 'bm-rrhh'})
db_cis = set(l.strip() for l in res.stdout.strip().split('\n') if l.strip())

# --- Names and exp mapping ---
def parse_name(full_name):
    """Parse 'APELLIDO1 APELLIDO2 NOMBRE1 NOMBRE2' into parts."""
    full_name = full_name.strip()
    parts = full_name.split()
    if len(parts) < 2:
        return ('', '', '', '', '')
    # Detect common compound surnames with DE
    de_idx = None
    for i, p in enumerate(parts):
        if p.upper() == 'DE' and i > 0:
            de_idx = i
    if de_idx and de_idx + 1 < len(parts):
        # "APELLIDO1 APELLIDO2 DE CASADA NOMBRE1 NOMBRE2"
        surnames = parts[:de_idx - 1] if len(parts[:de_idx]) > 2 else parts[:de_idx]
        married = parts[de_idx:de_idx + 2] if de_idx + 2 <= len(parts) else []
        given = parts[de_idx + 2:] if len(parts) > de_idx + 2 else parts[de_idx + 1:de_idx + 2]
        rest = parts[:de_idx - 1] + parts[de_idx:de_idx+2]
        given = [p for p in parts if p not in rest]
    else:
        surnames = parts[:2] if len(parts) > 2 else parts[:1]
        married = []
        given = parts[len(surnames):]
    
    ap = surnames[0] if len(surnames) > 0 else ''
    am = surnames[1] if len(surnames) > 1 else ''
    ac = ' '.join(married) if married else ''
    pn = given[0] if len(given) > 0 else ''
    sn = given[1] if len(given) > 1 else ''
    return (ap, am, ac, pn, sn)

exp_map = {'OR': 2, 'LP': 1, 'CB': 3, 'PT': 8, 'SC': 4, 'BN': 5, 'PA': 6, 'TJ': 7, 'CH': 9}

print(f"\nDB personal CIs: {len(db_cis)}")

# --- 1. ALTER TABLE ---
print("\n=== FASE 1: ALTER TABLE ===")
print("ALTER TABLE personal ADD COLUMN IF NOT EXISTS tipo_personal VARCHAR(20) DEFAULT 'PLANTA';")

# --- 2. INSERT 19 missing ENTREGADO ---
missing_e = [e for e in entregado_rows if e['ci'] not in db_cis]
print(f"\n=== FASE 2: INSERT {len(missing_e)} consultores faltantes ===")
sql_inserts = []
for e in missing_e:
    ap, am, ac, pn, sn = parse_name(e['name'])
    ci = e['ci']
    exp_id = exp_map.get(e['ext'].strip().upper(), 2)
    fnac = e['fnac'] or 'NULL'
    sql = f"""INSERT INTO personal (ci, complemento, exp_id, apellido_paterno, apellido_materno, apellido_casada, primer_nombre, segundo_nombre, fecha_nacimiento, tipo_personal)
    VALUES ('{ci}', '', {exp_id}, {repr(ap)}, {repr(am)}, {repr(ac)}, {repr(pn)}, {repr(sn)}, {'NULL' if fnac == 'NULL' else "'"+fnac+"'"}, 'CONSULTOR');"""
    sql_inserts.append(sql)
    # Also generate contratos INSERT
    haber_val = e['haber'] if e['haber'] else 'NULL'
    dias_val = e['dias'] if e['dias'] else 'NULL'
    print(sql)
    # Also print contratos data reference

# --- 3. INSERT 7 ASIS-only ---
print("\n=== FASE 3: INSERT 7 ASIS-only ===")
asis_data = []
with open('/media/hitdev/DatosLinux/RRHH-Barrios-Mineros/Statefolder/Asis/export/csv/FTUserInfo.csv') as f:
    r = csv.DictReader(f)
    for row in r:
        ci = row['CI'].strip()
        if ci in ('2786060','3115693','3119968','3532960','5720293','7330613','5735729'):
            asis_data.append(row)
            name = row['TU_sName'].strip()
            # ASIS names often have ITEM info appended
            item_kw = ['ITEM', 'TGN', 'HIPC', 'GOBERNACION']
            clean_name = name
            for kw in item_kw:
                if kw in clean_name.upper():
                    clean_name = clean_name[:clean_name.upper().index(kw)].strip()
            ap, am, ac, pn, sn = parse_name(clean_name)
            print(f"INSERT INTO personal (ci, exp_id, apellido_paterno, apellido_materno, apellido_casada, primer_nombre, segundo_nombre, tipo_personal) VALUES ('{ci}', 2, {repr(ap)}, {repr(am)}, {repr(ac)}, {repr(pn)}, {repr(sn)}, 'PLANTA');")

# --- 4. Fix CI mismatches ---
print("\n=== FASE 4: Corregir CI mismatch ASIS vs DB ===")
mismatches = [
    ('352786', '3524786', 'MEDINA HERVAS ALEX SANDRO'),
    ('3111381', '3111381/1P', 'NOYA MURGUIA JOSE LUIS'),
    ('3713178', '3713175', 'SALVATIERRA BAUTISTA VIRGINIA'),
    ('354500', '3504500', 'ROMERO CONDORI DANIEL'),
]
for asis_ci, db_ci, name in mismatches:
    print(f"-- ASIS CI: {asis_ci} -> DB CI: {db_ci} ({name})")
    print(f"UPDATE personal SET ci = '{asis_ci}', biometrico_id = (SELECT TU_sID::int FROM FTUserInfo WHERE CI = '{asis_ci}') WHERE ci = '{db_ci}';")

# --- 5. CREATE TABLE contratos ---
print("\n=== FASE 5: CREAR TABLA contratos ===")
print("""
CREATE TABLE IF NOT EXISTS contratos (
    id SERIAL PRIMARY KEY,
    personal_id INTEGER REFERENCES personal(id) ON DELETE CASCADE,
    ci VARCHAR(20),
    nombre_completo VARCHAR(255),
    nacionalidad VARCHAR(50),
    fecha_nacimiento DATE,
    sexo CHAR(1),
    cargo VARCHAR(255),
    nro_contrato VARCHAR(100),
    fecha_inicio DATE,
    fecha_fin DATE,
    nro_preventivo VARCHAR(50),
    cat_programatica VARCHAR(50),
    descripcion_actividad TEXT,
    dias_pagados NUMERIC(5,1),
    haber_basico NUMERIC(10,2),
    fuente VARCHAR(50) DEFAULT 'ENTREGADO_CARPETAS',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
""")

# Generate INSERTs for contratos
print("\n=== FASE 5b: INSERT contratos ===")
for e in entregado_rows:
    ap, am, ac, pn, sn = parse_name(e['name'])
    ci = e['ci']
    haber_val = e['haber'] if e['haber'] else 'NULL'
    dias_val = e['dias'] if e['dias'] else 'NULL'
    fnac = e['fnac'] or 'NULL'
    fing = e['fing'] or 'NULL'
    ffin = e['ffin'] or 'NULL'
    print(f"""INSERT INTO contratos (ci, nombre_completo, nacionalidad, fecha_nacimiento, sexo, cargo, nro_contrato, fecha_inicio, fecha_fin, nro_preventivo, cat_programatica, descripcion_actividad, dias_pagados, haber_basico, fuente)
    VALUES ('{ci}', {repr(e['name'])}, 'BOLIVIANA', {'NULL' if fnac == 'NULL' else "'"+fnac+"'"}, {repr(e['sexo'])}, {repr(e['cargo'])}, {repr(e['contrato'])}, {'NULL' if fing == 'NULL' else "'"+fing+"'"}, {'NULL' if ffin == 'NULL' else "'"+ffin+"'"}, {repr(e['nro_prev'])}, {repr(e['cat_prog'])}, {repr(e['desc_act'])}, {dias_val}, {haber_val}, 'ENTREGADO_CARPETAS');""")
