# Actual Helpers for Home assistant
#### This is a wrapper for https://github.com/psybers/actual-helpers to work with Home Assistant

## You need Actual Budget for Home Assistant before starting this.
You can follow this here: https://github.com/sztupy/hassio-actualbudget/tree/main

# Installation

Add the addon through the following button: 
[![Open your Home Assistant instance and show the add add-on repository dialog with a specific repository URL pre-filled.](https://my.home-assistant.io/badges/supervisor_add_addon_repository.svg)](https://my.home-assistant.io/redirect/supervisor_add_addon_repository/?repository_url=https%3A%2F%2Fgithub.com%2Fimichaelv%2Factual-helpers-home-assistant-cron)

This will add this repository in your addons list.

### Configuration: 
1. Fill the Actual Server Url
2. FIll the Actual Server Password
3. Fill the Actual Sync ID in

4. Select what kinds of scripts you want to run.
5. Set the synchronization day to (this date) for first run, but leave it on the 1st of the month for chron jobs
6. Additional configuration is also possible by expanding the "Show unused optional configuration options"

This tool will automatically close upon completion, in order to run it once a day you need to make an automation.

### Make it a cron
Make a new Automation here I have my example.
Replace <actual_helpers_for_home_assistant> with the instance of the addon. (easy mode to do it in the UI)

```yaml
alias: "Sync Actual Helper for Home Assistant "
description: "This would start the Actual Helper for Home Assistant on daily bases"
triggers:
  - at: "02:00:00"
    trigger: time
conditions: []
actions:
  - action: hassio.addon_start
    metadata: {}
    data:
      addon: <actual_helpers_for_home_assistant>
mode: single
```

## For more info read into the Actual Helper and Actual website

## Additional scripts

(Only through this integration)

### Loan Annuity
Loan Annuity is a loan where you pay off a higher loan intrest in the start of the loan, but gradually payoff more dept during the loaning period.

This script will only show the amount of dept you have paid off.

For example: 
```text
Bank account (X) pays 1000 gold coins to the bank payee (Y)
Annuity Loan account (Z) has 10.000 coins in dept.
script will lower the Loan (Z) with 115 coins, the rest is lost in Interest for the Bank (Y)
End result: Annuity Loan account shows only the payment of your loan, not the interest
```

For this you need to add notes to your account where the interest should be calculated:

| note                | type    | description                                                                                   |
|---------------------|---------|-----------------------------------------------------------------------------------------------|
| payeeName           | string  | The name of the Payee (Bank) as a override for the INTEREST_PAYEE_NAME value                  |
| annuityRate         | float   | the rate of interest, for example 5.3                                                         |
| annuityPaymentDay   | integer | The day of the month when the annuity should be payed,                                        |
| annuityLoanAmount   | integer | The amount you've loaned at the start                                                         |
| annuityStartDate    | date    | The date you started paying off the loan, yyyy-MM-dd format                                   |
| annuityLoanDuration | integer | The amount of years you have a loaning contract                                               |
| init                | 'yes'   | If this is set, then it should calculate also previous months, can be removed after first run |

For example
```text
payeeName: 'Bank'
annuityRate:3.73
annuityPaymentDay:1
annuityLoanAmount:75320
annuityStartDate:2024-05-01
annuityLoanDuration:30
init:yes

```
