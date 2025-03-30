const util = require('util');
const exec = util.promisify(require('child_process').exec);
const fs = require('fs')

async function lsExample() {
    try {
        const options = JSON.parse(fs.readFileSync('/data/options.json').toString('utf-8'))

        process.env.ACTUAL_SERVER_URL = options.ACTUAL_SERVER_URL
        process.env.ACTUAL_SERVER_PASSWORD = options.ACTUAL_SERVER_PASSWORD
        process.env.ACTUAL_SYNC_ID = options.ACTUAL_SYNC_ID

        process.env.NODE_TLS_REJECT_UNAUTHORIZED= options.NODE_TLS_REJECT_UNAUTHORIZED
        process.env.ACTUAL_FILE_PASSWORD = options.ACTUAL_FILE_PASSWORD
        process.env.ACTUAL_CACHE_DIR = options.ACTUAL_CACHE_DIR

        process.env.INTEREST_PAYEE_NAME = options.INTEREST_PAYEE_NAME
        process.env.INVESTMENT_PAYEE_NAME = options.INVESTMENT_PAYEE_NAME

        process.env.INVESTMENT_CATEGORY_GROUP_NAME = options.INVESTMENT_CATEGORY_GROUP_NAME
        process.env.INVESTMENT_CATEGORY_NAME = options.INVESTMENT_CATEGORY_NAME

        process.env.SIMPLEFIN_CREDENTIALS = options.SIMPLEFIN_CREDENTIALS

        process.env.BITCOIN_PRICE_URL = options.BITCOIN_PRICE_URL
        process.env.BITCOIN_PRICE_JSON_PATH = options.BITCOIN_PRICE_JSON_PATH
        process.env.BITCOIN_PAYEE_NAME = options.BITCOIN_PAYEE_NAME

        if (options.sync_bank) {
            await execute_script('sync-banks.js')
        }
        if (options.track_bitcoin_price) {
            await execute_script('sync-bitcoin.js')
        }
        const day = new Date().getDate()
        if (day === options.sync_day) {

            if (options.apply_interest) {
                await execute_script('apply-interest.js')
            }
            if (options.track_home_price) {
                await execute_script('zestimate.js')
            }
            if (options.track_car_prices) {
                await execute_script('kbb.js')
            }
            if (options.track_investment_account) {
                await execute_script('track-investments.js')
            }
        }
    } catch (e) {
        console.error(e); // should contain code (exit code) and signal (that caused the termination).
    }
}


const execute_script = async (scriptName) => {
    try {
        console.log(`Starting to execute script: ${scriptName}`)
        const { stdout, stderr } = await exec(`node ${scriptName}`);
        console.log(stdout);
        console.log(stderr);
    } catch (e) {
        console.log(`failed executing: ${scriptName}`, e )
    }
}

lsExample()