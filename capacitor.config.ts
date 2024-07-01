import { CapacitorConfig, LiveUpdateConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'shlu-github-actions-s3-demo',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
  }
};

export default config;
