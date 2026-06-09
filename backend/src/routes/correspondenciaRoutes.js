const express = require('express');
const router = express.Router();
const correspondenciaController = require('../controllers/correspondenciaController');
const { authMiddleware, checkPermission } = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/catalogos', checkPermission('correspondencia.ver'), correspondenciaController.getCatalogos);
router.get('/estadisticas', checkPermission('correspondencia.ver'), correspondenciaController.getEstadisticas);
router.get('/bandeja', checkPermission('correspondencia.ver'), correspondenciaController.getBandeja);

router.get('/', checkPermission('correspondencia.ver'), correspondenciaController.getAll);
router.get('/:id', checkPermission('correspondencia.ver'), correspondenciaController.getById);

router.post('/',
  checkPermission('correspondencia.crear'),
  correspondenciaController.upload.single('pdf'),
  correspondenciaController.create
);

router.put('/:id',
  checkPermission('correspondencia.editar'),
  correspondenciaController.upload.single('pdf'),
  correspondenciaController.update
);

router.post('/:id/derivar',
  checkPermission('correspondencia.derivar'),
  correspondenciaController.derivar
);

router.put('/derivaciones/:derivacionId/responder',
  checkPermission('correspondencia.responder'),
  correspondenciaController.responder
);

module.exports = router;
