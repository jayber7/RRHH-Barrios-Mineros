#!/bin/bash
# Uso: PGPASSWORD=xxx bash cargar_biometrico_2026.sh
DB_URL="postgresql://hitdev@dpg-d8af3uugvqtc73cql9i0-a.virginia-postgres.render.com:5432/rrhh_barrios_mineros"
psql "$DB_URL" -c "TRUNCATE biometrico_logs_raw;"
psql "$DB_URL" -c "\COPY biometrico_logs_raw FROM 'biometrico_2026.csv' WITH CSV HEADER;"
psql "$DB_URL" -c "SELECT setval('biometrico_logs_raw_id_seq', COALESCE((SELECT MAX(id) FROM biometrico_logs_raw), 1));"
echo "Cargados: $(PGPASSWORD=$PGPASSWORD psql "$DB_URL" -t -A -c 'SELECT COUNT(*) FROM biometrico_logs_raw') registros"
