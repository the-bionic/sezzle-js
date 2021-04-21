## JAVASCRIPT

### Developing a new javascript version
- Checkout a branch whose title reflects the Jira ticket number and/or the feature to be built or updated.
- Make all necessary changes.
- Write new tests for any new functions and/or update existing tests as needed.
- Ensure any new HTML elements are following accessibility standards.
- Run `npx htmllint ${sample-file-name}` for each file that was updated.
	- Example: `npx htmllint src/classBased/sezzle.js`
	- Resolve any errors and run again. Repeat until there are no errors.
- Run `npm run test`.
	- Resolve any errors and run again. Repeat until there are no errors.
- Add and commit changes, then push the branch to Github.
- Open a pull request and reach out to someone with Approver access to review and merge.
	- The approver should wait for the pipeline to pass before approving.

### Releasing a new javascript version to production
- Once the branch is merged to master and the pipeline has passed, run `git checkout master` and `git pull origin master`.
- Run `npm run release -- --newversion=${new-version-number}` such that the new version follows the convention YY.MM.v (year.month.versionindex)
	- For example, if today's date is December 2020 and it is the first release this month, the version will be `20.12.0`. If it is the second release this month, it would be `20.12.1`.
	- This command will automatically update package.json, check out a branch, and push the branch to Github.
- Open a pull request and reach out to someone with Approver access to review and merge.
	- The approver should wait for the pipeline to pass before approving.
- Update the <a href="https://sezzle.atlassian.net/wiki/spaces/WID/pages/512852116/SezzleJS+Change+Log" target="_blank">SezzleJS Changelog</a> with a summary of all changes for team devs.
- Update the <a href="https://sezzle.atlassian.net/wiki/spaces/SP/pages/345243832/Release+Notes%3A+Merchant+Products" target="_blank">Release Notes</a> with a summary of all changes for external stakeholders.


## CSS

### Developing a new css version
Follow the same process as for javascript.

### Releasing a new css version to production
- Once the branch is merged to master and the pipeline has passed, run `git checkout master` and `git pull origin master`.
- Run `npm run release-css -- --newversion=${new-version-number}` such that the new version number increments following the convention ${major rewrite}.${feature change}.${iteration}
- Open a pull request and reach out to someone with Approver access to review and merge.
	- The approver should wait for the pipeline to pass before approving.

### Updating an existing css version
- To update an existing css version once the branch is merged to master and the pipeline has passed, run `git checkout master` and `git pull origin master` then `npm run update-css -- --updateversion=${version-number}`
	- For example, `npm run update-css -- --updateversion=2.0.14`.
- Open a pull request and reach out to someone with Approver access to review and merge.
	- The approver should wait for the pipeline to pass before approving.


## MODAL

### Developing a new modal vesion
- Decide the new modal version. It should increment from the current modal version following the same convention as CSS.
- Create a new directory under `modals` called `modals-<version-number>`.
	- For example, if your version is `2.0.1` then the directory name should be `modals-2.0.1`.
- Add modal.scss and modal HTML file for each of the supported languages under the new directory. The files should be named like `modal-<language-code>.html`.
	- For example, `modal-en.html` and `modal-fr.html`.
- To try out the modal locally you need to run this command `VERSION=2.0.1 LANGUAGE=en npx webpack-dev-server` and this will be accessible at `http://localhost:8081/`.
-- Now from the command you can make out, you have to specify the version and the language.
-- This runs on watch mode so any change in your respective `modal-<language>.html` file would refresh the page and show you how the mdoal would look like.
- Ensure any new HTML elements are following accessibility standards.
- Run `npx htmllint ${sample-file-name}` for each file that was updated.
	- Example: `npx htmllint modals/modals-2.0.1/modal-en.html`.
	- Resolve any errors and run again. Repeat until there are no errors.

### Releasing a new modal version to production
- Open `modals/language.json` and add a new line where the key is the new modal version number, and the value is an array of supported language codes for the new modal version. If your modal version `2.0.1` supports English and French, then the new item should look like the following:
   ```
   {
      ...,
      "2.0.1" : ["en", "fr"]
   }
    ```
- Add and commit changes, then push the branch to Github.
- Open a pull request and reach out to someone with Approver access to review and merge.
	- The approver should wait for the pipeline to pass before approving.
  ```
  Note: This step won't release a new version yet.
  ```
  - Once the branch is merged to master and the pipeline has passed, run `git checkout master` and `git pull origin master`.
- Run `npm run release-modal -- --newversion=${new-version-number}` such that the new version number increments following the convention ${major rewrite}.${feature change}.${iteration}
	- For example, `npm run release-modal -- --newversion=2.0.1`.
	- This command will automatically update `release_history.json` and `update_history.json`, check out a branch, and push the branch to Github.
- Open a pull request and reach out to someone with Approver access to review and merge.
	- The approver should wait for the pipeline to pass before approving.

### Updating an existing modal version
- To update an existing modal version once the branch is merged to master and the pipeline has passed, run `git checkout master` and `git pull origin master` then `npm run update-modal -- --updateversion=${version-number}`.
	- For example, `npm run update-modal -- --updateversion=2.0.1`.
- Open a pull request and reach out to someone with Approver access to review and merge.
	- The approver should wait for the pipeline to pass before approving.


## Upgrading all merchants to the latest version

*The following is written with the assumption that when an all-merchant upgrade occurs, it is happening for all three file types (JS, CSS, Modal) if changes have occurred, and that the regional group (US vs EU) is responsible for updating their own merchants and default versions as needed.*

**Initial Review**
- Once a new version is released, manually implement the new version on 20-50 merchants and carefully review the widget performance per the <a href="https://sezzle.atlassian.net/wiki/spaces/WID/pages/231637221/Widget+Engineering+Instructions" target="_blank">Widget QA Checklist</a>.
	- Make a special effort to test any new or changed features.
	- Also be sure to test on multiple ecommerce platforms.
- Notify the #widget-integrations (US) or #eu-widget (EU) Slack channel that we will be upgrading merchants:
	- Sample script: `The widget team will be updating merchants to a new widget version this week. We will be conducting tests beforehand to ensure the transition goes smoothly, but please keep us informed if there is a high volume of similar widget issues.`
	- Note: We should avoid performing mass updates on the last business day of the week, within 7 days of a minor holiday, or between Thanksgiving and New Years.

**Sample Batch**
- Identify 75-100 merchants for a test batch.
- Pull a report of the merchants' original versions in case we need to roll back.
- Format the list of UUIDs as an array.
- In `widget-server/deploy/production.deploy.yaml`, write a CRON job to update the applicable version(s), using the UUID array as the "include" list for the job.
- Open a merge request and reach out to someone with Approver access to review and merge.
- Once the job is merged to Production, go to <a href="https://deploy.sso.sezzle.com/jobs" target="_blank">https://deploy.sso.sezzle.com/jobs</a>, find the job name, and click Run Job.
- Manually review these merchants to confirm the update was successful and widgets are still working as expected, following the same checklist as well.

**Final Batch**
- Update the default version(s) and accompanying tests in `widget-server/defaults/widget.go`.
- Run `export ENVIRONMENT=testing && go test -v ./... -cover | grep -v vendor`.
	- Note: If you have not set up a test database locally, all tests will fail.
	- Resolve any errors and run again. Repeat until there are no errors.
- Identify any merchants with deprecated config options or other version-specific requirements.
	- If the merchant is no longer an active account, the config option is obsolete, or the config can be rewritten to no longer require the old config option, update the config accordingly.
	- If the merchant must remain on the older widget version for any reason, add their UUID to a new array in `widget-server/deploy/production.deploy.yaml`.
- Update the CRON job to update the applicable version(s), using the UUID array as the "exclude" list for the job.
- Open a merge request and reach out to someone with Approver access to review and merge.
- Once the job is merged to Production, go to <a href="https://deploy.sso.sezzle.com/jobs" target="_blank">https://deploy.sso.sezzle.com/jobs</a>, find the job name, and click Run Job.
- Closely monitor widget-server performance to ensure it remains stable following the update.
- If everything looks good after a day or two, any obsolete older version(s) can be deactivated in the database.

**Rollback Procedure**
- Open the `widget-server` project in Gitlab.
- Go to Operations > Environments
- Click the environment you wish to roll back (ex: `production`)
- On the second line in the table (the previous deploy), click the `Rollback Environment` icon to re-deploy the earlier version
- Re-do the **Final Batch** with the previous stable version
