package com.goalmogul.goalmogulbeta;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.content.ContentResolver;
import android.content.res.Configuration;
import android.content.Intent;

import android.media.AudioAttributes;
import android.media.RingtoneManager;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;

import androidx.core.app.NotificationCompat;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;
import com.swmansion.gesturehandler.react.RNGestureHandlerEnabledRootView;

import expo.modules.splashscreen.singletons.SplashScreen;
import expo.modules.splashscreen.SplashScreenImageResizeMode;

public class MainActivity extends ReactActivity {

    // Added automatically by Expo Config
    @Override
    public void onConfigurationChanged(Configuration newConfig) {
        super.onConfigurationChanged(newConfig);
        Intent intent = new Intent("onConfigurationChanged");
        intent.putExtra("newConfig", newConfig);
        sendBroadcast(intent);
    }

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    // Set the theme to AppTheme BEFORE onCreate to support 
    // coloring the background, status bar, and navigation bar.
    // This is required for expo-splash-screen.
    setTheme(R.style.AppTheme);
    super.onCreate(null);
// @generated begin expo-splash-screen-mainActivity-onCreate-show-splash - expo prebuild (DO NOT MODIFY) sync-ac77211afc0d4d694d8aa502d057bd234773c363
    SplashScreen.show(this, SplashScreenImageResizeMode.COVER, ReactRootView.class, false);
// @generated end expo-splash-screen-mainActivity-onCreate-show-splash
    // SplashScreen.show(...) has to be called after super.onCreate(...)
    // Below line is handled by '@expo/configure-splash-screen' command and it's discouraged to modify it manually

      //CUSTOM NOTIFICATON

      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
          NotificationChannel notificationChannel = new NotificationChannel("None", "GoalMogul", NotificationManager.IMPORTANCE_HIGH);
          notificationChannel.setShowBadge(true);
          notificationChannel.setDescription("");
          notificationChannel.setSound(null, null);
          notificationChannel.enableVibration(true);
          notificationChannel.setVibrationPattern(new long[]{400, 400});
          notificationChannel.setLockscreenVisibility(NotificationCompat.VISIBILITY_PUBLIC);
          NotificationManager manager = getSystemService(NotificationManager.class);
          manager.createNotificationChannel(notificationChannel);
      }

      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
          NotificationChannel notificationChannel = new NotificationChannel("Default", "GoalMogul", NotificationManager.IMPORTANCE_HIGH);
          notificationChannel.setShowBadge(true);
          notificationChannel.setDescription("");
          AudioAttributes att = new AudioAttributes.Builder()
                  .setUsage(AudioAttributes.USAGE_NOTIFICATION)
                  .setContentType(AudioAttributes.CONTENT_TYPE_SPEECH)
                  .build();
          Uri notification = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION);
          notificationChannel.setSound(notification, att);
          notificationChannel.enableVibration(true);
          notificationChannel.setVibrationPattern(new long[]{400, 400});
          notificationChannel.setLockscreenVisibility(NotificationCompat.VISIBILITY_PUBLIC);
          NotificationManager manager = getSystemService(NotificationManager.class);
          manager.createNotificationChannel(notificationChannel);
      }

      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
          NotificationChannel notificationChannel = new NotificationChannel("Alert", "GoalMogul", NotificationManager.IMPORTANCE_HIGH);
          notificationChannel.setShowBadge(true);
          notificationChannel.setDescription("");
          AudioAttributes att = new AudioAttributes.Builder()
                  .setUsage(AudioAttributes.USAGE_NOTIFICATION)
                  .setContentType(AudioAttributes.CONTENT_TYPE_SPEECH)
                  .build();
          notificationChannel.setSound(Uri.parse(ContentResolver.SCHEME_ANDROID_RESOURCE + "://" + getPackageName() + "/raw/alert"), att);
          notificationChannel.enableVibration(true);
          notificationChannel.setVibrationPattern(new long[]{400, 400});
          notificationChannel.setLockscreenVisibility(NotificationCompat.VISIBILITY_PUBLIC);
          NotificationManager manager = getSystemService(NotificationManager.class);
          manager.createNotificationChannel(notificationChannel);
      }

      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
          NotificationChannel notificationChannel = new NotificationChannel("Announcement", "GoalMogul", NotificationManager.IMPORTANCE_HIGH);
          notificationChannel.setShowBadge(true);
          notificationChannel.setDescription("");
          AudioAttributes att = new AudioAttributes.Builder()
                  .setUsage(AudioAttributes.USAGE_NOTIFICATION)
                  .setContentType(AudioAttributes.CONTENT_TYPE_SPEECH)
                  .build();
          notificationChannel.setSound(Uri.parse(ContentResolver.SCHEME_ANDROID_RESOURCE + "://" + getPackageName() + "/raw/announcement"), att);
          notificationChannel.enableVibration(true);
          notificationChannel.setVibrationPattern(new long[]{400, 400});
          notificationChannel.setLockscreenVisibility(NotificationCompat.VISIBILITY_PUBLIC);
          NotificationManager manager = getSystemService(NotificationManager.class);
          manager.createNotificationChannel(notificationChannel);
      }
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
          NotificationChannel notificationChannel = new NotificationChannel("Count", "GoalMogul", NotificationManager.IMPORTANCE_HIGH);
          notificationChannel.setShowBadge(true);
          notificationChannel.setDescription("");
          AudioAttributes att = new AudioAttributes.Builder()
                  .setUsage(AudioAttributes.USAGE_NOTIFICATION)
                  .setContentType(AudioAttributes.CONTENT_TYPE_SPEECH)
                  .build();
          notificationChannel.setSound(Uri.parse(ContentResolver.SCHEME_ANDROID_RESOURCE + "://" + getPackageName() + "/raw/count"), att);
          notificationChannel.enableVibration(true);
          notificationChannel.setVibrationPattern(new long[]{400, 400});
          notificationChannel.setLockscreenVisibility(NotificationCompat.VISIBILITY_PUBLIC);
          NotificationManager manager = getSystemService(NotificationManager.class);
          manager.createNotificationChannel(notificationChannel);
      }
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
          NotificationChannel notificationChannel = new NotificationChannel("Gong", "GoalMogul", NotificationManager.IMPORTANCE_HIGH);
          notificationChannel.setShowBadge(true);
          notificationChannel.setDescription("");
          AudioAttributes att = new AudioAttributes.Builder()
                  .setUsage(AudioAttributes.USAGE_NOTIFICATION)
                  .setContentType(AudioAttributes.CONTENT_TYPE_SPEECH)
                  .build();
          notificationChannel.setSound(Uri.parse(ContentResolver.SCHEME_ANDROID_RESOURCE + "://" + getPackageName() + "/raw/gong"), att);
          notificationChannel.enableVibration(true);
          notificationChannel.setVibrationPattern(new long[]{400, 400});
          notificationChannel.setLockscreenVisibility(NotificationCompat.VISIBILITY_PUBLIC);
          NotificationManager manager = getSystemService(NotificationManager.class);
          manager.createNotificationChannel(notificationChannel);
      }
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
          NotificationChannel notificationChannel = new NotificationChannel("Old-Phone", "GoalMogul", NotificationManager.IMPORTANCE_HIGH);
          notificationChannel.setShowBadge(true);
          notificationChannel.setDescription("");
          AudioAttributes att = new AudioAttributes.Builder()
                  .setUsage(AudioAttributes.USAGE_NOTIFICATION)
                  .setContentType(AudioAttributes.CONTENT_TYPE_SPEECH)
                  .build();
          notificationChannel.setSound(Uri.parse(ContentResolver.SCHEME_ANDROID_RESOURCE + "://" + getPackageName() + "/raw/old_phone"), att);
          notificationChannel.enableVibration(true);
          notificationChannel.setVibrationPattern(new long[]{400, 400});
          notificationChannel.setLockscreenVisibility(NotificationCompat.VISIBILITY_PUBLIC);
          NotificationManager manager = getSystemService(NotificationManager.class);
          manager.createNotificationChannel(notificationChannel);
      }
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
          NotificationChannel notificationChannel = new NotificationChannel("Ping", "GoalMogul", NotificationManager.IMPORTANCE_HIGH);
          notificationChannel.setShowBadge(true);
          notificationChannel.setDescription("");
          AudioAttributes att = new AudioAttributes.Builder()
                  .setUsage(AudioAttributes.USAGE_NOTIFICATION)
                  .setContentType(AudioAttributes.CONTENT_TYPE_SPEECH)
                  .build();
          notificationChannel.setSound(Uri.parse(ContentResolver.SCHEME_ANDROID_RESOURCE + "://" + getPackageName() + "/raw/ping"), att);
          notificationChannel.enableVibration(true);
          notificationChannel.setVibrationPattern(new long[]{400, 400});
          notificationChannel.setLockscreenVisibility(NotificationCompat.VISIBILITY_PUBLIC);
          NotificationManager manager = getSystemService(NotificationManager.class);
          manager.createNotificationChannel(notificationChannel);
      }
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
          NotificationChannel notificationChannel = new NotificationChannel("Prompt", "GoalMogul", NotificationManager.IMPORTANCE_HIGH);
          notificationChannel.setShowBadge(true);
          notificationChannel.setDescription("");
          AudioAttributes att = new AudioAttributes.Builder()
                  .setUsage(AudioAttributes.USAGE_NOTIFICATION)
                  .setContentType(AudioAttributes.CONTENT_TYPE_SPEECH)
                  .build();
          notificationChannel.setSound(Uri.parse(ContentResolver.SCHEME_ANDROID_RESOURCE + "://" + getPackageName() + "/raw/prompt"), att);
          notificationChannel.enableVibration(true);
          notificationChannel.setVibrationPattern(new long[]{400, 400});
          notificationChannel.setLockscreenVisibility(NotificationCompat.VISIBILITY_PUBLIC);
          NotificationManager manager = getSystemService(NotificationManager.class);
          manager.createNotificationChannel(notificationChannel);
      }
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
          NotificationChannel notificationChannel = new NotificationChannel("Uh-oh", "GoalMogul", NotificationManager.IMPORTANCE_HIGH);
          notificationChannel.setShowBadge(true);
          notificationChannel.setDescription("");
          AudioAttributes att = new AudioAttributes.Builder()
                  .setUsage(AudioAttributes.USAGE_NOTIFICATION)
                  .setContentType(AudioAttributes.CONTENT_TYPE_SPEECH)
                  .build();
          notificationChannel.setSound(Uri.parse(ContentResolver.SCHEME_ANDROID_RESOURCE + "://" + getPackageName() + "/raw/uh_oh"), att);
          notificationChannel.enableVibration(true);
          notificationChannel.setVibrationPattern(new long[]{400, 400});
          notificationChannel.setLockscreenVisibility(NotificationCompat.VISIBILITY_PUBLIC);
          NotificationManager manager = getSystemService(NotificationManager.class);
          manager.createNotificationChannel(notificationChannel);
      }
  }


    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "main";
    }

    @Override
    protected ReactActivityDelegate createReactActivityDelegate() {
        return new ReactActivityDelegate(this, getMainComponentName()) {
            @Override
            protected ReactRootView createRootView() {
                return new RNGestureHandlerEnabledRootView(MainActivity.this);
            }
        };
    }
}
