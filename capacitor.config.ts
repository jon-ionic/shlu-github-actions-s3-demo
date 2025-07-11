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
            appId: 'asdgdagrdfa',
            channel: 'production',
            autoUpdateMethod: 'none',
          }
        },
        {
          name: 'two',
          webDir: './web/two/dist',
          liveUpdateConfig: {
            appId: 'df240a48',
            channel: 'production',
            autoUpdateMethod: 'none'
          }
        }
      ]
    } 
  }
};

export default config;
