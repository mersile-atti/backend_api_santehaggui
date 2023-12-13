const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//@desc Register a new user
//@route POST /api/users
//@access Public

const registerUser = asyncHandler(
    async (req, res) => {
    const { username, email, phone, password } = req.body;
    const userExists = await User.findOne({ 
        $or: [{ email }, { phone }]
     });
        if (userExists) {
            res.status(400)
            throw new Error('User already exists')
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            username,
            email,
            phone,
            password: hashedPassword,
        });

        if(user) {
            res.status(201).json({
                _id: user._id,
                username: user.username,
                email: user.email,
                phone: user.phone,
            })
        } else {
            res.status(400);
            throw new Error('Invalid user data')
        }
})


//@desc login  user
//@route POST /api/users/auth
//@access Public

const authUser = asyncHandler(
    async (req, res) => {
    const { email, phone, password } = req.body;
    const user = await User.findOne({ 
        $or: [{ email }, { phone }]
     });

    if(!user) {
        res.status(400)
        throw new Error('User not found')
    }

    if(user && await bcrypt.compare(password, user.password)) {
        const accessToken = jwt.sign({
            user: {
                username: user.username,
                email: user.email,
                phone: user.phone,
                id: user.id,
            }
        }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
        res.status(200).json({ accessToken})
    } else {
        res.status(401);
        throw new Error("Invalid credentials");}
}
);

//@desc current  user info
//@route GET /api/users/auth
//@access Private

const currentUser = asyncHandler(
    async (req, res) => {
        const user = await User.findById(req.user.id);
        if(!user) {
            res.status(400)
            throw new Error('User not found')
        
        } else {
            res.status(200).json({
                username: user.username,
                email: user.email,
                phone: user.phone,
            })
        
        }
    }
);

//@desc Update  user info
//@route PUT /api/users/auth
//@access Private

const updateUser = asyncHandler(
    async (req, res) => {
        const { username, email, phone, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const updatedUser = await User.findByIdAndUpdate(req.user.id, {
            username,
            email,
            phone,
            password: hashedPassword,
        });

        if(!updatedUser) {
            res.status(400)
            throw new Error('User not found')
        }

        res.status(200);
        res.json({
            username: updatedUser.username,
            email: updatedUser.email,
            phone: updatedUser.phone,
        })
    }
);

//@desc delete  user account
//@route Delete /api/users/auth
//@access Private

const deleteUser = asyncHandler(
    async (req, res) => {
        const user = await User.findById(req.user.id);
        if(!user) {
            res.status(400)
            throw new Error('User not found')
        } 
        await User.deleteOne(user);
        res.status(200).json({
            message: `Successfully user deleted: ${req.user.id}`

        })
        ;
    }
);

//@desc logout  user 
//@route POST /api/users/auth/logout
//@access Private

const logoutUser = asyncHandler(
    async (req, res) => {
        res.json({
            message: 'User logout'
        })
    }
);

module.exports = {
    registerUser,
    authUser,
    currentUser,
    updateUser,
    deleteUser,
    logoutUser
}