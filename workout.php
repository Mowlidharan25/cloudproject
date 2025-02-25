<?php
include 'templates/header.php';
include 'includes/functions.php';

// Get user input
$age = isset($_POST['age']) ? intval($_POST['age']) : 0;
$gender = isset($_POST['gender']) ? strtolower($_POST['gender']) : 'male';
$weight_status = isset($_POST['weight_status']) ? strtolower($_POST['weight_status']) : 'normal weight';

// Get exercises
$exercises = getExercises($age, $gender, $weight_status);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <title>Personalized Workout Plan</title>
    <link rel="stylesheet" href="assets/css/style.css">
    <script src="assets/js/workout.js" defer></script>
</head>
<body>
    <div class="container">
        <h2>Your Personalized Workout Plan</h2>

        <div id="exercise-container">
            <?php if (!empty($exercises)): ?>
                <?php foreach ($exercises as $index => $exercise): ?>
                    <div class="exercise" id="exercise-<?php echo $index; ?>">
                        <h3><?php echo htmlspecialchars($exercise['name']); ?></h3>
                        <video id="video-<?php echo $index; ?>" src="<?php echo htmlspecialchars($exercise['video']); ?>" controls></video>
                        <p>Type: <?php echo ucfirst(htmlspecialchars($exercise['type'])); ?></p>
                        <p>Duration: <?php echo htmlspecialchars($exercise['duration']); ?> mins</p>
                        <p>Sets: <?php echo htmlspecialchars($exercise['sets']); ?></p>
                        <p id="timer-<?php echo $index; ?>">Time Left: 00:00</p>
                        <button onclick="startExercise(<?php echo $index; ?>)">Start</button>
                        <button onclick="pauseExercise(<?php echo $index; ?>)">Pause</button>
                    </div>
                <?php endforeach; ?>
            <?php else: ?>
                <p>No exercises found for your category. Please adjust your inputs and try again.</p>
            <?php endif; ?>
        </div>

        <div id="summary">
            <h3>Workout Summary</h3>
            <p id="calories-burned">Calories Burned: 0</p>
        </div>
    </div>
</body>
</html>
<?php include 'templates/footer.php'; ?>
