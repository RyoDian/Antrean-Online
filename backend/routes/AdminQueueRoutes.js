const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const authRole = require('../middleware/authRole');
const authLocation = require('../middleware/authLocation');
const AdminQueue = require('../controlers/AdminQueueController');


router.get(
  '/adminq/last-called/:location_id/:service_id',
  authMiddleware,
  authLocation,
  AdminQueue.getLastCalledQueue
);

router.patch(
  '/adminq/call-next/:location_id/:service_id',
  authMiddleware,
  authRole(['admin', 'super-admin']),
  authLocation,
  AdminQueue.callNextQueue
);

// Route untuk menyelesaikan antrean berdasarkan ID antrean
router.patch(
  '/adminq/complete/:queue_id',
  authMiddleware,
  authRole(['admin', 'super-admin']),
  authLocation,
  AdminQueue.completeQueue
);

// Route untuk membatalkan antrean berdasarkan ID antrean
router.patch(
  '/adminq/cancel/:queue_id',
  authMiddleware,
  authRole(['admin', 'super-admin']),
  authLocation,
  AdminQueue.cancelQueue
);

// Route untuk mendapatkan antrean saat ini di lokasi dan layanan tertentu
router.get(
  '/adminq/current/:location_id/:service_id',
  authMiddleware,
  authRole(['admin', 'super-admin']),
  authLocation,
  AdminQueue.getCurrentQueue
);

module.exports = router;
