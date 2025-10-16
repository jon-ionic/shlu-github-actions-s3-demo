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
      },
      apps: [
        {
          name: 'one',
          webDir: 'mfes/one',
          liveUpdateConfig: {
            appId: 'e42f72bb',
            channel: 'production',
            autoUpdateMethod: 'none',
            strategy: 'differential',
          }
        },
        {
          name: 'two',
          webDir: 'mfes/two',
          liveUpdateConfig: {
            appId: 'df240a48',
            channel: 'production',
            autoUpdateMethod: 'none',
            strategy: 'differential',
          }
        },
      ]
    } 
  }
};

export default config;
