const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Create a new article
router.post('/', async (req, res) => {
  try {
    const { titre, contenu, image, authorId, categoryIds ,published} = req.body;

    const article = await prisma.article.create({
      data: {
        titre,
        contenu,
        image,
        authorId: parseInt(authorId),
        published:true,
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


// GET /articles?take=10&skip=0
router.get("/", async (req, res) => {
  const take = Number(req.query.take) || 10;
  const skip = Number(req.query.skip) || 0;
  try {
    const articles = await prisma.article.findMany({
      take,
      skip,
      include:{
        author:{
          select:{
            nom:true,
            email:true,
            role:true
          }
        }
      }
    });
    res.send(articles);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving articles from the database");
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
  

