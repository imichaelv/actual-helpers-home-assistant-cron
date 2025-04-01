const api = require('@actual-app/api');
const { closeBudget, ensurePayee, getAccountBalance, getAccountNote, getLastTransactionDate, openBudget, showPercent } = require('./utils');
require("dotenv").config();

(async () => {
    await openBudget()
    const payeeId = await ensurePayee(process.env.INTEREST_PAYEE_NAME || 'Loan Interest')

    const accounts = await api.getAccounts()
    for (const account of accounts) {
        if (account.closed) {
            continue
        }
        const note = await getAccountNote(account)

        if (note) {
            if (
                note.indexOf('annuityRate:') > -1 &&
                note.indexOf('annuityPaymentDay:') > -1 &&
                note.indexOf('annuityLoanAmount:') > -1 &&
                note.indexOf('annuityStartDate:') > -1 &&
                note.indexOf('annuityLoanDuration:') > -1

            ) {
                let annuityRate = parseFloat(note.split('annuityRate:')[1].split('\n')[0])
                const paymentDay = parseFloat(note.split('annuityPaymentDay:')[1].split('\n')[0])
                const duration = parseInt(note.split('annuityLoanDuration:')[1].split('\n')[0])
                const amount = parseFloat(note.split('annuityLoanAmount:')[1].split('\n')[0])
                const startDate = new Date(note.split('annuityStartDate:')[1].split('\n')[0])
                console.log('startDate', startDate)
                let init = (note.indexOf('init:') > -1)

                const currentDate = new Date()
                if (currentDate.getDate() < paymentDay) {
                    currentDate.setMonth(currentDate.getMonth() -1)
                }
                currentDate.setDate(paymentDay)
                currentDate.setHours(5, 0,0,0)

                const cutoff = new Date(currentDate)
                cutoff.setMonth(cutoff.getMonth() -1)
                cutoff.setDate(cutoff.getDate() +1)

                const lastDate = await getLastTransactionDate(account, cutoff, true)
                if (!lastDate) {
                    console.log('no lastdate')
                    continue
                }

                const transactions = calculate(currentDate, startDate, amount, annuityRate, duration, payeeId, init)
                console.log(transactions)
                const balance = await getAccountBalance(account, currentDate)
                if (transactions.length) {
                    console.log(`== ${account.name} ==`)
                    console.log(` -> Month into the Annuity loan ${transactions[transactions.length -1].month}`)
                    console.log(`    as of date ${currentDate.toISOString()}`)

                    await api.importTransactions(account.id, transactions)
                }
            }
        }
    }
    await closeBudget()
})()


function calculate(currentDate, startDate, amount, annuityRate, duration, payeeId, init) {

    let months = (currentDate.getTime() - startDate.getTime()) / 1000
    months /= (60*60*24*7*4)
    months = Math.abs(Math.round(months))

    const schedule = calculateAnnuitySchedule(amount, annuityRate, duration * 12)
    let payment = schedule[months]
    if (init) {
        let payments = []

        Array.from(Array(6)).forEach((_, i) => {
            const date = startDate
            date.setMonth(date.getMonth() + i )
            payment = schedule[i]
            payments.push({
                date,
                payee: payeeId,
                amount: (parseFloat(payment.principal) * 100),
                cleared: true,
                notes: `Interest for ${payment.month} months. You payed ${payment.payment}, with ${payment.interest} to interest and ${payment.principal} to lower the loan`
            })
        })
        return payments
    }

    return [{
        date: currentDate,
        payee: payeeId,
        amount: (parseFloat(payment.principal) * 100),
        cleared: true,
        notes: `Interest for ${payment.month} months. You payed ${payment.payment}, with ${payment.interest} to interest and ${payment.principal} to lower the loan`
    }]
}

/**
 *
 * @param {number} P Loan amount
 * @param {number} annualRate interest rate %
 * @param {number} n Duration in months
 * @returns {{month: number, payment: string, interest: string, principal: string, remainingBalance: string}[]}
 */
function calculateAnnuitySchedule(P, annualRate, n) {
    let r = annualRate / 12 / 100; // Monthly interest rate
    let A = (r === 0) ? P / n : P * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);

    let schedule = [];
    let remainingPrincipal = P;

    for (let month = 1; month <= n; month++) {
        let interestPayment = remainingPrincipal * r;
        let principalRepayment = A - interestPayment;
        remainingPrincipal -= principalRepayment;

        schedule.push({
            month,
            payment: A.toFixed(2),
            interest: interestPayment.toFixed(2),
            principal: principalRepayment.toFixed(2),
            remainingBalance: Math.max(remainingPrincipal, 0).toFixed(2)
        });

        if (remainingPrincipal <= 0) break; // Stop when the loan is fully repaid
    }

    return schedule;
}