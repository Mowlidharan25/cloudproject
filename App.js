import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  registerables,
} from "chart.js";

// Register Chart Components
ChartJS.register(...registerables);

function App() {
  const [studentData, setStudentData] = useState({
    name: "",
    rollNumber: "",
    quarterlyMarks: "",
    halfYearlyMarks: "",
    gender: "",
  });
  const [students, setStudents] = useState([]);
  const [genderChartData, setGenderChartData] = useState({});
  const [lineChartData, setLineChartData] = useState({});
  const [averageMarks, setAverageMarks] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch students from the backend API running on port 5000
  const fetchStudents = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/students");
      setStudents(response.data);
      prepareGenderChartData(response.data);
      prepareLineChartData(response.data);
    } catch (err) {
      console.error("Error fetching students:", err);
      setError("Failed to fetch student data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudentData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const avgMarks = (
      (Number(studentData.quarterlyMarks) + Number(studentData.halfYearlyMarks)) / 2
    ).toFixed(2);
    setAverageMarks(avgMarks);

    try {
      // Send the new student data to the backend API
      await axios.post("http://localhost:5000/api/students", {
        ...studentData,
        averageMarks: avgMarks,
      });
      setIsSubmitted(true);
      fetchStudents(); // Refetch students to update charts and display new data
    } catch (err) {
      console.error("Error submitting student data:", err);
      setError("Failed to submit student data.");
    }
  };

  // Prepare the data for the Gender Pie Chart
  const prepareGenderChartData = (data) => {
    const genderCount = { Male: 0, Female: 0, Other: 0 };
    data.forEach((student) => genderCount[student.gender]++);
    setGenderChartData({
      labels: ["Male", "Female", "Other"],
      datasets: [
        {
          label: "Gender Distribution",
          data: [
            ((genderCount.Male / data.length) * 100).toFixed(2),
            ((genderCount.Female / data.length) * 100).toFixed(2),
            ((genderCount.Other / data.length) * 100).toFixed(2),
          ],
          backgroundColor: ["#4BC0C0", "#9966FF", "#FF6384"],
        },
      ],
    });
  };

  // Prepare the data for the Line Chart (marks comparison)
  const prepareLineChartData = (data) => {
    setLineChartData({
      labels: data.map((s) => s.name), // Labels will be student names
      datasets: [
        {
          label: "Quarterly Marks",
          data: data.map((s) => s.quarterlyMarks),
          borderColor: "#4BC0C0",
        },
        {
          label: "Half-Yearly Marks",
          data: data.map((s) => s.halfYearlyMarks),
          borderColor: "#FF6384",
        },
      ],
    });
  };

  if (loading) return <h2>Loading...</h2>;
  if (error) return <h2 style={{ color: "red" }}>{error}</h2>;

  return (
    <div className="App">
      <header className="App-header">
        <h1>Class Student Records</h1>

        {/* Form for student input */}
        <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
          <input
            type="text"
            name="name"
            value={studentData.name}
            onChange={handleChange}
            placeholder="Name"
            required
          />
          <input
            type="text"
            name="rollNumber"
            value={studentData.rollNumber}
            onChange={handleChange}
            placeholder="Roll Number"
            required
          />
          <input
            type="number"
            name="quarterlyMarks"
            value={studentData.quarterlyMarks}
            onChange={handleChange}
            placeholder="Quarterly Marks"
            required
          />
          <input
            type="number"
            name="halfYearlyMarks"
            value={studentData.halfYearlyMarks}
            onChange={handleChange}
            placeholder="Half-Yearly Marks"
            required
          />
          <select name="gender" value={studentData.gender} onChange={handleChange} required>
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          <button type="submit" style={{ marginLeft: '10px' }}>Submit</button>
        </form>

        {/* Display average marks after form submission */}
        {isSubmitted && <h2>Average Marks: {averageMarks}</h2>}

        {/* List of all students */}
        <h2>All Students:</h2>
        <ul>
          {students.map((student) => (
            <li key={student.rollNumber}>
              {student.name} (Roll No: {student.rollNumber}) - Quarterly Marks: {student.quarterlyMarks}, Half-Yearly Marks: {student.halfYearlyMarks}, Average Marks: {student.averageMarks}, Gender: {student.gender}
            </li>
          ))}
        </ul>

        {/* Show charts if students exist */}
        {students.length > 0 && (
          <div>
            <div>
              <h2>Gender Distribution</h2>
              <Pie data={genderChartData} />
            </div>
            <div>
              <h2>Marks Comparison</h2>
              <Line data={lineChartData} />
            </div>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
