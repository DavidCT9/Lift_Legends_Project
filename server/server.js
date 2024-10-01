import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

//Configuration to Use mongoDB
const mongoUser = process.env.DB_USER;
const mongoPassword = process.env.DB_PASS;
const mongoUrl = `mongodb+srv://${mongoUser}:${mongoPassword}@cluster0.6iz2suz.mongodb.net/liftlegends?retryWrites=true&w=majority`;

// Connect to MongoDB
mongoose
	.connect(mongoUrl)
	.then(() => console.log("Connected to MongoDB"))
	.catch((error) => console.error("MongoDB connection error:", error));

const ExercisesPointsSchema = new mongoose.Schema({
	deadlift: { type: Number, required: true },
	benchPress: { type: Number, required: true },
	squat: { type: Number, required: true },
	shoulderPress: { type: Number, required: true },
	barbellRow: { type: Number, required: true },
	bicepCurl: { type: Number, required: true },
	latPulldown: { type: Number, required: true },
	lateralRaise: { type: Number, required: true },
	tricepExtension: { type: Number, required: true },
	legPress: { type: Number, required: true },
});
const ExercisesPoints = mongoose.model(
	"ExercisesPoints",
	ExercisesPointsSchema
);

// Define User Schema
const UserSchema = new mongoose.Schema({
	name: { type: String, required: true },
	username: { type: String, required: true, unique: true },
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	currentAvatar: { type: Number, required: true },
	avatars: { type: [Number], required: true },
	weeklyPoints: { type: ExercisesPointsSchema, required: true },
	experience: { type: Number, required: true },
	currentLeague: { type: Number, required: true },
});
const User = mongoose.model("User", UserSchema);

const LeagueSchema = new mongoose.Schema({
	users: { type: [UserSchema], required: true },
	name: { type: String, required: true, unique: true },
	range: { type: [Number], required: true, unique: true },
});
const League = mongoose.model("League", LeagueSchema);

const LeaguesSchema = new mongoose.Schema({
	leagues: { type: [LeagueSchema], required: true },
});
const Leagues = mongoose.model("Leagues", LeaguesSchema);

// SignUp Endpoint (Create User)
app.post("/signup", async (req, res) => {
	const { name, username, email, password } = req.body;

	const userExists = await User.findOne({ $or: [{ username }, { email }] });
	if (userExists) {
		return res
			.status(409)
			.json({ message: "Username or email already registered." });
	}

	const newUser = new User({
		name,
		username,
		email,
		password,
		currentAvatar: 0, // Initial avatar as 0
		avatars: [0], // The avatars array starts with 0
		weeklyPoints: new ExercisesPoints({
			deadlift: 0,
			benchPress: 0,
			squat: 0,
			shoulderPress: 0,
			barbellRow: 0,
			bicepCurl: 0,
			latPulldown: 0,
			lateralRaise: 0,
			tricepExtension: 0,
			legPress: 0,
		}), // Initialize all exercise points to 0
		experience: 0, // Starting experience is 0
		currentLeague: 0, // Start in league 0
	});
	await newUser.save();
	res.status(201).json(newUser);
});

// Login Endpoint (Authenticate User)
app.post("/login", async (req, res) => {
	const { username, password } = req.body;

	const user = await User.findOne({
		$or: [{ username }, { email: username }],
	});
	if (user && user.password === password) {
		res.status(200).json({ message: "Login successful", user });
	} else {
		res.status(401).json({ message: "Invalid username or password" });
	}
});

app.use(
	cors({
		origin: "http://localhost:5173",
	})
);

app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
