import Attempt from "../../models/attemptModel.js";

// function to resave all attempts to trigger the exercise stats update
async function resaveAttempts() {
    console.log("resaving attempts");
    const attempts = await Attempt.find();
    const totalAttempts = attempts.length;
    let attemptIndex = 0;
    for(const attempt of attempts) {
        try{
            console.log(`saving attempt ${attemptIndex} of ${totalAttempts}`);
            attemptIndex += 1;
            await attempt.save();
        }
        catch(err){
            console.error("error resaving attempt",err);
            //delete attempt
            //await Attempt.findByIdAndDelete(attempt._id);
        }
    }
    console.log("done resaving attempts");
}

async function getAttempt(id) {
    try{
        const attempt = await Attempt.findById(id);
        return attempt;
    }
    catch(err){
        console.error(err);
        return null;
    }
}


export { resaveAttempts,getAttempt }
