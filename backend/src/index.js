const express = require('express');
const cors = require('cors');
require('dotenv').config();

const personalRoutes = require('./routes/personalRoutes');
const asistenciaRoutes = require('./routes/asistenciaRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const biometricoRoutes = require('./routes/biometricoRoutes');
const reporteRoutes = require('./routes/reporteRoutes');
const { startEstadoJob } = require('./cron/estadoJob');

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/personal', personalRoutes);
app.use('/api/asistencia', asistenciaRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/biometrico', biometricoRoutes);
app.use('/api/reportes', reporteRoutes);

// Start Cron Jobs
startEstadoJob();

// Basic Route
app.get('/', (req, res) => {
  res.send('API RRHH Hospital Barrios Mineros funcionando');
});

// Start Server
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
  });
}

module.exports = app;
