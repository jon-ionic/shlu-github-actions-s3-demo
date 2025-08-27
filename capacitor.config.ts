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
          name: 'host',
          webDir: 'mfes/two',
          liveUpdateConfig: {
            appId: '3f567775',
            channel: 'production',
            autoUpdateMethod: 'none',
            strategy: 'differential',
          }
        },
        {
          name: 'funding',
          webDir: 'mfes/one',
          liveUpdateConfig: {
            appId: '31384ca9',
            channel: 'Test',
            autoUpdateMethod: 'none',
            strategy: 'differential',
          }
        },
        {
          name: 'copytrading',
          webDir: 'mfes/two',
          liveUpdateConfig: {
            appId: '2cad9afe',
            channel: 'Test',
            autoUpdateMethod: 'none',
            strategy: 'differential',
          }
        },
        {
          name: 'ai',
          webDir: 'mfes/one',
          liveUpdateConfig: {
            appId: '0aeaea87',
            channel: 'Test',
            autoUpdateMethod: 'none',
            strategy: 'differential',
          }
        },
        {
          name: 'research',
          webDir: 'mfes/two',
          liveUpdateConfig: {
            appId: '64ebe660',
            channel: 'Test',
            autoUpdateMethod: 'none',
            strategy: 'differential',
          }
        },
        {
          name: 'education',
          webDir: 'mfes/one',
          liveUpdateConfig: {
            appId: 'b2665ebf',
            channel: 'Test',
            autoUpdateMethod: 'none',
            strategy: 'differential',
          }
        },
        {
          name: 'competitions',
          webDir: 'mfes/two',
          liveUpdateConfig: {
            appId: '6c07a49a',
            channel: 'Test',
            autoUpdateMethod: 'none',
            strategy: 'differential',
          }
        },
      ]
    } 
  }
};

export default config;
