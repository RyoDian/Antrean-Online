const express = require ('express')
const router = express.Router()
const authMiddleware = require('../middleware/authMiddleware')
const QueueController = require('../controlers/QueueController')
const authRole = require('../middleware/authRole')

router.post('/queue/:location_id', authMiddleware , QueueController.createQueue )
router.get('/queue', authMiddleware, QueueController.getQueueByID)
router.get('/allqueue', authMiddleware, authRole(['admin' , 'super-admin']), QueueController.getAllQueues)

module.exports = router;
