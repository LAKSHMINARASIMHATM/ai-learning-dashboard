# Firebase Setup Guide

To enable Firebase Authentication, you need to add the following environment variables to your `.env.local` file in the root directory.

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### Steps to get these values:
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Create a new project (or select an existing one).
3. Add a "Web App" to your project.
4. Copy the `firebaseConfig` object values into the variables above.
5. Enable **Google**, **GitHub**, and **Microsoft** providers in the **Authentication > Sign-in method** section.
6. Go to **Authentication > Settings > Authorized domains**.
7. Add `localhost` and `127.0.0.1` to the list of authorized domains.
