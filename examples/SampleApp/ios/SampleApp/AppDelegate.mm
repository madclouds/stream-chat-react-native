#import "AppDelegate.h"
#import <Firebase.h>
#import <React/RCTBundleURLProvider.h>
#import "RNViewController.h"

@interface AppDelegate()

@property (nonatomic) UINavigationController *nav;
@end

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
  [FIRApp configure];
  self.window = [[UIWindow alloc] initWithFrame:[[UIScreen mainScreen] bounds]];
  UIViewController *viewController = [[UIViewController alloc] init];
  viewController.view.backgroundColor = [UIColor whiteColor];
  viewController.title = @"Services App";
  viewController.navigationItem.rightBarButtonItem = [[UIBarButtonItem alloc] initWithBarButtonSystemItem:UIBarButtonSystemItemAction target:self action:@selector(openChat)];
  self.nav = [[UINavigationController alloc] initWithRootViewController:viewController];
  [self.nav setNavigationBarHidden:NO];
  self.window.rootViewController = self.nav;
  [self.window makeKeyAndVisible];
  
  [self openChat];
  
  return YES;
}

- (void)openChat {
  [self.nav presentViewController:[[RNViewController alloc] init] animated:YES completion:nil];
}

@end
