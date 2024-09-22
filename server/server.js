import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

//Configuration to Use mongoDB
const mongoUser = process.env.DB_USER;
const mongoPassword = process.env.DB_PASS;
let mongoUrl = `mongodb+srv://${mongoUser}:${mongoPassword}@cluster0.mongodb.net/liftLegends?retryWrites=true&w=majority`;
mongoUrl = `mongodb://${mongoUser}:${mongoPassword}@cluster0.mongodb.net/liftLegends`;

console.log(mongoUrl);
// Connect to MongoDB
mongoose.connect(mongoUrl)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("MongoDB connection error:", error));

// Define User Schema
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});
const User = mongoose.model("User", UserSchema);

// SignUp Endpoint (Create User)
app.post("/signup", async (req, res) => {
  const { name, username, email, password } = req.body;

  const userExists = await User.findOne({ $or: [{ username }, { email }] });
  if (userExists) {
    return res.status(409).json({ message: "Username or email already registered." });
  }

  const newUser = new User({ name, username, email, password });
  await newUser.save();
  res.status(201).json(newUser);
});

// Login Endpoint (Authenticate User)
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ $or: [{ username }, { email: username }] });
  if (user && user.password === password) {
    res.status(200).json({ message: "Login successful", user });
  } else {
    res.status(401).json({ message: "Invalid username or password" });
  }
});

app.use(cors({
    origin: 'http://localhost:5173'
  }));

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
