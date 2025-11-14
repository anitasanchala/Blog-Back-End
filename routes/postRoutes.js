const { Router } = require('express');
const { verifyToken } = require('../middleware/authmiddleware');
const { getPosts, createPosts, deletePost, editPost, getPostsById } = require('../controllers/postController');

const router = Router();

router.post('/get_posts', getPosts);
router.post('/get_post_by_id', getPostsById);

router.post('/delete_post', deletePost);
router.post('/edit_post', editPost);
router.post('/create', verifyToken, createPosts);

module.exports = router;