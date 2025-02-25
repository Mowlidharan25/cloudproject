let currentExercise = 0;
let timer;
let totalCalories = 0;

function startExercise(index) {
    let exerciseElement = document.getElementById(`exercise-${index}`);
    let video = document.getElementById(`video-${index}`);
    let timerDisplay = document.getElementById(`timer-${index}`);

    video.play();

    // Determine duration and sets based on exercise type
    let exerciseName = exerciseElement.querySelector('h3').innerText.toLowerCase();
    let duration = (exerciseName.includes("jump") || exerciseName.includes("plank")) ? 40 : 25;
    let sets = (exerciseName.includes("squat") || exerciseName.includes("push-up") || exerciseName.includes("lunge")) ? 3 : 1;

    let currentSet = 1;
    let timeLeft = duration;

    timer = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            timerDisplay.innerText = `Set ${currentSet}/${sets} - Time Left: ${timeLeft}s`;
        } else {
            totalCalories += Math.floor(duration * 0.1); // Basic calorie calculation
            document.getElementById("calories-burned").innerText = `Calories Burned: ${totalCalories}`;

            if (currentSet < sets) {
                currentSet++;
                timeLeft = duration; // Reset timer for next set
            } else {
                clearInterval(timer);
                timerDisplay.innerText = "Completed!";
            }
        }
    }, 1000);
}

function pauseExercise(index) {
    let video = document.getElementById(`video-${index}`);
    video.pause();
    clearInterval(timer);
}
