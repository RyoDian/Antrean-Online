const express = require ('express')
const router = express.Router()
const authMiddleware = require('../middleware/authMiddleware')
const QueueController = require('../controlers/QueueController')

router.post('/queue/:location_id', authMiddleware , QueueController.createQueue )
router.get('/queue', authMiddleware, QueueController.getQueueByID)

module.exports = router;
