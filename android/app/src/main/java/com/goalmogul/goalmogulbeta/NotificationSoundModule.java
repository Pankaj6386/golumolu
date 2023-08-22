package com.goalmogul.goalmogulbeta;

import android.media.AudioAttributes;
import android.media.Ringtone;
import android.media.RingtoneManager;
import android.net.Uri;
import android.util.Log;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class NotificationSoundModule extends ReactContextBaseJavaModule {
    private final Ringtone r;

    NotificationSoundModule(ReactApplicationContext context) {
        super(context);
        Uri notification = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION);
        this.r = RingtoneManager.getRingtone(context, notification);
        this.r.setAudioAttributes(new AudioAttributes.Builder()
                .setUsage(AudioAttributes.USAGE_ALARM)
                .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
                .setFlags(AudioAttributes.FLAG_AUDIBILITY_ENFORCED)
                .build());
    }

    @Override
    public String getName() {
        return "NotificationSoundModule";
    }

    @ReactMethod
    public void playDefaultNotificationSound() {
        Log.d("NotificationSoundModule", "Create event called with name: ");
        try {
            if(this.r.isPlaying()){
                this.r.stop();
            }
            this.r.play();
        } catch (Exception e) {
            Log.e("ERROR_NOTIFICATION", String.valueOf(e));
        }
    }
}