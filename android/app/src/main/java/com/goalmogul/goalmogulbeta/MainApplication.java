
package com.goalmogul.goalmogulbeta;

import android.app.Application;
import android.content.Context;
import android.net.Uri;

import com.microsoft.codepush.react.CodePush;
import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;
import com.airbnb.android.react.lottie.LottiePackage;
import ca.jaysoo.extradimensions.ExtraDimensionsPackage;
import com.rnfingerprint.FingerprintAuthPackage;
import com.reactnativecompressor.CompressorPackage;
import com.horcrux.svg.SvgPackage;
import com.brentvatne.react.ReactVideoPackage;
import com.moengage.react.MoEReactPackage;
import com.moengage.react.MoEReactPackage;
import com.moengage.react.MoEReactPackage;
import com.masteratul.RNAppstoreVersionCheckerPackage;
import com.moengage.react.MoEReactPackage;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.goalmogul.goalmogulbeta.generated.BasePackageList;
import com.moe.pushlibrary.MoEHelper;
import com.moengage.core.MoEngage;
import com.moengage.react.MoEInitializer;
// import com.moengage.core.LogLevel;
// import com.moengage.core.config.GeofenceConfig;
import com.moengage.core.config.FcmConfig;
// import com.moengage.core.config.LogConfig;
import com.moengage.core.config.NotificationConfig;
// import com.moengage.core.internal.logger.Logger;
// import com.moengage.core.model.IntegrationPartner;
import com.moengage.firebase.MoEFireBaseHelper;
// import com.moengage.pushbase.MoEPushHelper;
// import com.segment.analytics.Analytics;
// import com.segment.analytics.android.integrations.moengage.MoEngageIntegration;
import org.unimodules.adapters.react.ReactAdapterPackage;
import org.unimodules.adapters.react.ModuleRegistryAdapter;
import org.unimodules.adapters.react.ReactModuleRegistryProvider;
import org.unimodules.core.interfaces.Package;
import org.unimodules.core.interfaces.SingletonModule;
import expo.modules.updates.UpdatesController;

import com.facebook.react.bridge.JSIModulePackage;
// import com.swmansion.reanimated.ReanimatedJSIModulePackage;

import java.lang.reflect.InvocationTargetException;
import java.util.Arrays;
import java.util.List;
import javax.annotation.Nullable;


public class MainApplication extends Application implements ReactApplication {
  private final ReactModuleRegistryProvider mModuleRegistryProvider = new ReactModuleRegistryProvider(
    new BasePackageList().getPackageList()
  );

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {

    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }
    @Override
    protected List<ReactPackage> getPackages() {
      List<ReactPackage> packages = new PackageList(this).getPackages();
      packages.add(new ModuleRegistryAdapter(mModuleRegistryProvider));
      packages.add(new MyAppPackage());
//      packages.add(new MainReactPackage(),
            new LottiePackage();
            new ExtraDimensionsPackage();
            new FingerprintAuthPackage();
            new CompressorPackage();
            new SvgPackage();
            new ReactVideoPackage();
            // new MoEReactPackage(),
        // ;
      //       new RNAppstoreVersionCheckerPackage();
    //  packages.add(new MoEReactPackage());
      return packages;
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }

  //  @Override
  //  protected JSIModulePackage getJSIModulePackage() {
  //    return new ReanimatedJSIModulePackage();
  //  }

    @Override
        protected String getJSBundleFile() {
            return CodePush.getJSBundleFile();
        }

    @Override
    protected @Nullable String getBundleAssetName() {
      if (BuildConfig.DEBUG) {
        return super.getBundleAssetName();
      } else {
        return UpdatesController.getInstance().getBundleAssetName();
      }
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
     SoLoader.init(this, /* native exopackage */ false);
   MoEngage moEngage = new MoEngage.Builder(this, "F95F79AU76R3W1GGQQZEE2OT")
            .configureNotificationMetaData(new NotificationConfig(R.drawable.notification_icon,R.color.colorPrimary))
            .build();
    MoEngage.initialiseDefaultInstance(moEngage);









      //     .configureNotificationMetaData(NotificationConfig(R.drawable.small_icon, R.drawable.large_icon, R.color.notiColor, null, true, isBuildingBackStackEnabled = false, isLargeIconDisplayEnabled = true))
        // .configureFcm(FcmConfig(false))
         
    // Analytics.setSingletonInstance(analytics);
    // MoEngage.initialise(moEngage);
//     MoEngage moEngage =
//         new MoEngage.Builder(this, "XXXXXXXXXX")
//             .configureNotificationMetaData(new NotificationConfig(R.drawable.small_icon, R.drawable.large_icon))
//             .enablePartnerIntegration(IntegrationPartner.SEGMENT)
//             .build();
// MoEngage.initialiseDefaultInstance(moEngage);

// Analytics analytics = new Analytics.Builder(this, "Us6yuw9KLihsRmpihcB5OXTYwT4GDq75")
//                 .use(MoEngageIntegration.FACTORY)
//                 .build();


 
    // Analytics analytics = new Analytics.Builder(this, "Us6yuw9KLihsRmpihcB5OXTYwT4GDq75")
    //   .use(MoEngageIntegration.FACTORY).trackDeepLinks()
    //   .build();
    // .configureNotificationMetaData(NotificationConfig(R.drawable.small_icon, R.drawable.large_icon, R.color.notiColor, null, true, isBuildingBackStackEnabled = false, isLargeIconDisplayEnabled = true))

            // .enablePartnerIntegration(IntegrationPartner.SEGMENT).configureNotificationMetaData(new NotificationConfig(R.drawable.notification_icon, R.drawable.notification_icon, R.color.colorPrimary, "sound", true, true, true))

        //     .configureNotificationMetaData(NotificationConfig(R.drawable.small_icon, R.drawable.large_icon, R.color.notiColor, null, true, isBuildingBackStackEnabled = false, isLargeIconDisplayEnabled = true))
        // .configureFcm(FcmConfig(false))
            // .build();
    // MoEngage.initialise(moEngage);

    if (!BuildConfig.DEBUG) {
      UpdatesController.initialize(this);
    }

    initializeFlipper(this, getReactNativeHost().getReactInstanceManager());
  }

  
  /**
   * Loads Flipper in React Native templates. Call this in the onCreate method with something like
   * initializeFlipper(this, getReactNativeHost().getReactInstanceManager());
   *
   * @param context
   * @param reactInstanceManager
   */
  private static void initializeFlipper(
      Context context, ReactInstanceManager reactInstanceManager) {
    if (BuildConfig.DEBUG) {
      try {
        /*
         We use reflection here to pick up the class that initializes Flipper,
        since Flipper library is not available in release mode
        */
        Class<?> aClass = Class.forName("com.goalmogul.goalmogulbeta.ReactNativeFlipper");
        aClass
            .getMethod("initializeFlipper", Context.class, ReactInstanceManager.class)
            .invoke(null, context, reactInstanceManager);
      } catch (ClassNotFoundException e) {
        e.printStackTrace();
      } catch (NoSuchMethodException e) {
        e.printStackTrace();
      } catch (IllegalAccessException e) {
        e.printStackTrace();
      } catch (InvocationTargetException e) {
        e.printStackTrace();
      }
    }
  }
}
