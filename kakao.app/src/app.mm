/*
   0000000   00000000   00000000   
  000   000  000   000  000   000  
  000000000  00000000   00000000   
  000   000  000        000        
  000   000  000        000        
*/

#import "app.h"
#import "bundle.h"
#import "watch.h"

@interface App ()

@property (readwrite,retain) Watch* watch;

@end

@implementation App

//@synthesize snapshotFolder;
//@synthesize snapshotFile;
//@synthesize watch;

+ (id) new
{
    //freopen([[Bundle appPath:@"log.txt"] cStringUsingEncoding:NSASCIIStringEncoding],"a+",stderr);
        
    App* app = [[App alloc] init];
    [app setIcon:[Bundle resourcePath:@"img/app.icns"]];
    
    app.snapshotFolder = @"~/Desktop";
    app.snapshotFile   = @"kakao";
    app.watch = [Watch path:[Bundle path] delegate:app];
    
    id nsApp = [NSApplication sharedApplication];
    [nsApp setDelegate:app];
    [nsApp setActivationPolicy:NSApplicationActivationPolicyRegular];
    [nsApp activateIgnoringOtherApps:YES];
    
    id win = [Win withURL:[Bundle jsURL:@"index.html"]];
        
    return app;
}

- (void) dealloc
{
    [self.watch release];
    [super dealloc];
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

- (void)watch:(Watch*)watch detectedChange:(FSChange*)change
{
    NSLog(@"%d %@", change.foldersChanged, change.changedFiles);
}

- (void)applicationWillFinishLaunching:(NSNotification *)notification { }
- (void)applicationDidFinishLaunching:(NSNotification *)notification { }
- (void)applicationWillBecomeActive:(NSNotification *)notification { }

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