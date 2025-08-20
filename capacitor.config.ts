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
          webDir: './web/one/dist',
          liveUpdateConfig: {
            appId: '42f81456',
            channel: 'dev-0.0.1',
            autoUpdateMethod: 'none',
          }
        },
        {
          name: 'two',
          webDir: './web/two/dist',
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
