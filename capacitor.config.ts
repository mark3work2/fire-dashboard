import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.fire.dashboard',
  appName: 'Dashboard',
  webDir: 'out',
  server: {
    url: "https://fire-dashboard-eta.vercel.app",
    cleartext: false
  }

};

export default config;
