const express = require('express');
const multer = require('multer');
const path = require('path');
const {
  createRecipe,
  getAllRecipes,
  getRecipeById,
  searchByIngredients,
  likeRecipe,
  getUserRecipes
} = require('../controllers/recipeController');
const auth = require('../middleware/auth');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

router.post('/', auth, upload.single('image'), createRecipe);
router.get('/', getAllRecipes);
router.get('/my-recipes', auth, getUserRecipes);
router.get('/search-by-ingredients', searchByIngredients);
router.get('/:id', getRecipeById);
router.post('/:id/like', auth, likeRecipe);

module.exports = router;