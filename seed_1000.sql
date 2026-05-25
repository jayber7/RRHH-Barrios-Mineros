
-- Seed professions if they don't exist
INSERT INTO cat_profesiones (nombre_profesion) 
SELECT unnest(ARRAY['Medico General', 'Licenciada en Enfermeria', 'Auxiliar de Enfermeria', 'Bioquimico', 'Odontologo', 'Administrativo', 'Chofer', 'Manual'])
WHERE NOT EXISTS (SELECT 1 FROM cat_profesiones);

-- Seed 1000 records of personal
DO $$
DECLARE
    i INT;
    first_names TEXT[] := ARRAY['Juan', 'Maria', 'Jose', 'Ana', 'Pedro', 'Laura', 'Carlos', 'Elena', 'Luis', 'Sofia', 'Miguel', 'Lucia', 'Diego', 'Paula', 'Fernando', 'Marta', 'Ricardo', 'Carmen', 'Javier', 'Rosa'];
    last_names TEXT[] := ARRAY['Perez', 'Garcia', 'Lopez', 'Rodriguez', 'Mamani', 'Quispe', 'Flores', 'Condori', 'Vargas', 'Rojas', 'Guzman', 'Sosa', 'Mendoza', 'Justiniano', 'Arteaga', 'Villca', 'Choque', 'Callisaya', 'Ticona', 'Gomez'];
BEGIN
    FOR i IN 1..1000 LOOP
        BEGIN
            INSERT INTO personal (
                ci, 
                exp_id, 
                apellido_paterno, 
                apellido_materno, 
                primer_nombre, 
                segundo_nombre, 
                fecha_nacimiento, 
                profesion_id, 
                telefono
            ) VALUES (
                (2000000 + i)::TEXT, 
                (floor(random() * 9) + 1)::INT, 
                last_names[floor(random() * 20) + 1],
                last_names[floor(random() * 20) + 1],
                first_names[floor(random() * 20) + 1],
                first_names[floor(random() * 20) + 1],
                '1960-01-01'::DATE + (random() * 18000)::INT,
                (floor(random() * 8) + 1)::INT,
                (70000000 + floor(random() * 9999999))::TEXT
            );
        EXCEPTION WHEN unique_violation THEN
            -- Skip if CI already exists
            CONTINUE;
        END;
    END LOOP;
END $$;
