# Cordova Plugin Media Capture Test Projects

## Setup Steps

1. Install npm packages

   ```bash
   npm run clean-start
   ```

   This can be run before and after.

   It will run the following commands in order:
   - `git clean -fdx -- ./`
     - This will delete all untracked files.
   - `git checkout -- ./`
     - This will revert any changes made to all commited files.
     - Note during the setup phase, the `pacakge.json` and `package-lock.json` files will be updated with installed platforms and plugin. This checkout ensure it reverts so when next setup runs it starting from a fresh state.
   - `npm i`
     - Install setup dependencies.

2. Run setup script

   ```bash
   npm run setup
   ```

   Follow the setup script to install desired versions of the platforms and plugins.

   The script can help setup with the following Apache's:
   - npm latest
   - npm nightly (platforms only)
   - npm beta (depending on if tag is avaialble. Check on npmjs registry to confirm)
   - git main branch
   - git custom branch/tag (Check and confirm if the branch or tag exists in repo.)
   - git custom repo (Can use any other repo and branch/tag. Recommended format `github:<org|user>/<repo-name><#<branch|tag>>`)

## Build

   ```bash
   cordova build
   ```

## Test

   It is recommended to open and run the project from Android Studio (for Android) and Xcode (for iOS).
