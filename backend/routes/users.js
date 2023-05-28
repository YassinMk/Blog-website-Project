const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { verifyToken } = require("../middleware/protection");
const jwt = require('jsonwebtoken');




const prisma = new PrismaClient();

router.get('/',verifyToken, async (req, res) => {
  try {
    // Retrieve all users from the database using Prisma
    
    // Verify the token to extract the user ID
    const userI=req.user;
    const userId = parseInt(userI.user_id);
    // Fetch user data using the user ID
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        nom: true,
        email: true,
        role: true,
      },
    });
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to get user.' });
  }
});

router.get('/:id',verifyToken, async (req, res) => {

  try {
    const { id } = req.params;
    const userId = parseInt(id);
     // Check the parsed integer value


    // Retrieve the user from the database using Prisma
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: {
          id: userId
        },
        nom: true,
        email: true,
        role : true
      }
    });
   
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to get the user.' });
  }
});

// Route handler for creating a new user
router.post('/',verifyToken, async (req, res) => {
  try {
    const { nom, email, password, role } = req.body;

    // Validate the request body (you can use a validation library like Joi or express-validator)

    // Create a new user in the database using Prisma
    const newUser = await prisma.user.create({
      data: {
        nom,
        email,
        password,
        role,
      },
      include: {
        articles: true,
      },
    });

    // Return the created user with articles in the response
    res.status(201).json(newUser);
  } catch (error) {
    // Handle any errors that occurred during the user creation
    console.error(error);
    res.status(500).json({ error: 'Failed to create a new user.' });
  }
});

// Route handler for deleting a user
router.delete('/:id',verifyToken, async (req, res) => {
  const { id } = req.params;
  try {
    // Retrieve the user's articles before deletion
    const deletedArticles = await prisma.article.findMany({
      where: { userId: parseInt(id) },
    });

    // Delete the user's articles
    await prisma.article.deleteMany({
      where: { userId: parseInt(id) },
    });

    // Delete the user from the database using Prisma
    const deletedUser = await prisma.user.delete({
      where: { id: parseInt(id) },
    });

    res.json({
      deletedUser,
      deletedArticles,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete the user and their articles.' });
  }
});



// Route handler for updating a user
router.put('/:id',verifyToken, async (req, res) => {
  const { id } = req.params;
  const { nom, email, password, role } = req.body;

  try {
    // Update the user in the database using Prisma
    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id) },
      data: {
        nom,
        email,
        password,
        role,
      },
      include: {
        articles: true,
      },
    });

    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update the user.' });
  }
});
router.get('/getUserId',verifyToken,async(req,res)=>{
  res.json(req.user);
})

module.exports = router;
