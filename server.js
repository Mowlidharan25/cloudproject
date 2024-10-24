// Import required modules
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Initialize the app
const app = express();

// Middleware
app.use(cors()); // Enable CORS for cross-origin requests
app.use(bodyParser.json()); // Parse JSON bodies

// MongoDB connection
const mongoURI = process.env.MONGODB_URI || "mongodb://localhost:27017/student_records"; // Adjusted database name
mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("MongoDB connected"))
.catch((err) => console.error("MongoDB connection error:", err));

// Define Student Schema with validation
const studentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    rollNumber: { type: String, required: true },
    quarterlyMarks: { type: Number, required: true, min: 0, max: 100 },
    halfYearlyMarks: { type: Number, required: true, min: 0, max: 100 },
    averageMarks: { type: Number, required: true, min: 0, max: 100 },
    gender: { type: String, required: true, enum: ['Male', 'Female', 'Other'] }, // Gender validation using enum
});

// Create Student Model
const Student = mongoose.model("Student", studentSchema);

// Root route to display a welcome message
app.get('/', (req, res) => {
    res.send('Welcome to the Student Records API!');
});

// API route to save student data
app.post("/api/students", async (req, res) => {
    const { name, rollNumber, quarterlyMarks, halfYearlyMarks, gender } = req.body;

    // Calculate average marks
    const averageMarks = ((Number(quarterlyMarks) + Number(halfYearlyMarks)) / 2).toFixed(2);

    // Validation for scores
    const scores = [quarterlyMarks, halfYearlyMarks, averageMarks];
    const isValidScore = scores.every(score => score >= 0 && score <= 100);

    if (!isValidScore) {
        return res.status(400).json({ error: "Marks must be between 0 and 100." });
    }

    try {
        const newStudent = new Student({
            name,
            rollNumber,
            quarterlyMarks,
            halfYearlyMarks,
            averageMarks,
            gender,
        });
        await newStudent.save();
        res.status(201).json({ message: "Student data saved!" });
    } catch (err) {
        console.error("Error saving student data:", err);
        res.status(500).json({ error: "Failed to save student data" });
    }
});

// API route to fetch all students
app.get("/api/students", async (req, res) => {
    try {
        const students = await Student.find();
        res.json(students);
    } catch (err) {
        console.error("Error fetching student data:", err);
        res.status(500).json({ error: "Failed to fetch student data" });
    }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
