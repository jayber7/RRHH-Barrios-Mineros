const TurnosService = require('../services/turnosService');

class TurnosController {
  static async getPlantillas(req, res) {
    try {
      const plantillas = await TurnosService.getAllPlantillas(req.query.activo);
      res.json(plantillas);
    } catch (error) {
      console.error('Error al obtener plantillas:', error);
      res.status(500).json({ error: 'Error al obtener plantillas de turno' });
    }
  }

  static async getPlantilla(req, res) {
    try {
      const plantilla = await TurnosService.getPlantillaById(req.params.id);
      if (!plantilla) return res.status(404).json({ error: 'Plantilla no encontrada' });
      res.json(plantilla);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener plantilla' });
    }
  }

  static async createPlantilla(req, res) {
    try {
      const plantilla = await TurnosService.createPlantilla(req.body);
      res.status(201).json(plantilla);
    } catch (error) {
      console.error('Error al crear plantilla:', error);
      if (error.code === '23505') return res.status(400).json({ error: 'El código ya existe' });
      res.status(500).json({ error: 'Error al crear plantilla' });
    }
  }

  static async updatePlantilla(req, res) {
    try {
      const plantilla = await TurnosService.updatePlantilla(req.params.id, req.body);
      if (!plantilla) return res.status(404).json({ error: 'Plantilla no encontrada' });
      res.json(plantilla);
    } catch (error) {
      if (error.code === '23505') return res.status(400).json({ error: 'El código ya existe' });
      res.status(500).json({ error: 'Error al actualizar plantilla' });
    }
  }

  static async deletePlantilla(req, res) {
    try {
      const deleted = await TurnosService.deletePlantilla(req.params.id);
      if (!deleted) return res.status(404).json({ error: 'Plantilla no encontrada' });
      res.json({ message: 'Plantilla eliminada correctamente' });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar plantilla' });
    }
  }

  static async getAsignados(req, res) {
    try {
      const asignados = await TurnosService.getAllAsignados(req.query);
      res.json(asignados);
    } catch (error) {
      console.error('Error al obtener asignaciones:', error);
      res.status(500).json({ error: 'Error al obtener asignaciones de turno' });
    }
  }

  static async getAsignado(req, res) {
    try {
      const asignado = await TurnosService.getAsignadoById(req.params.id);
      if (!asignado) return res.status(404).json({ error: 'Asignación no encontrada' });
      res.json(asignado);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener asignación' });
    }
  }

  static async createAsignado(req, res) {
    try {
      const asignado = await TurnosService.createAsignado(req.body);
      res.status(201).json(asignado);
    } catch (error) {
      console.error('Error al crear asignación:', error);
      res.status(500).json({ error: 'Error al asignar turno' });
    }
  }

  static async updateAsignado(req, res) {
    try {
      const asignado = await TurnosService.updateAsignado(req.params.id, req.body);
      if (!asignado) return res.status(404).json({ error: 'Asignación no encontrada' });
      res.json(asignado);
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar asignación' });
    }
  }

  static async deleteAsignado(req, res) {
    try {
      const deleted = await TurnosService.deleteAsignado(req.params.id);
      if (!deleted) return res.status(404).json({ error: 'Asignación no encontrada' });
      res.json({ message: 'Asignación eliminada correctamente' });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar asignación' });
    }
  }

  static async deleteAsignadosByPersonal(req, res) {
    try {
      const { personal_id } = req.query;
      if (!personal_id) return res.status(400).json({ error: 'personal_id requerido' });
      const count = await TurnosService.deleteAsignadosByPersonal(personal_id);
      res.json({ message: `${count} asignaciones eliminadas` });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar asignaciones' });
    }
  }

  static async getTurnoEmpleado(req, res) {
    try {
      const { personalId } = req.params;
      const fecha = req.query.fecha || new Date().toISOString().split('T')[0];
      const turno = await TurnosService.getTurnoEmpleado(personalId, fecha);
      res.json(turno || { message: 'Sin turno asignado' });
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener turno del empleado' });
    }
  }

  static async getCalendario(req, res) {
    try {
      const { mes, anio, servicio } = req.query;
      if (!mes || !anio) return res.status(400).json({ error: 'Mes y año requeridos' });
      const data = await TurnosService.getCalendario(parseInt(mes), parseInt(anio), servicio);
      res.json(data);
    } catch (error) {
      console.error('Error al obtener calendario:', error);
      res.status(500).json({ error: 'Error al obtener calendario' });
    }
  }

  static async getCalendarioDia(req, res) {
    try {
      const { mes, anio, dia } = req.query;
      if (!mes || !anio || !dia) return res.status(400).json({ error: 'Mes, año y día requeridos' });
      const data = await TurnosService.getCalendarioDia(parseInt(mes), parseInt(anio), parseInt(dia));
      res.json(data);
    } catch (error) {
      console.error('Error al obtener detalle del día:', error);
      res.status(500).json({ error: 'Error al obtener detalle del día' });
    }
  }

  static async getPersonalSinTurno(req, res) {
    try {
      const personal = await TurnosService.getPersonalSinTurno();
      res.json(personal);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener personal sin turno' });
    }
  }

  static async getYears(req, res) {
    try {
      const years = await TurnosService.getYearsAsignados();
      res.json(years);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener años' });
    }
  }

  static async cloneAsignaciones(req, res) {
    try {
      const { desde, hasta } = req.body;
      if (!desde || !hasta) return res.status(400).json({ error: 'desde y hasta son requeridos' });
      const count = await TurnosService.cloneAsignaciones(parseInt(desde), parseInt(hasta));
      res.json({ message: `${count} asignaciones clonadas de ${desde} a ${hasta}` });
    } catch (error) {
      console.error('Error al clonar asignaciones:', error);
      res.status(500).json({ error: 'Error al clonar asignaciones' });
    }
  }
}

module.exports = TurnosController;
