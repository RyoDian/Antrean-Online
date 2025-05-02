const express = require('express');
const router = express.Router();
const UserController = require('../controlers/UserControler');
const authMiddleware = require('../middleware/authMiddleware');
const authRole = require('../middleware/authRole');

// Login
router.post('/login', UserController.loginUser);

//Register
router.post('/register' , UserController.registerUser)

//login-status
router.get('/loginStatus',UserController.loginStatus)

//logout
router.get('/logout',UserController.logout)

// Get All Admins and Super Admins
router.get('/admin', authMiddleware, authRole(['admin', 'super-admin']), UserController.getAdmins);

// Get Admin or Super Admin by ID
router.get('/admin/:id', authMiddleware, authRole(['admin', 'super-admin']), UserController.getAdminById);

//create Admin or Super Admin
router.post('/admin',authMiddleware, authRole(['super-admin']), UserController.createAdminOrSuperAdmin)

// Update Admin or Super Admin (Hanya Super Admin)
router.patch('/admin/:id', authMiddleware, authRole(['super-admin', 'admin']), UserController.updateAdminOrSuperAdmin);

// Delete Admin or Super Admin (Hanya Super Admin)
router.delete('/admin/:id', authMiddleware, authRole(['super-admin']), UserController.deleteAdminOrSuperAdmin);

module.exports = router;
