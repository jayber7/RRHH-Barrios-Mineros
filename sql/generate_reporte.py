#!/usr/bin/env python3
"""Genera reporte comparativo ASIS vs DB vs ENTREGADO CARPETAS en CSV."""
import csv, subprocess, zipfile, xml.etree.ElementTree as ET
from datetime import datetime, timedelta

# 1. Read ASIS
asis = {}
with open('/media/hitdev/DatosLinux/RRHH-Barrios-Mineros/Statefolder/Asis/export/csv/FTUserInfo.csv') as f:
    for row in csv.DictReader(f):
        ci = row['CI'].strip()
        if ci and ci != '0':
            asis[ci] = row['TU_sName'].strip()

# 2. Read DB personal
res = subprocess.run(['psql', '-h', '/var/run/postgresql', '-U', 'hitdev', '-d', 'rrhh_barrios_mineros',
    '-Atc', "SELECT ci, nombre_completo, tipo_personal FROM personal_view"],
    capture_output=True, text=True, env={'PGPASSWORD': 'bm-rrhh'})
db = {}
db_ci_tipo = {}
# Try without the view
res2 = subprocess.run(['psql', '-h', '/var/run/postgresql', '-U', 'hitdev', '-d', 'rrhh_barrios_mineros',
    '-Atc', "SELECT ci, COALESCE(apellido_paterno||' '||apellido_materno||' '||primer_nombre||' '||COALESCE(segundo_nombre,''), '') as name, tipo_personal FROM personal"],
    capture_output=True, text=True, env={'PGPASSWORD': 'bm-rrhh'})
for line in res2.stdout.strip().split('\n'):
    if '|' in line:
        parts = line.split('|', 2)
        ci = parts[0].strip()
        name = parts[1].strip()
        tipo = parts[2].strip() if len(parts) > 2 else 'PLANTA'
        db[ci] = name
        db_ci_tipo[ci] = tipo

# 3. Read ENTREGADO
z = zipfile.ZipFile('/media/hitdev/DatosLinux/RRHH-Barrios-Mineros/Statefolder/ENTREGADO CARPETAS.xlsx')
ns = {'s': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
ss_xml = z.read('xl/sharedStrings.xml')
sst = ET.fromstring(ss_xml)
strings = [si.find('.//s:t', ns).text or '' for si in sst.findall('.//s:si', ns)]
sheet_xml = z.read('xl/worksheets/sheet1.xml')
root = ET.fromstring(sheet_xml)

entregado = {}
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
        name_ent = col.get('C', '')
    else:
        name_ent = col.get('D', '')
    contrato = col.get('I', '')
    cargo = col.get('H', '')
    entregado[ci] = {'name': name_ent, 'contrato': contrato, 'cargo': cargo}

# Generate report
all_cis = sorted(set(list(asis.keys()) + list(db.keys()) + list(entregado.keys())))

out = '/media/hitdev/DatosLinux/RRHH-Barrios-Mineros/Statefolder/reporte_comparativo.csv'
with open(out, 'w', newline='') as f:
    w = csv.writer(f)
    w.writerow(['CI', 'Nombre', 'En ASIS', 'En DB', 'Tipo DB', 'En ENTREGADO', 'Contrato', 'Cargo', 'Estado'])
    
    for ci in all_cis:
        en_asis = 'SI' if ci in asis else 'NO'
        en_db = 'SI' if ci in db else 'NO'
        en_ent = 'SI' if ci in entregado else 'NO'
        tipo_db = db_ci_tipo.get(ci, '')
        
        # Best name
        name = db.get(ci, asis.get(ci, entregado.get(ci, {}).get('name', '')))
        contrato = entregado.get(ci, {}).get('contrato', '')[:60] if en_ent == 'SI' else ''
        cargo = entregado.get(ci, {}).get('cargo', '')[:60] if en_ent == 'SI' else ''
        
        # Estado
        if en_asis == 'SI' and en_db == 'SI' and en_ent == 'SI':
            estado = 'COMPLETO'
        elif en_asis == 'SI' and en_db == 'SI':
            estado = 'ASIS+DB'
        elif en_db == 'SI' and en_ent == 'SI':
            estado = 'DB+CONTRATO'
        elif en_asis == 'SI':
            estado = 'SOLO_ASIS'
        elif en_db == 'SI':
            estado = 'SOLO_DB'
        elif en_ent == 'SI':
            estado = 'SOLO_ENTREGADO'
        else:
            estado = 'DESCONOCIDO'
        
        w.writerow([ci, name[:80], en_asis, en_db, tipo_db, en_ent, contrato, cargo, estado])

print(f"Reporte generado: {out}")
print(f"Total registros: {len(all_cis)}")

# Summary
summary = {
    'SOLO_ASIS': 0, 'SOLO_DB': 0, 'SOLO_ENTREGADO': 0,
    'ASIS+DB': 0, 'DB+CONTRATO': 0, 'COMPLETO': 0
}
for ci in all_cis:
    a = ci in asis; d = ci in db; e = ci in entregado
    if a and d and e:
        summary['COMPLETO'] += 1
    elif a and d:
        summary['ASIS+DB'] += 1
    elif d and e:
        summary['DB+CONTRATO'] += 1
    elif a:
        summary['SOLO_ASIS'] += 1
    elif d:
        summary['SOLO_DB'] += 1
    elif e:
        summary['SOLO_ENTREGADO'] += 1

print("\nResumen:")
for k, v in sorted(summary.items(), key=lambda x: -x[1]):
    print(f"  {k}: {v}")
