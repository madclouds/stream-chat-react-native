/*!
 * RNChartEditViewController.m
 * Services
 *
 * Copyright (c) 2018 Ministry Centered Technology
 *
 * Created by Erik Bye on 5/8/18
 */

#import "RNViewController.h"
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#if RCT_DEV
#import <React/RCTDevLoadingView.h>
#endif

@interface RNViewController ()

@end

@implementation RNViewController

- (instancetype)init {
    self = [super initWithNibName:nil bundle:nil];
    if (self) {
      NSURL *jsCodeLocation;
#if DEBUG
      jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
      jsCodeLocation = [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
      RCTBridge *bridge = [[RCTBridge alloc] initWithBundleURL:jsCodeLocation moduleProvider:nil launchOptions:nil];
#if RCT_DEV
      [bridge moduleForClass:[RCTDevLoadingView class]];
#endif
      RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:bridge moduleName:@"SampleApp" initialProperties:@{}];
      self.view = rootView;
    }
    return self;
}

@end

