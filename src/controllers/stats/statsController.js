import ExerciseStats from "../../models/exerciseStatsModel.js";
import SubjectStats from "../../models/subjectStatsModel.js";


async function getExerciseStats(user,exercise){
    try{
        const stats = await ExerciseStats.findOne({user: user, exercise: exercise});
        if(stats){
            return stats;
        }
        return null;
    }
    catch(err){
        console.error(err);
        return null;
    }
}

async function getSubjectStats(user,subject){
    try{
        const stats = await SubjectStats.findOne({user: user, subject: subject});
        if(stats){
            return stats;
        }
        return null;
    }
    catch(err){
        console.error(err);
        return null;
    }
}

async function getUserStats(user){
    try{
        const subjectStats = await SubjectStats.find({user: user});
        // for each subject, get the exercises stats
        const exerciseStatsPromises = subjectStats.map(async (subjectStat) => {
            const exercisesStats = await ExerciseStats.find({user: user, subjectStats: subjectStat._id});
            return {
                subject: subjectStat,
                exercises: exercisesStats
            }
        });
        const exerciseStats = await Promise.all(exerciseStatsPromises);

        return exerciseStats;
    }
    catch(err){
        console.error(err);
        return null;
    }
}




export { getExerciseStats, getSubjectStats,getUserStats }