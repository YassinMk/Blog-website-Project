const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { verifyToken } = require("../middleware/protection");

router.post("/login", async (req, res) => {
  try {
    // Get user input
    const { email, password } = req.body;

    // Validate user input
    if (!(email && password)) {
      return res.status(400).json({ message: "All input is required" });
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      // User not found or invalid credentials
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    // Create token
    const token = jwt.sign({ user_id: user.id }, process.env.TOKEN_KEY, {
      expiresIn: "2h",
    });
    // Return new user and token

    res.cookie("jwt", token, { httpOnly: true, maxAge: 2 * 60 * 60 });
    res.status(201).json({ status: true, user: user, token: token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: false, error: err });
  }
});

router.post("/register", async (req, res) => {
  try {
    // Get user input
    const { nom, email, password } = req.body;

    // Validate user input
    if (!(nom && email && password)) {
      return res.status(400).json({ message: "All input is required" });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    // Create new user
    const newUser = await prisma.user.create({
      data: {
        nom,
        email,
        password: await bcrypt.hash(password, 10),
        role: "AUTHOR",
      },
    });

    // Create token
    // const token = jwt.sign(
    //   { user_id: newUser.id, email },
    //   process.env.TOKEN_KEY,
    //   { expiresIn: "2h" }
    // );

    // Return new user and token
    res
      .status(200)
      .json({ user: { id: newUser.id, nom: newUser.nom, role: newUser.nom } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

router.get("/profil", async (req, res) => {
  try {
    console.log("request qrri");
    const token = req.headers.authorization;
    console.log(process.env.TOKEN_KEY);
    const userinfo = jwt.verify(token, process.env.TOKEN_KEY);
    res.json(userinfo);
  } catch (error) {
    console.log(error);
  }
});
router.post("/logout",async (req, res)=>{
  try{
    
    res.json({message:"logout succesful"});
  }catch(err){
    console.log(err);
  }  
  })
module.exports = router;
