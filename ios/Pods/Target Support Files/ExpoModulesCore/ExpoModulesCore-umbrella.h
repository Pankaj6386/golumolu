#ifdef __OBJC__
#import <UIKit/UIKit.h>
#else
#ifndef FOUNDATION_EXPORT
#if defined(__cplusplus)
#define FOUNDATION_EXPORT extern "C"
#else
#define FOUNDATION_EXPORT extern
#endif
#endif
#endif

#import "EXBarcodeScannerInterface.h"
#import "EXBarcodeScannerProviderInterface.h"
#import "EXCameraInterface.h"
#import "EXConstantsInterface.h"
#import "EXFaceDetectorManagerInterface.h"
#import "EXFaceDetectorManagerProviderInterface.h"
#import "EXFilePermissionModuleInterface.h"
#import "EXFileSystemInterface.h"
#import "EXFontManagerInterface.h"
#import "EXFontProcessorInterface.h"
#import "EXFontScalerInterface.h"
#import "EXFontScalersManagerInterface.h"
#import "EXImageLoaderInterface.h"
#import "EXPermissionsInterface.h"
#import "EXPermissionsMethodsDelegate.h"
#import "EXUserNotificationCenterProxyInterface.h"
#import "EXAccelerometerInterface.h"
#import "EXBarometerInterface.h"
#import "EXDeviceMotionInterface.h"
#import "EXGyroscopeInterface.h"
#import "EXMagnetometerInterface.h"
#import "EXMagnetometerUncalibratedInterface.h"
#import "EXTaskConsumerInterface.h"
#import "EXTaskInterface.h"
#import "EXTaskLaunchReason.h"
#import "EXTaskManagerInterface.h"
#import "EXTaskServiceInterface.h"

FOUNDATION_EXPORT double ExpoModulesCoreVersionNumber;
FOUNDATION_EXPORT const unsigned char ExpoModulesCoreVersionString[];

