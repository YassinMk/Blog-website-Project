const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Create a new article
router.post('/', async (req, res) => {
  try {
    const { titre, contenu, image, authorId, categoryIds } = req.body;

    const article = await prisma.article.create({
      data: {
        titre,
        contenu,
        image,
        authorId: parseInt(authorId),
        categories: {
          connect: categoryIds.map((categoryId) => ({
            id: parseInt(categoryId),
          })),
        },
      },
      include: {
        author: true,
        categories: true,
      },
    });

    res.json(article);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create article' });
  }
});

// Get all articles
// Get all articles
router.get('/', async (req, res) => {
  try {
    const articles = await prisma.article.findMany({
      include: {
        author: true,
        categories: {
          select: { id: true },
        },
      },
    });

    const formattedArticles = articles.map(article => {
      const { id, titre, contenu, image, author, categories } = article;
      const categoryIds = categories.map(category => category.id);

      return {
        id,
        titre,
        contenu,
        image,
        author,
        categoryIds,
      };
    });

    res.json(formattedArticles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve articles' });
  }
});

// Get an article by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const article = await prisma.article.findUnique({
      where: { id: parseInt(id) },
      include: {
        author: true,
        categories: {
          select: { id: true },
        },
      },
    });

    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }

    const { titre, contenu, image, author, categories } = article;
    const categoryIds = categories.map(category => category.id);

    const formattedArticle = {
      id: parseInt(id),
      titre,
      contenu,
      image,
      author,
      categoryIds,
    };

    res.json(formattedArticle);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve article' });
  }
});

// Get an article by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const article = await prisma.article.findUnique({
      where: { id: parseInt(id) },
      include: {
        author: true,
        categories: true,
      },
    });

    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }

    res.json(article);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve article' });
  }
});

// Update an article
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { titre, contenu, image, authorId, categoryIds } = req.body;

    const article = await prisma.article.update({
      where: { id: parseInt(id) },
      data: {
        titre,
        contenu,
        image,
        authorId: parseInt(authorId),
        categories: {
          set: categoryIds.map((categoryId) => ({
            id: parseInt(categoryId),
          })),
        },
      },
      include: {
        author: true,
        categories: true,
      },
    });

    res.json(article);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update article' });
  }
});


// Delete an article
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.article.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: 'Article deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete article' });
  }
});
  module.exports = router;
  

