const express = require('express');
const router = express.Router();
const { getNews, getSingleNews, getCategories, likeNews } = require('../controllers/news.controller');

router.get('/', getNews);
router.get('/categories', getCategories);
router.get('/:id', getSingleNews);
router.put('/:id/like', likeNews);

module.exports = router;

