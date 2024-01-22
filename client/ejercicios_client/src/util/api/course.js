const calculateCourseScores = (courses) => {
    if(!courses){
        return [];
    }
    for(const course of courses){
        let totalCourseExercises = 0;
        let totalCourseExercisesPassed = 0;
        if(!course.subjects){
            continue;
        }
        for(const subject of course.subjects){
            let totalSubjectExercises = 0;
            let totalSubjectExercisesPassed = 0;
            for(const exercise of subject.exercises){
                totalCourseExercises++;
                totalSubjectExercises++;
                if(exercise.bestAttempt?.success){
                    totalCourseExercisesPassed++;
                    totalSubjectExercisesPassed++;
                }
            }
            subject.totalExercises = totalSubjectExercises;
            subject.totalExercisesPassed = totalSubjectExercisesPassed;
        }
        course.totalExercises = totalCourseExercises;
        course.totalExercisesPassed = totalCourseExercisesPassed;
    }
    return courses;
}

export{
    calculateCourseScores
}