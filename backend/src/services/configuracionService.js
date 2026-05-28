const db = require('../config/db');

class ConfiguracionService {
  static _cache = {};
  static _cacheTime = 0;
  static _cacheTTL = 30000;

  static async _loadAll() {
    const now = Date.now();
    if (now - this._cacheTime < this._cacheTTL && Object.keys(this._cache).length > 0) {
      return this._cache;
    }
    const { rows } = await db.query('SELECT clave, valor, tipo FROM configuracion_sistema');
    this._cache = {};
    for (const r of rows) {
      const val = r.valor;
      if (r.tipo === 'integer') this._cache[r.clave] = parseInt(val);
      else if (r.tipo === 'boolean') this._cache[r.clave] = val === 'true';
      else if (r.tipo === 'json') {
        try { this._cache[r.clave] = JSON.parse(val); } catch { this._cache[r.clave] = val; }
      } else {
        this._cache[r.clave] = val;
      }
    }
    this._cacheTime = now;
    return this._cache;
  }

  static invalidateCache() {
    this._cache = {};
    this._cacheTime = 0;
  }

  static async get(clave, defaultValue = null) {
    const all = await this._loadAll();
    return clave in all ? all[clave] : defaultValue;
  }

  static async getAll() {
    const { rows } = await db.query(
      'SELECT clave, valor, tipo, descripcion, categoria, editable FROM configuracion_sistema ORDER BY categoria, clave'
    );
    return rows;
  }

  static async update(clave, valor) {
    const { rows } = await db.query(
      `UPDATE configuracion_sistema SET valor = $1, updated_at = CURRENT_TIMESTAMP WHERE clave = $2 AND editable = true RETURNING *`,
      [String(valor), clave]
    );
    if (rows.length > 0) this.invalidateCache();
    return rows[0] || null;
  }

  static async getTiposPermiso() {
    const { rows } = await db.query('SELECT * FROM cat_tipos_permisos ORDER BY nombre');
    return rows;
  }

  static async createTipoPermiso(data) {
    const codigo = data.codigo || data.nombre.toUpperCase().replace(/[\s-]+/g, '_').replace(/[^A-Z0-9_]/g, '');
    const { rows } = await db.query(
      `INSERT INTO cat_tipos_permisos (codigo, nombre, descripcion, requiere_documento, color, activo)
       VALUES ($1, $2, $3, $4, $5, true) RETURNING *`,
      [codigo, data.nombre, data.descripcion || '', data.requiere_documento || false, data.color || '#6B7280']
    );
    return rows[0];
  }

  static async updateTipoPermiso(id, data) {
    const fields = [];
    const params = [];
    let idx = 1;
    for (const col of ['nombre', 'descripcion', 'requiere_documento', 'color', 'activo']) {
      if (data[col] !== undefined) {
        fields.push(`${col} = $${idx++}`);
        params.push(data[col]);
      }
    }
    if (fields.length === 0) return null;
    params.push(id);
    const { rows } = await db.query(
      `UPDATE cat_tipos_permisos SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`,
      params
    );
    return rows[0] || null;
  }

  static async deleteTipoPermiso(id) {
    const { rowCount } = await db.query('DELETE FROM cat_tipos_permisos WHERE id = $1', [id]);
    return rowCount > 0;
  }
}

module.exports = ConfiguracionService;
