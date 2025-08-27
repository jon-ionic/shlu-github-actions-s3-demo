import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'shlu-github-actions-s3-demo',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    FederatedCapacitor: {
      shell: {
        name: 'shell',
        liveUpdateConfig: {
          appId: '42f81456',
          channel: 'dev-0.0.1',
          autoUpdateMethod: 'none',
          strategy: 'zip',
        }
      },
      apps: [
        {
          name: 'cordova-app',
          webDir: 'mfes/one',
          liveUpdateConfig: {
            appId: 'c5838e2d',
            channel: 'production',
            autoUpdateMethod: 'none',
            strategy: 'zip',
          }
        },
        {
          name: 'capstone',
          webDir: 'mfes/two',
          liveUpdateConfig: {
            appId: '7beb099c',
            channel: 'production',
            autoUpdateMethod: 'none',
            strategy: 'zip',
          }
        },
      ]
    } 
  }
};

export default config;
