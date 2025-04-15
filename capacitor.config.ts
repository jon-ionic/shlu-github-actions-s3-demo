import { CapacitorConfig } from '@capacitor/cli';

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
      channel: '',
      autoUpdateMethod: 'none',
      maxVersions: 2,
      strategy: 'differential',
      // key: 'ionic_cloud_public.pem',
    },
  }
};

export default config;
