const express = require('express');
const router = express.Router();
const { getVideos, createVideo, searchVideos } = require('../controllers/videoController');

// TODO require all controller methods

// TODO add validation

router.get('/', getVideos);
router.get('/search', searchVideos);
router.post('/', createVideo);

module.exports = router;