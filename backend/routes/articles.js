const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { verifyToken } = require("../middleware/protection");


// GET /articles?take=10&skip=0
router.get("/", async (req, res) => {
  const take = Number(req.query.take) || 10;
  const skip = Number(req.query.skip) || 0;
  try {
    const articles = await prisma.article.findMany({
      take,
      skip,
      include: {
        author: {
          select: {
            nom: true,
            email: true,
            role: true,
          },
        },
      },
    });
    res.send(articles);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving articles from the database");
  }
});

// GET /articles/123
router.get("/:id", async (req, res) => {
  const id = Number(req.params.id);
  try {
    const article = await prisma.article.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            nom: true,
            email: true,
            role: true,
          },
        },
      },
    });
    if (article) {
      res.send(article);
    } else {
      res.status(404).send("Article not found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving article from the database");
  }
});

// POST /articles
router.post("/" ,verifyToken,async (req, res) => {
  const { titre, contenu, image, categories } = req.body;
  const { user } = req; // Access the authenticated user
  try {
    const newArticle = await prisma.article.create({
      data: {
        titre,
        contenu,
        image,
        author: { connect: { id: user.user_id } },
        categories: { connect:categories },
        published:true
      },
    });

    res.send(newArticle);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error creating new article");
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