const util = require('util');
const exec = util.promisify(require('child_process').exec);
const fs = require('fs')

async function lsExample() {
    try {
        // const options = fs.readFileSync('/data/options.json')
        // console.log('options', options)

        console.log('ENV', process.env.ACTUAL_SERVER_URL)


        // const { stdout, stderr } = await exec('node apply-interest.js');
        const { stdout, stderr } = await exec('ls /data/');
        console.log('stdout:', stdout);
        console.log('stderr:', stderr);
    } catch (e) {
        console.error(e); // should contain code (exit code) and signal (that caused the termination).
    }
}


lsExample()