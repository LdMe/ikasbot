import Attempt from "../../models/attemptModel.js";

// function to resave all attempts to trigger the exercise stats update
async function resaveAttempts() {
    console.log("resaving attempts");
    const attempts = await Attempt.find();
    for (const attempt of attempts) {
        try{
            await attempt.save();
        }
        catch(err){
            console.error(err);
            //delete attempt
            //await Attempt.findByIdAndDelete(attempt._id);
        }
    }
}


export { resaveAttempts }
