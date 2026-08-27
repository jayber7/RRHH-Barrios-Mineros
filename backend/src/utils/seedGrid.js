const db = require('../config/db');

const FRANJAS_DEFAULT = {
  manana: { inicio: '07:00', fin: '14:00', tipo: 'manana', cupo: 2 },
  tarde: { inicio: '14:00', fin: '21:00', tipo: 'tarde', cupo: 2 },
  noche: { inicio: '21:00', fin: '07:00', tipo: 'noche', cupo: 1 }
};

const HORAS_REQUERIDAS_DEFAULT = {
  TGN: 160,
  GOB: 144,
  'Contrato GAMO': 120,
  MINISTERIO: 160,
  MUNICIPIO: 144,
  HIPC: 144
};

const COLORES_SERVICIO = [
  '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
  '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1'
];

const seedGridServicios = async () => {
  const client = await db.connect();
  try {
    await client.query('BEGIN');

    // 1. Obtener unidades de servicio únicas desde vinculos_laborales
    const { rows: unidades } = await client.query(`
      SELECT DISTINCT unidad_servicio
      FROM vinculos_laborales
      WHERE unidad_servicio IS NOT NULL AND unidad_servicio != ''
      ORDER BY unidad_servicio
    `);

    console.log(`Encontradas ${unidades.length} unidades de servicio`);

    // 2. Obtener plantillas de turno existentes para inferir franjas
    const { rows: plantillas } = await client.query(`
      SELECT DISTINCT ON (codigo) codigo, nombre,
        lunes_entrada, lunes_salida, lunes_habilitado,
        martes_entrada, martes_salida, martes_habilitado,
        miercoles_entrada, miercoles_salida, miercoles_habilitado,
        jueves_entrada, jueves_salida, jueves_habilitado,
        viernes_entrada, vierves_salida, viernes_habilitado,
        sabado_entrada, sabado_salida, sabado_habilitado,
        domingo_entrada, domingo_salida, domingo_habilitado
      FROM turnos_plantilla
      WHERE activo = true
      ORDER BY codigo
    `);

    console.log(`Encontradas ${plantillas.length} plantillas de turno activas`);

    // 3. Para cada unidad, crear configuración de servicio
    for (let i = 0; i < unidades.length; i++) {
      const unidad = unidades[i].unidad_servicio;
      const color = COLORES_SERVICIO[i % COLORES_SERVICIO.length];

      // Inferir franjas desde plantillas más usadas en esa unidad
      const { rows: plantillasUnidad } = await client.query(`
        SELECT tp.lunes_entrada, tp.lunes_salida, tp.lunes_habilitado,
               tp.martes_entrada, tp.martes_salida, tp.martes_habilitado,
               tp.miercoles_entrada, tp.miercoles_salida, tp.miercoles_habilitado,
               tp.jueves_entrada, tp.jueves_salida, tp.jueves_habilitado,
               tp.viernes_entrada, tp.viernes_salida, tp.viernes_habilitado,
               tp.sabado_entrada, tp.sabado_salida, tp.sabado_habilitado,
               tp.domingo_entrada, tp.domingo_salida, tp.domingo_habilitado
        FROM turnos_asignados ta
        JOIN turnos_plantilla tp ON ta.turno_plantilla_id = tp.id
        JOIN vinculos_laborales vl ON ta.personal_id = vl.personal_id
        WHERE vl.unidad_servicio = $1
          AND tp.activo = true
        GROUP BY tp.id
        ORDER BY COUNT(*) DESC
        LIMIT 3
      `, [unidad]);

      let franjasPorDia = {};

      if (plantillasUnidad.length > 0) {
        // Usar la plantilla más común para definir franjas base
        const tp = plantillasUnidad[0];
        const dias = ['domingo','lunes','martes','miercoles','jueves','viernes','sabado'];
        
        dias.forEach((dia, idx) => {
          const entrada = tp[`${dia}_entrada`];
          const salida = tp[`${dia}_salida`];
          const habilitado = tp[`${dia}_habilitado`];
          
          if (habilitado && entrada && salida) {
            // Determinar tipo de franja
            const hEntrada = parseInt(entrada.split(':')[0]);
            let tipo = 'personalizada';
            if (hEntrada >= 6 && hEntrada < 12) tipo = 'manana';
            else if (hEntrada >= 12 && hEntrada < 19) tipo = 'tarde';
            else if (hEntrada >= 19 || hEntrada < 6) tipo = 'noche';
            
            // Para día de semana (0-6) y día del mes (1-31) usamos el día de semana
            franjasPorDia[idx] = [{
              inicio: entrada.slice(0,5),
              fin: salida.slice(0,5),
              tipo,
              cupo: 2
            }];
          }
        });
      } else {
        // Default: mañana y tarde todos los días
        for (let d = 0; d < 7; d++) {
          franjasPorDia[d] = [
            { ...FRANJAS_DEFAULT.manana },
            { ...FRANJAS_DEFAULT.tarde }
          ];
        }
      }

      // Insertar servicio
      await client.query(`
        INSERT INTO turnos_grid_servicios (unidad_servicio, franjas_por_dia, horas_requeridas_mes, color_identificacion)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (unidad_servicio) DO UPDATE SET
          franjas_por_dia = EXCLUDED.franjas_por_dia,
          horas_requeridas_mes = EXCLUDED.horas_requeridas_mes,
          color_identificacion = EXCLUDED.color_identificacion,
          updated_at = CURRENT_TIMESTAMP
      `, [unidad, JSON.stringify(franjasPorDia), JSON.stringify(HORAS_REQUERIDAS_DEFAULT), color]);

      console.log(`✓ Servicio configurado: ${unidad}`);
    }

    // 4. Generar grilla para mes actual y siguiente
    const ahora = new Date();
    const mesActual = ahora.getMonth() + 1;
    const anioActual = ahora.getFullYear();
    const mesSiguiente = mesActual === 12 ? 1 : mesActual + 1;
    const anioSiguiente = mesActual === 12 ? anioActual + 1 : anioActual;

    const { rows: servicios } = await client.query('SELECT id FROM turnos_grid_servicios WHERE activo = true');
    
    for (const s of servicios) {
      await client.query('SELECT generar_grilla_mensual($1, $2, $3)', [s.id, anioActual, mesActual]);
      await client.query('SELECT generar_grilla_mensual($1, $2, $3)', [s.id, anioSiguiente, mesSiguiente]);
      console.log(`✓ Grilla generada para servicio ${s.id}: ${mesActual}/${anioActual} y ${mesSiguiente}/${anioSiguiente}`);
    }

    await client.query('COMMIT');
    console.log('\n✅ Seed de turnos_grid completado exitosamente');

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error en seedGrid:', error);
    throw error;
  } finally {
    client.release();
  }
};

const seedCuotas = async () => {
  const client = await db.connect();
  try {
    await client.query('BEGIN');

    // Obtener personal con vinculo laboral activo
    const { rows: personal } = await client.query(`
      SELECT p.id as personal_id, vl.fuente_financiamiento_id, vl.tipo_personal_id,
             vl.carga_horaria, cff.nombre_fuente, ctp.nombre_tipo
      FROM personal p
      JOIN vinculos_laborales vl ON p.id = vl.personal_id
      LEFT JOIN cat_fuentes_financiamiento cff ON vl.fuente_financiamiento_id = cff.id
      LEFT JOIN cat_tipos_personal ctp ON vl.tipo_personal_id = ctp.id
      WHERE vl.fecha_fin IS NULL
        AND p.activo = true
    `);

    console.log(`Procesando cuotas para ${personal.length} empleados...`);

    const ahora = new Date();
    const mesActual = ahora.getMonth() + 1;
    const anioActual = ahora.getFullYear();
    const mesSiguiente = mesActual === 12 ? 1 : mesActual + 1;
    const anioSiguiente = mesActual === 12 ? anioActual + 1 : anioActual;

    for (const p of personal) {
      // Parsear carga_horaria (string como "160" o "40h semanal")
      let horas = 160; // default
      if (p.carga_horaria) {
        const match = p.carga_horaria.match(/(\d+)/);
        if (match) horas = parseInt(match[1]);
        // Si es semanal, multiplicar por ~4.33
        if (p.carga_horaria.toLowerCase().includes('semanal') || p.carga_horaria.toLowerCase().includes('semana')) {
          horas = Math.round(horas * 4.33);
        }
      }

      // Insertar cuota para mes actual y siguiente
      for (const { anio, mes } of [{anio: anioActual, mes: mesActual}, {anio: anioSiguiente, mes: mesSiguiente}]) {
        await client.query(`
          INSERT INTO turnos_grid_cuotas (personal_id, anio, mes, horas_obligatorias, fuente_financiamiento_id, tipo_contrato_id, origen)
          VALUES ($1, $2, $3, $4, $5, $6, 'AUTO')
          ON CONFLICT (personal_id, anio, mes, fuente_financiamiento_id, tipo_contrato_id) DO UPDATE SET
            horas_obligatorias = EXCLUDED.horas_obligatorias,
            updated_at = CURRENT_TIMESTAMP
        `, [p.personal_id, anio, mes, horas, p.fuente_financiamiento_id, p.tipo_personal_id]);
      }
    }

    await client.query('COMMIT');
    console.log('✅ Cuotas pobladas exitosamente');

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error en seedCuotas:', error);
    throw error;
  } finally {
    client.release();
  }
};

const main = async () => {
  try {
    await seedGridServicios();
    await seedCuotas();
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
};

main();