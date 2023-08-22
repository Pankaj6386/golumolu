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

#import "MoEngageInitializer.h"
#import "MoEngageReactConstants.h"
#import "MoEngageReactPluginInfo.h"
#import "MoEReactBridge.h"

FOUNDATION_EXPORT double ReactNativeMoEngageVersionNumber;
FOUNDATION_EXPORT const unsigned char ReactNativeMoEngageVersionString[];

