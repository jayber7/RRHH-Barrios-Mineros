const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const PersonalModel = require('../models/personalModel');
const ExcelService = require('../services/excelService');
const ImportService = require('../services/importService');
const db = require('../config/db');

const getAllPersonal = async (req, res) => {
  try {
    const { nombre, ci, item, fuentes, estado, page = 1, limit = 50, sort, order } = req.query;
    const offset = (page - 1) * limit;
    
    const fuentesArray = fuentes ? (Array.isArray(fuentes) ? fuentes : fuentes.split(',')) : [];

    const personal = await PersonalModel.getAll({ 
      nombre, 
      ci, 
      item,
      fuentes: fuentesArray,
      estado: estado || 'ACTIVO',
      sort,
      order,
      limit: parseInt(limit), 
      offset: parseInt(offset) 
    });

    const totalCount = personal.length > 0 ? parseInt(personal[0].total_count) : 0;
    
    res.json({
      data: personal,
      pagination: {
        total: totalCount,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(totalCount / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createPersonal = async (req, res) => {
  try {
    const newPersonal = await PersonalModel.create(req.body);
    res.status(201).json(newPersonal);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updatePersonal = async (req, res) => {
  try {
    const updated = await PersonalModel.update(req.params.id, req.body);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const exportPersonal = async (req, res) => {
  try {
    const personal = await PersonalModel.getAll(req.query);
    const buffer = await ExcelService.exportPersonalToExcel(personal);
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=personal.xlsx');
    res.send(buffer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const importPersonal = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No se subió ningún archivo' });
    const results = await ImportService.importPersonalFromExcel(req.file.buffer);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCatalogos = async (req, res) => {
  try {
    const { rows: expediciones } = await db.query('SELECT * FROM cat_expediciones ORDER BY sigla');
    const { rows: profesiones } = await db.query('SELECT * FROM cat_profesiones ORDER BY nombre_profesion');
    const { rows: fuentes } = await db.query('SELECT * FROM cat_fuentes_financiamiento ORDER BY nombre_fuente');
    const { rows: tipos } = await db.query('SELECT * FROM cat_tipos_personal ORDER BY nombre_tipo');
    const { rows: establecimientos } = await db.query('SELECT * FROM establecimientos ORDER BY nombre_establecimiento');
    const { rows: unidades_servicios } = await db.query('SELECT * FROM cat_unidades_servicios ORDER BY nombre_unidad');
    
    res.json({ expediciones, profesiones, fuentes, tipos, establecimientos, unidades_servicios });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getHistorial = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await db.query(`
      SELECT * FROM historial_movimientos 
      WHERE personal_id = $1 
      ORDER BY fecha_movimiento DESC, id DESC
    `, [id]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateEstado = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado, fecha_baja } = req.body;
    
    if (!['ACTIVO', 'INACTIVO'].includes(estado)) {
      return res.status(400).json({ error: 'Estado debe ser ACTIVO o INACTIVO' });
    }

    await db.query(
      'UPDATE personal SET estado = $1, fecha_baja = $2 WHERE id = $3',
      [estado, estado === 'INACTIVO' ? (fecha_baja || new Date()) : null, id]
    );

    res.json({ success: true, estado, fecha_baja: estado === 'INACTIVO' ? (fecha_baja || new Date()) : null });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getContratosPorVencer = async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + parseInt(days));

    const { rows: porVencer } = await db.query(`
      SELECT p.id, p.ci, p.primer_nombre, p.apellido_paterno, p.apellido_materno,
             vl.fecha_fin_contrato, vl.cargo_actual, vl.unidad_servicio, vl.identificador_laboral
      FROM personal p
      JOIN vinculos_laborales vl ON p.id = vl.personal_id
      WHERE p.estado = 'ACTIVO'
        AND vl.fecha_fin_contrato IS NOT NULL
        AND vl.fecha_fin_contrato <= $1
        AND vl.fecha_fin_contrato >= $2
      ORDER BY vl.fecha_fin_contrato ASC
    `, [futureDate.toISOString().split('T')[0], today.toISOString().split('T')[0]]);

    const { rows: vencidos } = await db.query(`
      SELECT p.id, p.ci, p.primer_nombre, p.apellido_paterno, p.apellido_materno,
             vl.fecha_fin_contrato, vl.cargo_actual, vl.unidad_servicio, vl.identificador_laboral
      FROM personal p
      JOIN vinculos_laborales vl ON p.id = vl.personal_id
      WHERE p.estado = 'ACTIVO'
        AND vl.fecha_fin_contrato IS NOT NULL
        AND vl.fecha_fin_contrato < $1
      ORDER BY vl.fecha_fin_contrato ASC
    `, [today.toISOString().split('T')[0]]);

    const { rows: stats } = await db.query(`
      SELECT 
        COUNT(*) FILTER (WHERE p.estado = 'ACTIVO') as activos,
        COUNT(*) FILTER (WHERE p.estado = 'INACTIVO') as inactivos
      FROM personal p
    `);

    res.json({
      porVencer,
      vencidos,
      stats: {
        activos: parseInt(stats[0].activos),
        inactivos: parseInt(stats[0].inactivos),
        porVencerCount: porVencer.length,
        vencidosCount: vencidos.length
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const autoInactivarVencidos = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    const { rowCount } = await db.query(`
      UPDATE personal SET estado = 'INACTIVO', fecha_baja = $1
      WHERE id IN (
        SELECT p.id FROM personal p
        JOIN vinculos_laborales vl ON p.id = vl.personal_id
        WHERE p.estado = 'ACTIVO'
          AND vl.fecha_fin_contrato IS NOT NULL
          AND vl.fecha_fin_contrato < $1
      )
    `, [today]);

    res.json({ success: true, inactivados: rowCount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllPersonal,
  createPersonal,
  updatePersonal,
  exportPersonal,
  importPersonal,
  getCatalogos,
  getHistorial,
  updateEstado,
  getContratosPorVencer,
  autoInactivarVencidos,
  upload
};
