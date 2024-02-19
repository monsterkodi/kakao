/*
   0000000   00000000   00000000   
  000   000  000   000  000   000  
  000000000  00000000   00000000   
  000   000  000        000        
  000   000  000        000        
*/

#import "app.h"
#import "win.h"
#import "bundle.h"

@implementation App

@synthesize snapshotFolder;
@synthesize snapshotFile;

+ (id) new
{
    //freopen([[Bundle appPath:@"log.txt"] cStringUsingEncoding:NSASCIIStringEncoding],"a+",stderr);
        
    App* delegate = [[App alloc] init];
    [delegate setIcon:[Bundle resourcePath:@"img/app.icns"]];
    
    delegate.snapshotFolder = @"~/Desktop";
    delegate.snapshotFile   = @"kakao";
    
    id app = [NSApplication sharedApplication];
    [app setDelegate:delegate];
    [app setActivationPolicy:NSApplicationActivationPolicyRegular];
    [app activateIgnoringOtherApps:YES];
    
    id win = [Win new];
        
    return delegate;
}

- (void) run
{    
    [[NSApplication sharedApplication] run]; // does not return
}

- (void)applicationWillFinishLaunching:(NSNotification *)notification
{
    //NSLog(@"bundle url %@", [Bundle fileURLWithPath:@"./willFinish"]);
}

- (void)applicationDidFinishLaunching:(NSNotification *)notification
{
    //NSLog(@"bundle url %@", [Bundle fileURLWithPath:@"didFinish"]);
}

- (void)applicationWillBecomeActive:(NSNotification *)notification
{
    //NSLog(@"bundle url %@", [Bundle fileURLWithPath:@"/willBecomeActive"]);
}

-(BOOL) applicationShouldTerminateAfterLastWindowClosed:(NSApplication*)sender
{
    return YES;
}

-(void) setIcon:(NSString*) pngFilePath
{
    id icon = [[NSImage alloc] initWithContentsOfFile:pngFilePath];
    [[NSApplication sharedApplication] setApplicationIconImage:icon];
}

@end