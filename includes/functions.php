<?php
function getExercises($age, $gender, $weightCategory) {
    $json = file_get_contents(__DIR__ . '/../modules/exercises.json');
    $data = json_decode($json, true);

    // Determine age category
    if ($age <= 12) {
        $age_category = "children";
    } elseif ($age >= 13 && $age <= 19) {
        $age_category = "teenagers";
    } else {
        $age_category = "adult";
    }

    // Check if data exists for the given age category, gender, and weight category
    if (!isset($data[$age_category][$gender][$weightCategory])) {
        return [];
    }

    // Return exercises for the specific age category, gender, and weight category
    return $data[$age_category][$gender][$weightCategory];
}
?>
