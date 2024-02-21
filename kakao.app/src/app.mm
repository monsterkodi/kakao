/*
   0000000   00000000   00000000   
  000   000  000   000  000   000  
  000000000  00000000   00000000   
  000   000  000        000        
  000   000  000        000        
*/

#import "app.h"
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
    
    id win = [Win withURL:[Bundle jsURL:@"index.html"]];
        
    return delegate;
}

- (Win*) win
{
    id app = [NSApplication sharedApplication];
    for (id window in [app windows]) 
    {
        if ([window isKindOfClass:[Win class]])
        {
            return window;
        }
    }
    
    return (Win*)[app mainWindow];
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

-(NSApplicationTerminateReply) applicationShouldTerminate:(NSApplication*)sender
{
    NSLog(@"terminate %@", sender);
    return NSTerminateNow;
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