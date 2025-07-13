const Recipe = require('../models/Recipe');

exports.createRecipe = async (req, res) => {
  try {
    const {
      title,
      description,
      ingredients,
      steps,
      cookingTime,
      difficulty,
      category,
      tags
    } = req.body;

    const recipe = new Recipe({
      title,
      description,
      ingredients: JSON.parse(ingredients),
      steps: JSON.parse(steps),
      cookingTime,
      difficulty,
      category,
      tags: tags ? JSON.parse(tags) : [],
      author: req.user._id,
      image: req.file ? `/uploads/${req.file.filename}` : ''
    });

    await recipe.save();
    await recipe.populate('author', 'username profileImage');

    res.status(201).json({
      message: 'Recipe created successfully',
      recipe
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getAllRecipes = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, category } = req.query;
    const skip = (page - 1) * limit;

    let query = {};
    
    if (search) {
      query.$text = { $search: search };
    }
    
    if (category) {
      query.category = category;
    }

    const recipes = await Recipe.find(query)
      .populate('author', 'username profileImage')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Recipe.countDocuments(query);

    res.json({
      recipes,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id)
      .populate('author', 'username profileImage');
    
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    res.json({ recipe });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.searchByIngredients = async (req, res) => {
  try {
    const { ingredients } = req.query;
    
    if (!ingredients) {
      return res.status(400).json({ message: 'Ingredients parameter is required' });
    }

    const ingredientList = ingredients.split(',').map(ing => ing.trim().toLowerCase());

    const recipes = await Recipe.find({
      'ingredients.name': {
        $in: ingredientList.map(ing => new RegExp(ing, 'i'))
      }
    }).populate('author', 'username profileImage');

    // Sort by number of matching ingredients
    const recipesWithMatchCount = recipes.map(recipe => {
      const matchCount = recipe.ingredients.filter(ingredient =>
        ingredientList.some(userIng =>
          ingredient.name.toLowerCase().includes(userIng)
        )
      ).length;

      return {
        ...recipe.toObject(),
        matchCount
      };
    });

    recipesWithMatchCount.sort((a, b) => b.matchCount - a.matchCount);

    res.json({ recipes: recipesWithMatchCount });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.likeRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    const userIndex = recipe.likes.indexOf(req.user._id);
    
    if (userIndex > -1) {
      recipe.likes.splice(userIndex, 1);
    } else {
      recipe.likes.push(req.user._id);
    }

    await recipe.save();

    res.json({
      message: 'Recipe like status updated',
      liked: userIndex === -1,
      likesCount: recipe.likes.length
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getUserRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find({ author: req.user._id })
      .populate('author', 'username profileImage')
      .sort({ createdAt: -1 });

    res.json({ recipes });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};