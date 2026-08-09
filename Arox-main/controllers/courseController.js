const Course = require('../models/Course');
const Internship = require('../models/Internship');
const logger = require('../utils/logger');

const courseController = {
  /**
   * GET /api/courses
   */
  getAll(req, res) {
    try {
      const { category, mode, level, search, featured } = req.query;
      const courses = Course.getAll({ category, mode, level, search, featured: featured === 'true' });

      // Parse JSON fields
      const parsed = courses.map(course => ({
        ...course,
        curriculum: course.curriculum ? JSON.parse(course.curriculum) : [],
        skills: course.skills ? JSON.parse(course.skills) : [],
        projects: course.projects ? JSON.parse(course.projects) : [],
        faqs: course.faqs ? JSON.parse(course.faqs) : []
      }));

      res.json({ success: true, data: parsed, count: parsed.length });
    } catch (error) {
      logger.error('Get courses error:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch courses.' });
    }
  },

  /**
   * GET /api/courses/:slug
   */
  getBySlug(req, res) {
    try {
      const course = Course.findBySlug(req.params.slug);
      if (!course) {
        return res.status(404).json({ success: false, message: 'Course not found.' });
      }

      // Parse JSON fields
      const parsed = {
        ...course,
        curriculum: course.curriculum ? JSON.parse(course.curriculum) : [],
        skills: course.skills ? JSON.parse(course.skills) : [],
        projects: course.projects ? JSON.parse(course.projects) : [],
        faqs: course.faqs ? JSON.parse(course.faqs) : []
      };

      res.json({ success: true, data: parsed });
    } catch (error) {
      logger.error('Get course error:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch course.' });
    }
  },

  /**
   * GET /api/internships
   */
  getInternships(req, res) {
    try {
      const { domain, mode, search, featured } = req.query;
      const internships = Internship.getAll({ domain, mode, search, featured: featured === 'true' });

      res.json({ success: true, data: internships, count: internships.length });
    } catch (error) {
      logger.error('Get internships error:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch internships.' });
    }
  },

  /**
   * GET /api/internships/:slug
   */
  getInternshipBySlug(req, res) {
    try {
      const internship = Internship.findBySlug(req.params.slug);
      if (!internship) {
        return res.status(404).json({ success: false, message: 'Internship not found.' });
      }

      // Parse JSON fields from the joined course
      const parsed = {
        ...internship,
        curriculum: internship.curriculum ? JSON.parse(internship.curriculum) : [],
        skills: internship.skills ? JSON.parse(internship.skills) : [],
        course_projects: internship.course_projects ? JSON.parse(internship.course_projects) : [],
        faqs: internship.faqs ? JSON.parse(internship.faqs) : []
      };

      res.json({ success: true, data: parsed });
    } catch (error) {
      logger.error('Get internship error:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch internship.' });
    }
  }
};

module.exports = courseController;
