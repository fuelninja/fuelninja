
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.fuelninja.mobile',
  appName: 'FuelNinja',
  webDir: 'dist',
  bundledWebRuntime: false,
  // Enable live reloading in development
  server: {
    url: "https://your-sandbox-url.lovableproject.com?forceHideBadge=true",
    cleartext: true
  }
};

export default config;
</lov-add-dependency>capacitor@latest</lov-add-dependency>
<lov-add-dependency>@capacitor/core@latest</lov-add-dependency>
<lov-add-dependency>@capacitor/cli@latest --dev</lov-add-dependency>
<lov-add-dependency>@capacitor/ios@latest</lov-add-dependency>
<lov-add-dependency>@capacitor/android@latest</lov-add-dependency>
