const util = require('util');
const { spawn } = require('child_process')
const fs = require('fs')

async function runActualHelpersForHomeAssistant() {
    try {
        console.log("Starting Actual-Helpers for Home Assistant")
        const options = JSON.parse(fs.readFileSync('/data/options.json').toString('utf-8'))

        process.env.ACTUAL_SERVER_URL = options.ACTUAL_SERVER_URL
        process.env.ACTUAL_SERVER_PASSWORD = options.ACTUAL_SERVER_PASSWORD


        if (options.NODE_TLS_REJECT_UNAUTHORIZED) {
            process.env.NODE_TLS_REJECT_UNAUTHORIZED= options.NODE_TLS_REJECT_UNAUTHORIZED
        }
        if (options.ACTUAL_FILE_PASSWORD) {
            process.env.ACTUAL_FILE_PASSWORD = options.ACTUAL_FILE_PASSWORD
        }
        if (options.ACTUAL_CACHE_DIR) {
            process.env.ACTUAL_CACHE_DIR = options.ACTUAL_CACHE_DIR
        }

        if (options.INTEREST_PAYEE_NAME) {
            process.env.INTEREST_PAYEE_NAME = options.INTEREST_PAYEE_NAME
        }

        if (options.INVESTMENT_PAYEE_NAME) {
            process.env.INVESTMENT_PAYEE_NAME = options.INVESTMENT_PAYEE_NAME
        }
        if (options.INVESTMENT_CATEGORY_GROUP_NAME) {
            process.env.INVESTMENT_CATEGORY_GROUP_NAME = options.INVESTMENT_CATEGORY_GROUP_NAME
        }
        if (options.INVESTMENT_CATEGORY_NAME) {
            process.env.INVESTMENT_CATEGORY_NAME = options.INVESTMENT_CATEGORY_NAME
        }

        if (options.SIMPLEFIN_CREDENTIALS) {
            process.env.SIMPLEFIN_CREDENTIALS = options.SIMPLEFIN_CREDENTIALS
        }

        if (options.BITCOIN_PRICE_URL) {
            process.env.BITCOIN_PRICE_URL = options.BITCOIN_PRICE_URL
        }
        if (options.BITCOIN_PRICE_JSON_PATH) {
            process.env.BITCOIN_PRICE_JSON_PATH = options.BITCOIN_PRICE_JSON_PATH
        }
        if (options.BITCOIN_PAYEE_NAME) {
            process.env.BITCOIN_PAYEE_NAME = options.BITCOIN_PAYEE_NAME
        }

        for (const ID of options.ACTUAL_SYNC_ID) {
            process.env.ACTUAL_SYNC_ID = ID

            if (options.sync_bank) {
                await execute_script('sync-banks.js')
            }
            if (options.track_bitcoin_price) {
                await execute_script('sync-bitcoin.js')
            }
            const day = new Date().getDate()
            if (day === options.month_sync_day) {

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

                if (options.track_annuity_intrest) {
                    await execute_script('apply-annuity.js')
                }
            }
        }
    } catch (e) {
        console.error(e); // should contain code (exit code) and signal (that caused the termination).
    }
}


const execute_script = async (scriptName) => {
    try {
        console.log(`Starting to execute script: ${scriptName}`)
        return new Promise((resolve, reject) => {
            const child = spawn('node', [scriptName], {
                stdio: 'inherit'
            })
            child.on('close', (code) => {
                if (code === 0) {
                    resolve()
                } else {
                    reject(new Error(`Script ${scriptName} exited with code: ${code}`))
                }
            })
            child.on('error', (err) => {
                reject(new Error(`Failed to start script ${scriptName}: ${err?.message}`))
            })
        })
    } catch (e) {
        console.log(`failed executing: ${scriptName}`, e )
    }
}

runActualHelpersForHomeAssistant().then(() => console.log("Done..."))
