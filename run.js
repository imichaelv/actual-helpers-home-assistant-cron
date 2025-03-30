const util = require('util');
const exec = util.promisify(require('child_process').exec);

async function lsExample() {
    try {
        console.log(process.env.ACTUAL_SERVER_URL)
        const { stdout, stderr } = await exec('ls');
        console.log('stdout:', stdout);
        console.log('stderr:', stderr);
    } catch (e) {
        console.error(e); // should contain code (exit code) and signal (that caused the termination).
    }
}


lsExample()