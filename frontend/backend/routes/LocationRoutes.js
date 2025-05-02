const express = require('express')
const authMiddleware = require('../middleware/authMiddleware')
const router = express.Router()
const authRole = require("../middleware/authRole")
const authLocation = require("../middleware/authLocation")
const locationController = require("../controlers/LocationControler")


router.get("/location", authMiddleware , locationController.getLocation)

router.get("/location/:id" ,authMiddleware, authLocation , locationController.getLocationById)

router.post("/location" , authMiddleware, authRole(['super-admin']) , locationController.createLocation)

router.patch("/location/:id", authMiddleware , authRole(['super-admin']), locationController.updateLocation)

router.delete("/location/:id", authMiddleware, authRole(['super-admin']), locationController.deleteLocation)


module.exports = router;