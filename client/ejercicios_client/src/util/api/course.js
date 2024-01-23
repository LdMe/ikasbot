import { fetchApi } from '../helpers';

/* const calculateCourseScores = (courses) => {
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
            if(!subject.exercises){
                continue;
            }
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
} */
const getCourses = async () => {
    try {
        const url = `/course`;
        return await fetchApi(url,"GET");
    }
    catch (err) {
        console.error(err);
        return {error: err.message};
    }
}

const getCourse = async (id) => {
    try {
        const url = `/course/${id}`;
        return await fetchApi(url,"GET");
    }
    catch (err) {
        console.error(err);
        return {error: err.message};
    }
}
const createCourse = async (data) => {
    try {
        const url = `/course`;
        return await fetchApi(url,"POST",data);
    }
    catch (error) {
        console.error(error)
        return { error: error.message };
    }
}

const deleteCourse = async (id) => {
    try {
        const url = `/course/${id}`;
        return await fetchApi(url,"DELETE");
    }
    catch (error) {
        console.error(error)
        return { error: error.message };
    }
}

const addTeacher = async (courseId,teacherId) => {
    try {
        const url = `/course/${courseId}/teacher/`;
        return await fetchApi(url,"POST",{teacher:teacherId});
    }
    catch (error) {
        console.error(error)
        return {error: error.message };
    }
}

const removeTeacher = async (courseId,teacherId) => {
    try {
        const url = `/course/${courseId}/teacher/`;
        return await fetchApi(url,"DELETE",{teacher:teacherId});
    }
    catch (error) {
        console.error(error)
        return { error: error.message };
    }
}

const enrollStudent = async (courseId,studentId) => {
    try {
        const url = `/course/${courseId}/enroll/`;
        const result = await fetchApi(url,"POST",{student:studentId});
        console.log("sressulkt",result)
        return result;
    }
    catch (error) {
        console.error(error)
        return { error: error.message };
    }
}

const unenrollStudent = async (courseId,studentId) => {
    try {
        const url = `/course/${courseId}/enroll/`;
        return await fetchApi(url,"DELETE",{student:studentId});
    }
    catch (error) {
        console.error(error)
        return { success: false, message: error.message };
    }
}

export{
    
    getCourses,
    getCourse,
    createCourse,
    deleteCourse,
    addTeacher,
    removeTeacher,
    enrollStudent,
    unenrollStudent
    
}