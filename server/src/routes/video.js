const express = require('express');
const router = express.Router();
const { getVideos, getVideoById, createVideo, updateVideo, searchVideos, deleteVideo } = require('../controllers/videoController');

// TODO add validation
router.get('/search', searchVideos);
router.get('/', getVideos);
router.get('/:id', getVideoById);
router.put('/:id', updateVideo);
router.post('/', createVideo);
router.delete('/:id', deleteVideo);

module.exports = router;