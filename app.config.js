import 'dotenv/config';

export default {
  expo: {
    name: "bagis_app",
    slug: "bagis_app",
    version: "1.0.0",
    sdkVersion: "52.0.0",
    owner: "petasa",
      android: {
      package: "com.petasa.bagis_app", // 👈 BURAYI EKLE
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff"
      }
    },
    extra: {
      API_KEY: process.env.API_KEY,
      AUTH_DOMAIN: process.env.AUTH_DOMAIN,
      PROJECT_ID: process.env.PROJECT_ID,
      STORAGE_BUCKET: process.env.STORAGE_BUCKET,
      MESSAGING_SENDER_ID: process.env.MESSAGING_SENDER_ID,
      APP_ID: process.env.APP_ID,
      MEASUREMENT_ID: process.env.MEASUREMENT_ID,
      GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY,

      // 🔽 Bunu elle ekliyorsun:
      eas: {
        projectId: "166505a1-d909-4e83-b689-ee8b8e4ecdba"
      }
    }
  }
};
