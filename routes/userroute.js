const express = require('express');
const router = express.Router();
const User = require('../Models/users');
const bcrypt = require('bcrypt');
// const {validationToken} = require('../Middleware/AuthMiddleware');
const { sign } = require('jsonwebtoken');
const  validateToken = require('../Middleware/AuthMiddleware');


router.get('/', async function(req,res){
    try {
        const allUsers = await User.find();
        res.json(allUsers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post("/auth", async function(req, res) {
    const { username, password, email, fullname } = req.body;

    try {
        // Check if a user with the same username or email already exists
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });

        if (existingUser) {
            // User with the same username or email already exists
            res.status(409).json({ error: 'User already exists' });
            return;
        }

        // Hash the password and create a new user
        const hash = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            username,
            password: hash, 
            email,
            fullname,
        });
        const accessToken =  sign({username:newUser.username, id:newUser._id},"hey");
            res.json(accessToken);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post("/login", async function(req, res) {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username: username });

        if (!user) {
            res.status(401).json({ error: 'User does not exist' });
            return;  // Return to avoid further execution
        }

        bcrypt.compare(password, user.password).then((match) => {
            if (!match) {
                res.status(401).json({ error: 'Wrong password' });
                return;  // Return to avoid further execution
            }

            const accessToken = sign({username:user.username, id:user._id,email:user.email},"hey");
            res.json(accessToken);
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/authentication',validateToken,function(req,res){
    res.json({username:req.user.username});
});

router.post('/profile',validateToken,async function(req,res){
    const userSName = req.user.username
    const gotUser = await User.findOne({username:userSName})
    res.json(gotUser);
});

router.delete('/:id', async (req, res) => {
    try {
      const deletedUser = await User.findByIdAndDelete(req.params.id);
      if (!deletedUser) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error('Failed to delete user:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });


module.exports = router