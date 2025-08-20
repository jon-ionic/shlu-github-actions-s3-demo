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
        name: 'shell'
      },
      apps: [
        {
          name: 'one',
          webDir: 'mfes/one',
          liveUpdateConfig: {
            appId: '42f81456',
            channel: 'dev-0.0.1',
            autoUpdateMethod: 'none',
          }
        },
        {
          name: 'two',
          webDir: 'mfes/two',
          liveUpdateConfig: {
            appId: '7beb099c',
            channel: 'production',
            autoUpdateMethod: 'none'
          }
        }
      ]
    } 
  }
};

export default config;
