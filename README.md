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