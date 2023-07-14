# Self-Hosted Live Updates demo with Github Actions + Amazon S3

This project uses Github actions to build, bundle, and deploy updates `main` branch changes to Amazon S3. The bundle is then registered with Appflow and can be deployed to the appropriate live update channel from the dashboard.

## Adding self-hosted live updates to a Capacitor app
- A signing key was generated from the Ionic Cloud CLI. The public key was manually copied to the iOS app and was automatically synced to the Android app. The private key was saved as a Github Action secret.
- The `@capacitor/live-updates` plugin was installed and configured in the [capacitor.config.ts file](https://github.com/jon-ionic/shlu-github-actions-s3-demo/blob/main/capacitor.config.ts#L3-L9).  
- A native binary was built using the signing key present.
- The [live_update](https://github.com/jon-ionic/shlu-github-actions-s3-demo/blob/main/.github/workflows/live_update.yml) Action was added, which builds, bundles, and uploads the file to an S3 bucket whenever a change is pushed to the main branch.
- The build is registered with Appflow and can be deployed to the appropriate channel.
