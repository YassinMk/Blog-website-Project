const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Create a new comment
router.post('/', async (req, res) => {
  try {
    const { email, contenu, articleId } = req.body;

    const comment = await prisma.commentaire.create({
      data: {
        email,
        contenu,
        article: {
          connect: { id: parseInt(articleId) },
        },
      },
      include: {
        article: true,
      },
    });

    res.json(comment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create comment' });
  }
});

// Get all comments
// Get all comments
router.get('/', async (req, res) => {
  try {
    const comments = await prisma.commentaire.findMany({
      include: {
        article: {
          include: {
            author: true,
          },
        },
      },
    });

    const commentsWithAuthor = comments.map(comment => {
      const { id, email, contenu, article } = comment;
      const { id: articleId, titre, contenu: articleContenu, author } = article;

      return {
        id,
        email,
        contenu,
        article: {
          id: articleId,
          titre,
          contenu: articleContenu,
          author,
        },
      };
    });

    res.json(commentsWithAuthor);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve comments' });
  }
});

// Get a comment by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const comment = await prisma.commentaire.findUnique({
      where: { id: parseInt(id) },
      include: {
        article: {
          include: {
            author: true,
          },
        },
      },
    });

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    const { email, contenu, article } = comment;
    const { id: articleId, titre, contenu: articleContenu, author } = article;

    const commentWithAuthor = {
      id: parseInt(id),
      email,
      contenu,
      article: {
        id: articleId,
        titre,
        contenu: articleContenu,
        author,
      },
    };

    res.json(commentWithAuthor);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve comment' });
  }
});
// Update a comment

// Update a comment
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { email, contenu, articleId } = req.body;

    const comment = await prisma.commentaire.update({
      where: { id: parseInt(id) },
      data: {
        email,
        contenu,
        articleId: parseInt(articleId),
      },
      include: {
        article: true,
      },
    });

    res.json(comment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update comment' });
  }
});

// Delete a comment
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.commentaire.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete comment' });
  }
});

module.exports = router;
