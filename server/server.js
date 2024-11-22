import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.use(cors());

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
	dayPoints: { type: Number, required: true },
});
const User = mongoose.model("User", UserSchema);

const LeagueSchema = new mongoose.Schema({
	users: { type: [UserSchema], required: true },
	rank: { type: Number, required: true, unique: true },
	range: { type: [Number], required: true, unique: true },
});
const League = mongoose.model("League", LeagueSchema);

const LeaguesSchema = new mongoose.Schema({
	leagues: { type: [LeagueSchema], required: true },
});
const Leagues = mongoose.model("Leagues", LeaguesSchema);

const limitSkins = 4;

const limitDayPoints = 300;

const costSkin = 100;

const updateUserInfoInLeagues = async (username, updatedUser) => {
	try {
		// Retrieve the leagues document
		let leaguesDoc = await Leagues.findOne();
		if (!leaguesDoc) {
			throw new Error("Leagues document not found.");
		}

		// Find the current league the user is in
		let currentLeague = leaguesDoc.leagues.find(
			(league) => league.rank === updatedUser.currentLeague
		);

		if (!currentLeague) {
			throw new Error("User's current league not found.");
		}

		// Update user data in the current league's users array
		currentLeague.users = currentLeague.users.map((u) => {
			if (u.username === username) {
				return updatedUser.toObject(); // Convert Mongoose document to plain object
			}
			return u;
		});

		// Save the updated leagues document
		await leaguesDoc.save();
	} catch (error) {
		throw new Error(
			`Error updating user info in leagues: ${error.message}`
		);
	}
};

// SignUp Endpoint (Create User)
app.post("/signup", async (req, res) => {
	const { name, username, email, password } = req.body;

	try {
		// Check if a user with the same username or email already exists
		const userExists = await User.findOne({
			$or: [{ username }, { email }],
		});
		if (userExists) {
			return res
				.status(409)
				.json({ message: "Username or email already registered." });
		}

		// Create a new user
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
			dayPoints: 0,
		});

		// Save the new user to the database
		await newUser.save();

		// Find the leagues document (assuming there's only one leagues document)
		let leaguesDoc = await Leagues.findOne();

		// If no leagues document exists, handle the error
		if (!leaguesDoc) {
			return res
				.status(404)
				.json({ message: "Leagues document not found." });
		}

		// Find the league with rank 0
		const league = leaguesDoc.leagues.find((league) => league.rank === 0);

		// If league with rank 0 doesn't exist, return an error
		if (!league) {
			return res
				.status(404)
				.json({ message: "League with rank 0 not found." });
		}

		// Push the user into the league's users array
		// We need to push the raw JSON data instead of the mongoose model instance
		league.users.push(newUser.toObject()); // Convert to plain JS object

		// Save the updated leagues document
		await leaguesDoc.save();

		// Respond with the newly created user
		res.status(201).json(newUser);
		console.log("Exito aqui");
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Server error.", error });
	}
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

app.post("/updatepoints", async (req, res) => {
	const { username, exercise, points } = req.body;

	try {
		// Find the user by username
		let user = await User.findOne({ username });

		if (!user) {
			return res.status(404).json({ message: "User not found." });
		}

		// Update the user's points for the specific exercise
		if (user.weeklyPoints[exercise] === undefined) {
			return res.status(400).json({ message: "Invalid exercise name." });
		}

		if (user.dayPoints + points > limitDayPoints)
			return res
				.status(400)
				.json({ message: "Limit Daily Points surpassed" });

		user.weeklyPoints[exercise] += points;

		// Update the user's experience
		user.experience += points;

		user.dayPoints += points;

		// Update the user's info in the leagues document
		await updateUserInfoInLeagues(username, user);

		// Save the updated user document
		await user.save();

		res.status(200).json({
			message: "Points updated successfully.",
			user,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({
			message: "Server error.",
			error: error.message,
		});
	}
});

app.post("/addleague", async (req, res) => {
	const { users, rank, range } = req.body;

	try {
		// Find the leagues document (assuming there is only one document storing all leagues)
		let leaguesDoc = await Leagues.findOne();

		// If no leagues document exists, create one
		if (!leaguesDoc) {
			leaguesDoc = new Leagues({ leagues: [] });
		}

		// Check if a league with the same rank already exists
		const existingLeague = leaguesDoc.leagues.find(
			(league) => league.rank === rank
		);
		if (existingLeague) {
			return res
				.status(409)
				.json({ message: "League with this rank already exists." });
		}

		// Create a new league
		const newLeague = new League({
			users: users || [], // Default to empty array if no users provided
			rank,
			range,
		});

		// Add the new league to the leagues array
		leaguesDoc.leagues.push(newLeague);

		// Save the updated leagues document
		await leaguesDoc.save();

		res.status(201).json(leaguesDoc);
	} catch (error) {
		res.status(500).json({ message: "Server error.", error });
	}
});

app.post("/getleagueinfo", async (req, res) => {
	const { rank } = req.body;
	try {
		let leaguesDoc = await Leagues.findOne();
		if (!leaguesDoc) {
			return res
				.status(404)
				.json({ message: "Leagues document not found." });
		}

		let league = leaguesDoc.leagues.find(
			(league) => league.rank === parseInt(rank)
		);
		if (!league) {
			return res.status(404).json({ message: "League not found." });
		}

		// Create a new array of users with the total points added
		let usersWithTotal = league.users.map((user) => {
			const points = user.weeklyPoints;
			const totalPoints =
				points.deadlift +
				points.benchPress +
				points.squat +
				points.shoulderPress +
				points.barbellRow +
				points.bicepCurl +
				points.latPulldown +
				points.lateralRaise +
				points.tricepExtension +
				points.legPress;

			return {
				...user.toObject(), // Convert the Mongoose document to a plain object
				weeklyPoints: {
					...points.toObject(),
					total: totalPoints, // Add the total points to the weeklyPoints
				},
			};
		});

		// Sort the new array of users by total points in descending order
		usersWithTotal.sort(
			(a, b) => b.weeklyPoints.total - a.weeklyPoints.total
		);

		// Create a new league object with the modified users array
		const modifiedLeague = {
			...league.toObject(),
			users: usersWithTotal,
		};

		res.status(200).json({
			message: "League data retrieved and modified successfully.",
			league: modifiedLeague,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Server error.", error });
	}
});

app.post("/buyskin", async (req, res) => {
	const { username, idSkin } = req.body;

	try {
		// Fetch user by username
		let user = await User.findOne({ username });

		if (!user) return res.status(404).json({ message: "User not found." });

		// Validate the skin ID
		if (idSkin >= limitSkins || idSkin < 0)
			return res.status(400).json({ message: "Invalid skin ID." });

		// Check if the user has enough experience
		if (user.experience < costSkin)
			return res
				.status(400)
				.json({ message: "Insufficient experience." });

		// Check if the user already owns the skin
		if (user.avatars.includes(idSkin))
			return res.status(400).json({ message: "Skin already owned." });

		// Deduct the cost and add the skin
		user.experience -= costSkin;
		user.avatars.push(idSkin);

		await updateUserInfoInLeagues(username, user);

		// Save the updated user
		await user.save();

		// Send success response
		return res.status(200).json({
			message: "Skin purchased successfully.",
			remainingExperience: user.experience,
			ownedSkins: user.avatars,
		});
	} catch (error) {
		console.error("Error purchasing skin:", error);
		return res.status(500).json({ message: "Internal server error." });
	}
});

app.post("/weeklyReset", async (req, res) => {
	const { password } = req.body;

	if (password != process.env.SERVER_PASS)
		return res.status(404).json({ message: "Not valid credentials." });

	try {
		const leagues = await Leagues.findOne();
		if (!leagues) {
			throw new Error("Leagues document not found.");
		}

		// Initialize a bidimensional array for all leagues' users
		const allUsersByLeague = Array.from(
			{ length: leagues.leagues.length },
			() => []
		);

		// Process users in each league
		for (
			let leagueIndex = 0;
			leagueIndex < leagues.leagues.length;
			leagueIndex++
		) {
			const league = leagues.leagues[leagueIndex];

			for (let user of league.users) {
				// Calculate total points
				const points = user.weeklyPoints;
				const totalPoints =
					points.deadlift +
					points.benchPress +
					points.squat +
					points.shoulderPress +
					points.barbellRow +
					points.bicepCurl +
					points.latPulldown +
					points.lateralRaise +
					points.tricepExtension +
					points.legPress;

				// Reset weekly points
				const resetPoints = {
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
				};

				// Determine new league index
				let newLeagueIndex = leagueIndex;
				if (
					totalPoints >= league.range[1] &&
					leagueIndex < leagues.leagues.length - 1
				) {
					console.log(`Promoting user ${user.username}`);
					newLeagueIndex = leagueIndex + 1;
				} else if (totalPoints < league.range[0] && leagueIndex > 0) {
					console.log(`Demoting user ${user.username}`);
					newLeagueIndex = leagueIndex - 1;
				}

				// Update user's league and weekly points in the database
				const dbUser = await User.findOne({ username: user.username });
				if (dbUser) {
					dbUser.currentLeague = newLeagueIndex;
					dbUser.weeklyPoints = resetPoints;
					await dbUser.save();
				}

				// Update user object locally
				user.weeklyPoints = resetPoints;

				// Add user to the appropriate league in the bidimensional array
				allUsersByLeague[newLeagueIndex].push(user);
			}
		}

		// Assign the updated user lists to the leagues
		for (let i = 0; i < leagues.leagues.length; i++) {
			leagues.leagues[i].users = allUsersByLeague[i];
		}

		// Save updated leagues document
		await leagues.save();
		return res.status(200).json({
			message: "Weekly reset successful",
		});
	} catch (error) {
		console.error("Error during weekly reset:", error);
		return res.status(500).json({ message: "Internal server error." });
	}
});

app.post("/dailyReset", async (req, res) => {
	const { password } = req.body;

	// Validate the provided password
	if (password != process.env.SERVER_PASS) {
		return res.status(404).json({ message: "Not valid credentials." });
	}

	try {
		// Reset `dayPoints` for all users in the `User` collection
		await User.updateMany({}, { $set: { dayPoints: 0 } });

		// Retrieve and update the `Leagues` document
		const leagues = await Leagues.findOne();
		if (!leagues) {
			throw new Error("Leagues document not found.");
		}

		// Iterate through each league and reset `dayPoints` for its users
		for (let league of leagues.leagues) {
			for (let user of league.users) {
				user.dayPoints = 0; // Reset the dayPoints field
			}
		}

		// Save the updated leagues document
		await leagues.save();

		return res.status(200).json({
			message: "Daily reset successful",
		});
	} catch (error) {
		console.error("Error during daily reset:", error);
		return res.status(500).json({ message: "Internal server error." });
	}
});

app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
