// testController. This controller will receive some code and a exercise._id, and will return the execution of the tests on the code.

import Exercise from "../models/exerciseModel.js";
import Attempt from "../models/attemptModel.js";

import fs from "fs";
import path from "path";
import { exec } from 'node:child_process';
import util from 'util';



/**
 * test a code against a exercise
 * @param {string} userId - user id
 * @param {string} exerciseId - exercise id
 * @param {string} code - code to be tested
 * @returns {object} - test result
 */
const testCode = async (userId,exerciseId, code) => {
    // get exercise
    try {
        const attempts = await Attempt.find({ exercise: exerciseId, createdBy: userId }).sort({ createdAt: 1 });
        // if code is the same as any of the previous attempts, throw error
        if(attempts.some(attempt => attempt.code === code)){
            throw new Error("You have already submitted this code");
        }
        // if number of attempts for this exercise is greater than 3, remove the oldest attempt
        if (attempts.length > 3) {
            const notSuccessAttempts = attempts.filter(attempt => !attempt.success);
            if (notSuccessAttempts.length > 0) {
                await Attempt.findByIdAndDelete(notSuccessAttempts[0]._id);
            }
            else {
                throw new Error("You have reached the maximum number of  correct attempts");
            }
        }
        
        const newAttempt = new Attempt({ code, exercise: exerciseId,createdBy:userId });
        await newAttempt.save();
    }
    catch (err) {
        console.error(err);
        const attempt = await Attempt.findOne({code,exercise:exerciseId,createdBy:userId});
        if(!attempt){
            return { success: false, message: err.message };
        }
        attempt.success = false;
        attempt.message = err.message;
        await attempt.save();
        return attempt;
    }
    const exercise = await Exercise.findById(exerciseId);
    // run code against test
    const testResult = await runTest(code, exercise,userId);
    const attempt = await Attempt.findOne({code,exercise:exerciseId,createdBy:userId});
    attempt.success = testResult.success;
    attempt.message = testResult.message;
    await attempt.save();
    // return test result
    return attempt;
}

/**
 * run a test against a code
 * @param {string} code - code to be tested
 * @param {string} test - test to be run
 * @returns {object} - test result
 */
const runTest = async (code, exercise,userId="test-user") => {
    try {
        const { success, message } = await runInDocker(code, exercise.test,userId);
        return { success, message };
    }
    catch (err) {
        console.error(err);
        return { success: false, message: "err.message" };
    }
}
async function runInDocker(code, test,username="test-user") {
    console.log("running in docker");
    const userPath = `./test/${username}`;
    try {

        const execPromise = util.promisify(exec);
        // Guarda el código del estudiante en un archivo temporal
        const text = `
        ${code}
        ${test}
        `;
        
        console.log("userPath", userPath);
        // crear directorio con el nombre del usuario
        if (!fs.existsSync(userPath)) {
            fs.mkdirSync(userPath);
        }
        // crear archivo temporal
        fs.writeFileSync(`${userPath}/test.js`, text);
        // conseguir el path absoluto del archivo temporal
        const __dirname = path.resolve();
        const filePath = path.join(__dirname, `${userPath}/test.js`);

        const dockerCommand = `docker exec  -i js-test jest ${username}/test.js`;

        const { stdout, stderr } = await execPromise(dockerCommand);

        //console.log(stdout);
        //console.log(stderr);
        // Borra el archivo temporal
        fs.unlinkSync(`${userPath}/test.js`);
        // borra la carpeta del usuario
        fs.rmSync(userPath, { recursive: true, force: true });
        console.log("message----", stderr);
        const [executionCode, message] = stderr.split("test.js\n ");
        console.log("message----", message);
        return { success: true, message };
        
    }
    catch (err) {
        const messageSplit = err.message.split("test.js\n ");
        fs.unlinkSync(`${userPath}/test.js`);
        // borra la carpeta del usuario
        fs.rmSync(userPath, { recursive: true, force: true });
        if(messageSplit.length > 1){
            const message = messageSplit[1];
            return { success: false, message };
        }
        return { success: false, message:err.message };
    }

}

export { testCode, runTest };
