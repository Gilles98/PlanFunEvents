import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'be.ProjectGuiGillesMobielApplicaties.PlanFunEvents',
  appName: 'Save The Date',
  webDir: 'www',
  bundledWebRuntime: false,
  plugins: {
    // Onderstaande lijn genereert een linting fout
    // Hier is niets aan te doen, behalve deze te negeren.
    // eslint-disable-next-line @typescript-eslint/naming-convention
    FirebaseAuthentication: {
      skipNativeAuth: false,
      providers: ['phone', 'google.com'],
    },
  }
};

export default config;
