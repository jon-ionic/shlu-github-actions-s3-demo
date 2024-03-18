import { CapacitorConfig, LiveUpdateConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'shlu-github-actions-s3-demo',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    LiveUpdates: {
      appId: '42f81456',
      channel: 'prod-0.0.1',
      autoUpdateMethod: 'none',
      maxVersions: 2,
    },
  }
};

export default config;
