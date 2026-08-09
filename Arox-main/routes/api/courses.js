const express = require('express');
const router = express.Router();
const courseController = require('../../controllers/courseController');

// GET /api/courses
router.get('/', courseController.getAll);

// GET /api/courses/:slug
router.get('/:slug', courseController.getBySlug);

module.exports = router;
