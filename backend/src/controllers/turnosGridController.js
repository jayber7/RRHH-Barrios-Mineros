const TurnosGridService = require('../services/turnosGridService');
const TurnosGridCuotaService = require('../services/turnosGridCuotaService');
const TurnosGridAuditService = require('../services/turnosGridAuditService');

class TurnosGridController {
  // ==================== SERVICIOS ====================
  static async getServicios(req, res) {
    try {
      const servicios = await TurnosGridService.getServicios(req.query.activo === 'true');
      res.json(servicios);
    } catch (error) {
      console.error('Error getServicios:', error);
      res.status(500).json({ error: 'Error al obtener servicios' });
    }
  }

  static async getServicio(req, res) {
    try {
      const servicio = await TurnosGridService.getServicioById(req.params.id);
      if (!servicio) return res.status(404).json({ error: 'Servicio no encontrado' });
      res.json(servicio);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener servicio' });
    }
  }

  static async createServicio(req, res) {
    try {
      const servicio = await TurnosGridService.createServicio(req.body);
      res.status(201).json(servicio);
    } catch (error) {
      console.error('Error createServicio:', error);
      if (error.code === '23505') return res.status(400).json({ error: 'La unidad de servicio ya existe' });
      res.status(500).json({ error: 'Error al crear servicio' });
    }
  }

  static async updateServicio(req, res) {
    try {
      const servicio = await TurnosGridService.updateServicio(req.params.id, req.body);
      if (!servicio) return res.status(404).json({ error: 'Servicio no encontrado' });
      res.json(servicio);
    } catch (error) {
      if (error.code === '23505') return res.status(400).json({ error: 'La unidad de servicio ya existe' });
      res.status(500).json({ error: 'Error al actualizar servicio' });
    }
  }

  // ==================== GRILLA MENSUAL ====================
  static async generarGrilla(req, res) {
    try {
      const { servicioId } = req.params;
      const { mes, anio } = req.query;
      if (!mes || !anio) return res.status(400).json({ error: 'Mes y año requeridos' });
      
      const grilla = await TurnosGridService.generarGrillaMensual(parseInt(servicioId), parseInt(anio), parseInt(mes));
      res.json({ message: 'Grilla generada', grilla });
    } catch (error) {
      console.error('Error generarGrilla:', error);
      res.status(500).json({ error: 'Error al generar grilla' });
    }
  }

  static async getGrilla(req, res) {
    try {
      const { servicioId } = req.params;
      const { mes, anio } = req.query;
      if (!mes || !anio) return res.status(400).json({ error: 'Mes y año requeridos' });
      
      const grilla = await TurnosGridService.getGrillaConAsignaciones(parseInt(servicioId), parseInt(anio), parseInt(mes));
      res.json(grilla);
    } catch (error) {
      console.error('Error getGrilla:', error);
      res.status(500).json({ error: 'Error al obtener grilla' });
    }
  }

  // ==================== PERSONAL DISPONIBLE ====================
  static async getPersonalDisponible(req, res) {
    try {
      const { servicioId } = req.params;
      const { mes, anio, fuente_financiamiento_id, tipo_personal_id, q } = req.query;
      if (!mes || !anio) return res.status(400).json({ error: 'Mes y año requeridos' });

      const personal = await TurnosGridService.getPersonalDisponible(
        parseInt(servicioId), 
        parseInt(anio), 
        parseInt(mes),
        { fuente_financiamiento_id: fuente_financiamiento_id ? parseInt(fuente_financiamiento_id) : null,
          tipo_personal_id: tipo_personal_id ? parseInt(tipo_personal_id) : null,
          q }
      );
      res.json(personal);
    } catch (error) {
      console.error('Error getPersonalDisponible:', error);
      res.status(500).json({ error: 'Error al obtener personal disponible' });
    }
  }

  // ==================== ASIGNACIONES ====================
  static async createAsignacion(req, res) {
    try {
      const asignacion = await TurnosGridService.createAsignacion(req.body, req.usuario.id);
      res.status(201).json(asignacion);
    } catch (error) {
      console.error('Error createAsignacion:', error);
      if (error.code === '23505') return res.status(400).json({ error: 'El personal ya tiene asignación en esta celda' });
      res.status(500).json({ error: 'Error al crear asignación' });
    }
  }

  static async updateAsignacion(req, res) {
    try {
      const asignacion = await TurnosGridService.updateAsignacion(req.params.id, req.body, req.usuario.id);
      if (!asignacion) return res.status(404).json({ error: 'Asignación no encontrada' });
      res.json(asignacion);
    } catch (error) {
      if (error.code === '23505') return res.status(400).json({ error: 'El personal ya tiene asignación en esta celda' });
      res.status(500).json({ error: 'Error al actualizar asignación' });
    }
  }

  static async deleteAsignacion(req, res) {
    try {
      const deleted = await TurnosGridService.deleteAsignacion(req.params.id);
      if (!deleted) return res.status(404).json({ error: 'Asignación no encontrada' });
      res.json({ message: 'Asignación eliminada' });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar asignación' });
    }
  }

  // ==================== BATCH SAVE ====================
  static async batchSave(req, res) {
    try {
      const { servicioId } = req.params;
      const { mes, anio, cambios } = req.body;
      
      if (!mes || !anio || !cambios || !Array.isArray(cambios)) {
        return res.status(400).json({ error: 'mes, anio y cambios (array) son requeridos' });
      }

      const ip = req.ip || req.connection.remoteAddress;
      const userAgent = req.get('User-Agent');

      const resultado = await TurnosGridService.batchSave(
        parseInt(servicioId),
        parseInt(anio),
        parseInt(mes),
        cambios,
        req.usuario.id,
        ip,
        userAgent
      );

      res.json({ message: 'Cambios guardados', ...resultado });
    } catch (error) {
      console.error('Error batchSave:', error);
      res.status(500).json({ error: 'Error al guardar cambios' });
    }
  }

  // ==================== CARGA HORARIA ====================
  static async getCargaHoraria(req, res) {
    try {
      const { servicioId } = req.params;
      const { mes, anio } = req.query;
      if (!mes || !anio) return res.status(400).json({ error: 'Mes y año requeridos' });

      const [resumen, alertas] = await Promise.all([
        TurnosGridService.getCargaHorariaResumen(parseInt(servicioId), parseInt(anio), parseInt(mes)),
        TurnosGridService.getAlertasCarga(parseInt(servicioId), parseInt(anio), parseInt(mes))
      ]);

      res.json({ resumen, alertas });
    } catch (error) {
      console.error('Error getCargaHoraria:', error);
      res.status(500).json({ error: 'Error al obtener carga horaria' });
    }
  }

  // ==================== CUOTAS ====================
  static async recalcularCuotas(req, res) {
    try {
      const { anio, mes, desde_anio, desde_mes, hasta_anio, hasta_mes } = req.body;
      
      if (desde_anio && desde_mes && hasta_anio && hasta_mes) {
        const resultado = await TurnosGridCuotaService.recalcularCuotasRango(
          parseInt(desde_anio), parseInt(desde_mes), parseInt(hasta_anio), parseInt(hasta_mes)
        );
        return res.json({ message: 'Cuotas recalculadas para rango', resultado });
      }
      
      if (!anio || !mes) return res.status(400).json({ error: 'anio y mes requeridos' });
      
      const resultado = await TurnosGridCuotaService.recalcularCuotasMes(parseInt(anio), parseInt(mes));
      res.json({ message: 'Cuotas recalculadas', resultado });
    } catch (error) {
      console.error('Error recalcularCuotas:', error);
      res.status(500).json({ error: 'Error al recalcular cuotas' });
    }
  }

  static async setCuotaManual(req, res) {
    try {
      const { personal_id, anio, mes, horas_obligatorias, fuente_financiamiento_id, tipo_contrato_id, observaciones } = req.body;
      if (!personal_id || !anio || !mes || !horas_obligatorias) {
        return res.status(400).json({ error: 'personal_id, anio, mes, horas_obligatorias requeridos' });
      }
      const cuota = await TurnosGridCuotaService.setCuotaManual(
        personal_id, anio, mes, horas_obligatorias, fuente_financiamiento_id, tipo_contrato_id, observaciones
      );
      res.json(cuota);
    } catch (error) {
      console.error('Error setCuotaManual:', error);
      res.status(500).json({ error: 'Error al establecer cuota manual' });
    }
  }

  static async getCuotasServicio(req, res) {
    try {
      const { servicioId } = req.params;
      const { mes, anio } = req.query;
      if (!mes || !anio) return res.status(400).json({ error: 'Mes y año requeridos' });
      
      const cuotas = await TurnosGridCuotaService.getCuotasServicio(parseInt(servicioId), parseInt(anio), parseInt(mes));
      res.json(cuotas);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener cuotas' });
    }
  }

  // ==================== AUDITORÍA ====================
  static async getAuditoria(req, res) {
    try {
      const { servicioId } = req.params;
      const filtros = { 
        ...req.query, 
        servicio_id: servicioId ? parseInt(servicioId) : undefined 
      };
      const resultado = await TurnosGridAuditService.getHistorial(filtros);
      res.json(resultado);
    } catch (error) {
      console.error('Error getAuditoria:', error);
      res.status(500).json({ error: 'Error al obtener auditoría' });
    }
  }

  static async getAuditoriaPersonal(req, res) {
    try {
      const { personalId } = req.params;
      const { anio, mes, servicio_id } = req.query;
      if (!anio || !mes) return res.status(400).json({ error: 'anio y mes requeridos' });
      
      const historial = await TurnosGridAuditService.getHistorialPersonal(
        parseInt(personalId), parseInt(anio), parseInt(mes), servicio_id ? parseInt(servicio_id) : null
      );
      res.json(historial);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener historial personal' });
    }
  }

  // ==================== VALIDACIONES ====================
  static async validarSolapamiento(req, res) {
    try {
      const { personal_id, grid_mensual_id, exclude_id } = req.query;
      if (!personal_id || !grid_mensual_id) return res.status(400).json({ error: 'personal_id y grid_mensual_id requeridos' });
      
      const solapamientos = await TurnosGridService.validarSolapamiento(
        parseInt(personal_id), parseInt(grid_mensual_id), exclude_id ? parseInt(exclude_id) : null
      );
      res.json({ solapamientos, tiene_solapamiento: solapamientos.length > 0 });
    } catch (error) {
      res.status(500).json({ error: 'Error al validar solapamiento' });
    }
  }

  static async getCupoDisponible(req, res) {
    try {
      const { grid_mensual_id } = req.params;
      const cupo = await TurnosGridService.getCupoDisponible(parseInt(grid_mensual_id));
      res.json(cupo);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener cupo' });
    }
  }
}

module.exports = TurnosGridController;