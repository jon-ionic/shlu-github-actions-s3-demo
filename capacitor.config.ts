import { CapacitorConfig, LiveUpdateConfig } from '@capacitor/cli';

const liveUpdatesConfig: LiveUpdateConfig = {
  appId: '42f81456',
  channel: 'prod-0.0.1',
  autoUpdateMethod: 'background',
}

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'shlu-github-actions-s3-demo',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    LiveUpdates: liveUpdatesConfig,
  }
};

export default config;
