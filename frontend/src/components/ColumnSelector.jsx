import React, { useState, useEffect, useRef } from 'react';
import { Settings, Check, GripVertical } from 'lucide-react';

const AVAILABLE_COLUMNS = [
  { key: 'ci', label: 'CI / Doc.', default: true },
  { key: 'nombre', label: 'Apellidos y Nombres', default: true },
  { key: 'tipo_personal', label: 'Tipo Personal', default: true },
  { key: 'fuente', label: 'Fuente Financiamiento', default: true },
  { key: 'identificador', label: 'N° Ítem / Contrato', default: false },
  { key: 'cargo', label: 'Cargo Actual', default: true },
  { key: 'cargo_planilla', label: 'Cargo Planilla', default: false },
  { key: 'unidad', label: 'Unidad / Servicio', default: true },
  { key: 'carga_horaria', label: 'Carga Horaria', default: false },
  { key: 'profesion', label: 'Profesión', default: true },
  { key: 'telefono', label: 'Teléfono', default: false },
  { key: 'fecha_ingreso', label: 'F. Ingreso', default: false },
  { key: 'fecha_fin_contrato', label: 'F. Fin Contrato', default: true },
  { key: 'observaciones', label: 'Observaciones', default: false },
];

const STORAGE_KEY = 'personal_grid_columns';

const ColumnSelector = ({ visibleColumns, onToggle }) => {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggleAll = () => {
    const allVisible = AVAILABLE_COLUMNS.every(c => visibleColumns.includes(c.key));
    if (allVisible) {
      const defaults = AVAILABLE_COLUMNS.filter(c => c.default).map(c => c.key);
      onToggle(defaults);
    } else {
      onToggle(AVAILABLE_COLUMNS.map(c => c.key));
    }
  };

  const allVisible = AVAILABLE_COLUMNS.every(c => visibleColumns.includes(c.key));

  return (
    <div className="relative" ref={panelRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 text-sm font-medium transition-all"
        title="Personalizar columnas"
      >
        <Settings size={16} />
        Columnas
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 z-50 overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100 flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-800">Personalizar Columnas</h3>
            <button
              onClick={handleToggleAll}
              className="text-xs text-blue-600 hover:text-blue-700 font-medium"
            >
              {allVisible ? 'Restaurar default' : 'Mostrar todas'}
            </button>
          </div>
          <div className="max-h-80 overflow-y-auto p-2">
            {AVAILABLE_COLUMNS.map(col => {
              const isVisible = visibleColumns.includes(col.key);
              return (
                <label
                  key={col.key}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                    isVisible ? 'bg-blue-50' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${
                    isVisible ? 'bg-blue-600 border-blue-600' : 'border-slate-300 bg-white'
                  }`}>
                    {isVisible && <Check size={12} className="text-white" />}
                  </div>
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={isVisible}
                    onChange={() => {
                      if (isVisible) {
                        onToggle(visibleColumns.filter(c => c !== col.key));
                      } else {
                        onToggle([...visibleColumns, col.key]);
                      }
                    }}
                  />
                  <span className={`text-sm ${isVisible ? 'text-slate-800 font-medium' : 'text-slate-500'}`}>
                    {col.label}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export { AVAILABLE_COLUMNS };
export default ColumnSelector;
