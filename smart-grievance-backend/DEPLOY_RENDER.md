Backend Deployment (Render)

1. Push this repository to GitHub.
2. In Render, click New + -> Blueprint.
3. Select your repository and deploy using render.yaml.
4. In Render dashboard, set all sync:false env vars:
   - MONGO_URI
   - JWT_SECRET
   - BREVO_API_KEY
   - BREVO_SENDER
   - TWILIO_ACCOUNT_SID
   - TWILIO_AUTH_TOKEN
   - TWILIO_PHONE_NUMBER
5. Wait for deploy to finish.
6. Verify health endpoint:
   https://<your-render-service>.onrender.com/api/health

Frontend connection

1. In frontend, set EXPO_PUBLIC_API_URL to deployed backend URL.
2. Keep app.json extra.apiUrl as local fallback if needed.
3. For APK builds, use EAS secrets:
   eas secret:create --scope project --name EXPO_PUBLIC_API_URL --value https://<your-render-service>.onrender.com
4. Build APK:
   npx eas build -p android --profile preview --clear-cache

After this, Wi-Fi changes do not affect app networking.
