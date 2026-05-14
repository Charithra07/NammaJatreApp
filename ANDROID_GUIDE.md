# Step-by-Step Android Studio Guide for Jatre-Namma

Follow these steps to port the **Jatre-Namma** application to your Android Studio project.

## 1. Project Setup
1. Open Android Studio and create a **New Project**.
2. Select **Empty Compose Activity**.
3. Name your project `JatreNamma` and use package name `com.jatre.namma`.

## 2. Add Firebase to Android
1. Go to [Firebase Console](https://console.firebase.google.com/).
2. Add an Android App to your project.
3. Download the `google-services.json` file and place it in the `app/` directory of your Android project.
4. Add Firebase SDKs to your `build.gradle` files:
   - **Project Level:** `id("com.google.gms.google-services") version "4.4.0" apply false`
   - **App Level:** `id("com.google.gms.google-services")`, `implementation("com.google.firebase:firebase-firestore-ktx")`, `implementation("com.google.firebase:firebase-auth-ktx")`.

## 3. Copy Source Files
We have pre-created the logic for you in the `android/` folder of this web project:
1. **Models:** Copy `android/JatreApp/app/src/main/java/com/jatre/namma/model/Models.kt` to your project.
2. **MainActivity:** Use the logic in `android/JatreApp/app/src/main/java/com/jatre/namma/MainActivity.kt`.
3. **Themes & UI:** Use the Compose patterns shown in the code to build out your screens.

## 4. Google Maps Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/).
2. Enable **Maps SDK for Android**.
3. Create an API Key and add it to your `AndroidManifest.xml`:
   ```xml
   <meta-data
       android:name="com.google.android.geo.API_KEY"
       android:value="YOUR_API_KEY_HERE" />
   ```

## 5. Deployment
- Connect your Android device or start an emulator.
- Click the **Run** button (Green Triangle) in Android Studio.

---

*Note: You can export all these files as a ZIP by going to **Settings ⚙️** > **Export** > **ZIP** in the top right corner of this AI Studio window.*
