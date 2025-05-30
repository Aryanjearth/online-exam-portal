const User = require("../models/userModel")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

// Regex patterns
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/

// user registration
const register = async (req, res) => {
  try {
    // Validate email and password with regex
    if (!emailRegex.test(req.body.email)) {
      return res.status(400).send({
        message: "Invalid email format.",
        success: false,
      })
    }
    if (!passwordRegex.test(req.body.password)) {
      return res.status(400).send({
        message:
          "Password must be at least 6 characters long and contain at least one letter and one number.",
        success: false,
      })
    }

    const userExists = await User.findOne({ email: req.body.email })
    if (userExists) {
      res.status(200).send({
        message: "User already exists.",
        success: false,
      })
    } else {
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(req.body.password, salt)
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
      })
      await newUser.save()
      res.status(200).send({
        message: "User registered successfully.",
        success: true,
      })
    }
  } catch (error) {
    res.status(400).send({
      message: error.message,
      data: error,
      success: false,
    })
  }
}

// user login
const login = async (req, res) => {
  try {
    // Validate email format
    if (!emailRegex.test(req.body.email)) {
      return res.status(400).send({
        message: "Invalid email format.",
        success: false,
      })
    }

    const user = await User.findOne({ email: req.body.email })
    if (user) {
      const passwordsMatched = await bcrypt.compare(
        req.body.password,
        user.password
      )
      if (passwordsMatched) {
        const token = jwt.sign(
          {
            userid: user._id,
          },
          process.env.JWT_SECRET,
          {
            expiresIn: "1d",
          }
        )
        res.send({
          message: "User logged in successfully",
          data: token,
          success: true,
        })
      } else {
        res.status(200).send({
          message: "Invalid Password",
          success: false,
        })
      }
    } else {
      res.status(200).send({
        message: "User does not exist.",
        success: false,
      })
    }
  } catch (error) {
    res.status(400).send({
      message: error.message,
      data: error,
      success: false,
    })
  }
}

// get user info
const getUserInfo = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.body.userid })
    if (user) {
      res.status(200).send({
        message: "User Info fetched successfully",
        data: user,
        success: true,
      })
    } else {
      res.status(200).send({
        message: "Failed to fetch user info",
        data: null,
        success: false,
      })
    }
  } catch (error) {
    res.status(400).send({
      message: error.message,
      data: error,
      success: false,
    })
  }
}

module.exports = { register, login, getUserInfo }
