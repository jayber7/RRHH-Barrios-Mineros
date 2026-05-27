#!/usr/bin/env python3
"""
Import ASIS attendance data into PostgreSQL.

Usage:
  python3 sql/import_asis_attendance.py [--transactions] [--justifications] [--all]
"""
import csv
import subprocess
import sys
import os

ASIS_DIR = 'Statefolder/Asis/export/csv'
PSQL = ['psql', '-h', '/var/run/postgresql', '-U', 'hitdev', '-d', 'rrhh_barrios_mineros']


def get_known_user_ids():
    r = subprocess.run(PSQL + ['-t', '-A', '-c',
                       "SELECT biometrico_id FROM personal WHERE biometrico_id IS NOT NULL"],
                       capture_output=True, text=True)
    ids = set()
    for line in r.stdout.strip().split('\n'):
        line = line.strip()
        if line:
            ids.add(line)
    return ids


def get_biometrico_to_personal_map():
    r = subprocess.run(PSQL + ['-t', '-A', '-c',
                       "SELECT biometrico_id, id FROM personal WHERE biometrico_id IS NOT NULL"],
                       capture_output=True, text=True)
    mapping = {}
    for line in r.stdout.strip().split('\n'):
        line = line.strip()
        if line and '|' in line:
            bio, pid = line.split('|')
            mapping[bio.strip()] = pid.strip()
    return mapping


def import_transactions():
    known = get_known_user_ids()
    csv_path = os.path.join(ASIS_DIR, 'Transactions.csv')
    if not os.path.exists(csv_path):
        print(f"ERROR: {csv_path} not found")
        return
    total = 0
    imported = 0
    skipped = 0

    print("Importing Transactions.csv -> biometrico_logs_raw ...")

    # Build data file for psql COPY
    lines = []
    with open(csv_path, newline='', encoding='utf-8-sig') as f:
        reader = csv.DictReader(f)
        for row in reader:
            total += 1
            uid = row['TS_sUserID'].strip()
            if uid not in known:
                skipped += 1
                continue

            date_str = row['TS_dDate'].strip()[:10]
            time_str = row['Hora'].strip()
            if not time_str or time_str == '0':
                skipped += 1
                continue

            ntype = row['TS_nType'].strip()
            estado = 0 if ntype == '0' else 1

            lines.append(f"{uid}|{date_str} {time_str}:00|1|{estado}")
            imported += 1
            if imported % 50000 == 0:
                print(f"  {imported} rows processed...")

    # Use psql with STDIN to pipe the data + SQL in a single connection
    data = '\n'.join(lines)

    sql = f"""
    CREATE TEMP TABLE _tmp_tx (biometrico_id INT, ts TIMESTAMP, verif INT, estado INT);
    COPY _tmp_tx FROM STDIN WITH DELIMITER '|';
    {'' if lines else '-- '}
    INSERT INTO biometrico_logs_raw (biometrico_id, timestamp, verificacion_tipo, estado_asistencia)
    SELECT DISTINCT biometrico_id, ts, verif, estado FROM _tmp_tx
    ON CONFLICT (biometrico_id, timestamp) DO NOTHING;
    DROP TABLE _tmp_tx;
    """

    proc = subprocess.Popen(PSQL + ['-c', sql],
                           stdin=subprocess.PIPE, text=True,
                           stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    stdout, stderr = proc.communicate(input=data)

    if stderr.strip():
        print(f"  PSQL stderr: {stderr.strip()[-200:]}")

    # Count results
    r = subprocess.run(PSQL + ['-t', '-A', '-c',
                        "SELECT COUNT(*) FROM biometrico_logs_raw"],
                        capture_output=True, text=True)
    actual = r.stdout.strip()
    print(f"  Transactions: {total} total, {imported} matched DB, {actual} in biometrico_logs_raw")


def import_justifications():
    mapping = get_biometrico_to_personal_map()
    csv_path = os.path.join(ASIS_DIR, 'justificacionesNuevas.csv')
    if not os.path.exists(csv_path):
        print(f"ERROR: {csv_path} not found")
        return
    total = 0
    imported = 0
    skipped = 0

    print("Importing justificacionesNuevas.csv -> justificaciones ...")

    lines = []
    with open(csv_path, newline='', encoding='utf-8-sig') as f:
        reader = csv.DictReader(f)
        for row in reader:
            total += 1
            codigo = row['Codigo'].strip()
            personal_id = mapping.get(codigo)
            if not personal_id:
                skipped += 1
                continue

            fecha_str = row['fecha'].strip()[:10]
            tipo_raw = row['tipo'].strip().upper()
            tipo = 'ENTRADA' if tipo_raw == 'ENTRADA' else ('SALIDA' if tipo_raw == 'SALIDA' else 'AMBOS')

            hora = row['Hora'].strip()
            hora_txt = '\\N'
            if hora and hora != '00:00':
                parts = hora.split(':')
                if len(parts) == 2 and parts[0].isdigit() and parts[1].isdigit() and int(parts[1]) < 60:
                    hora_txt = f"{hora}:00"

            motivo = row['Motivo'].strip().replace('|', ' ').replace('\n', ' ')
            justificante = row['Justificante'].strip().replace('|', ' ').replace('\n', ' ')[:255]

            lines.append(f"{personal_id}|{fecha_str}|{tipo}|{hora_txt}|{motivo}|{justificante}")
            imported += 1

    data = '\n'.join(lines)

    sql = f"""
    CREATE TEMP TABLE _tmp_jf (
        pid INT, fecha DATE, tipo VARCHAR(20),
        hora_txt TEXT, motivo TEXT, justif TEXT
    );
    COPY _tmp_jf FROM STDIN WITH DELIMITER '|' NULL '\\N';
    {'' if lines else '-- '}
    INSERT INTO justificaciones (personal_id, fecha, tipo, hora_justificada, motivo_detalle, justificante)
    SELECT pid, fecha, tipo,
           NULLIF(hora_txt, '')::time,
           motivo, justif
    FROM _tmp_jf
    ON CONFLICT DO NOTHING;
    DROP TABLE _tmp_jf;
    """

    proc = subprocess.Popen(PSQL + ['-c', sql],
                           stdin=subprocess.PIPE, text=True,
                           stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    stdout, stderr = proc.communicate(input=data)
    if stderr.strip():
        print(f"  PSQL stderr: {stderr.strip()[-200:]}")

    print(f"  Justificaciones: {total} total, {imported} imported, {skipped} skipped")


if __name__ == '__main__':
    do_tx = '--transactions' in sys.argv or len(sys.argv) == 1
    do_jf = '--justifications' in sys.argv or len(sys.argv) == 1
    do_all = '--all' in sys.argv

    if do_all or do_tx:
        import_transactions()
    if do_all or do_jf:
        import_justifications()
    print("Done.")
