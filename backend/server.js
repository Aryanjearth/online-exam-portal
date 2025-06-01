const express = require("express");
const app = express();
const path = require("path");
require("dotenv").config();
const cors = require('cors');
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/userModel"); // Import user model

app.use(cors());

const db = require("./config/dbConfig");
const userRoute = require("./routes/userRoutes");
const examRoute = require("./routes/examRoutes");
const reportRoute = require("./routes/reportRoutes");

const port = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: 'https://online-exam-portal-le35.vercel.app',
  credentials: true,
}));

app.use("/api/users", userRoute);
app.use("/api/exams", examRoute);
app.use("/api/reports", reportRoute);

app.use(express.urlencoded({ extended: true }));
const _dirname = path.resolve();
app.use(express.static(path.join(_dirname, "/frontend/build")));
app.get("*", (req, res) => {
  res.sendFile(path.join(_dirname, "/frontend/build/index.html"));
});

app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});

// Function to create admin user if not exists
const createAdminUser = async () => {
  try {
    const adminExists = await User.findOne({ email: process.env.ADMIN_EMAIL });
    if (!adminExists) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, salt);
      
      const adminUser = new User({
        name: "Admin user",
        email: process.env.ADMIN_EMAIL,
        password: hashedPassword,
        isAdmin: true,
      });

      await adminUser.save();
      console.log("Admin user created successfully");
    } else {
      console.log("Admin user already exists");
    }
  } catch (error) {
    console.error("Error creating admin user:", error.message);
  }
};

// Start the server and create admin user
app.listen(port, async () => {
  console.log(`Server is running on PORT: ${port}`);
  await createAdminUser();
});
