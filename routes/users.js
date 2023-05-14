const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');


const prisma = new PrismaClient();

router.get('/', async (req, res) => {
  try {
    // Retrieve all users from the database using Prisma
    const users = await prisma.user.findMany();

    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to get users.' });
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Retrieve the user from the database using Prisma
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
    });
    console.log(user,"hellowww");
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
router.post('/', async (req, res) => {
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
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Delete the user from the database using Prisma
    const deletedUser = await prisma.user.delete({
      where: { id: parseInt(id) },
    });

    res.json(deletedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete the user.' });
  }
});

// Route handler for updating a user
router.put('/:id', async (req, res) => {
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

module.exports = router;
