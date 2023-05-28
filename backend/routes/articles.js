const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { verifyToken } = require("../middleware/protection");
const uploadMiddleware = require('../middleware/upload');
const fs=require('fs');
const articlesPerPage = 10;

// GET /articles?take=10&skip=0
router.get("/byuser", verifyToken,async (req, res) => {

  const userId = req.user.user_id; // Assuming you have implemented user authentication and have access to the user ID
  console.log(userId);
  try {
    const articles = await prisma.article.findMany({
      where: {
        userId: userId
      },
      include: {
        author: {
          select: {
            nom: true,
            email: true,
            role: true
          }
        }
      }
    });
    console.log(articles.image);
    res.send(articles);

  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving articles from the database");
  }
});

// GET /articles/123
router.get("/", async (req, res) => {
  //take and skip 
  const commentsPerArticle = 10;
  const page = parseInt(req.query.page) || 1; // Get the page number from the query parameter
  const skip = (page - 1) * articlesPerPage; // Calculate the number of articles to skip

  
  try {
    const articles = await prisma.article.findMany({
      take:  articlesPerPage,
      skip,
      orderBy: {
        createdAt: 'desc', // Order articles by descending createdAt
      },
      where: {
        id: {
          not: undefined,
        },
      },
      include: {
        author: {
          select: {
            nom: true,
            email: true,
            role: true,
          },
        },
        categories: true, // Include the categories
        commentaire: {
          take: commentsPerArticle, // Limit the number of comments per article
        },
      },
    });
    if (articles) {
      res.send(articles);
    } else {
      res.status(404).send("Article not found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving article from the database");
  }
});

// POST /articles
router.post('/', verifyToken, uploadMiddleware.single('file'), async (req, res) => {
 // Access the authenticated user
  try {
    
    const { titre, contenu, categories } = req.body;
    const { user } = req; 
    console.log(titre);
    console.log(contenu);
    console.log(categories);
    console.log(req.file.filename);
    const imagePath = `../public/uploads/${req.file.filename}`
    // Save the file to the desired location or perform any necessary operations
    // For example, you can use the fs module to move the file to a different directory
    const categoryIds = categories.map(categoryId => parseInt(categoryId));

   
    const newArticle = await prisma.article.create({
      data: {
        titre: titre, // Provide the value for the titre field
        contenu: contenu, // Provide the value for the contenu field
        image: imagePath,
        author: { connect: { id: user.user_id } },
        categories: { connect:  categoryIds.map(categoryId => ({ id: categoryId }))}, // Assuming categories is the ID of the category you want to connect
        published: true,
      },
    });
    
    console.log(newArticle);
    res.send(newArticle);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error creating new article');
  }
});

// PATCH /articles/123
router.patch("/:id",verifyToken, async (req, res) => {
  const id = Number(req.params.id);
  const { titre, contenu, image, categories } = req.body;
  const { user } = req; // Access the authenticated user

  try {
    const updatedArticle = await prisma.article.update({
      where: { id },
      data: {
        titre,
        contenu,
        image,
        author: { connect: { id: user.user_id } },
        categories: { set: categories },
      },
    });
    res.send(updatedArticle);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating article");
  }
});

// DELETE /articles/123
router.delete("/:id",verifyToken, async (req, res) => {
  const id = Number(req.params.id);
  try {
    // Retrieve the commentaries associated with the article
    const deletedCommentaries = await prisma.commentaire.findMany({
      where: { articleId: id },
    });

    // Delete the commentaries
    await prisma.commentaire.deleteMany({
      where: { articleId: id },
    });

    // Delete the article
    await prisma.article.delete({
      where: { id },
    });

    res.json({
      deletedCommentaries,
      message: `Article with id ${id} and associated commentaries deleted`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error deleting article and associated commentaries");
  }
});

module.exports = router;
