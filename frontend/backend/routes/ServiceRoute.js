const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const authRole = require('../middleware/authRole');
const router = express.Router();
const ServiceController = require('../controlers/ServiceController');

// Rute untuk Service
router.get('/service', authMiddleware, ServiceController.getService);
router.get('/service/:id', authMiddleware, ServiceController.getServiceById);
router.post('/service', authMiddleware, authRole(['super-admin']), ServiceController.createService);
router.patch('/service/:id', authMiddleware, authRole(['super-admin']), ServiceController.updateService);
router.delete('/service/:id', authMiddleware, authRole(['super-admin']), ServiceController.deleteService);

module.exports = router;
