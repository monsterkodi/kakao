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

+ (App*) get
{
    return (App*)[[NSApplication sharedApplication] delegate];
}

- (void) dealloc
{
    [self.watch release];
    [super dealloc];
}

- (void) run
{    
    [[NSApplication sharedApplication] run]; // does not return
}

- (NSArray*) wins
{
    NSMutableArray* wins = [NSMutableArray array];
    id app = [NSApplication sharedApplication];
    for (id win in [app windows]) 
    {
        if ([win isKindOfClass:[Win class]])
        {
            [wins addObject:win];
        }
    }
    return wins;   
}

- (void) reload
{
    for (Win* win in [self wins]) 
    {
        [win reload];
    }
}

- (void) onChanges:(NSArray*)changes inFolder:(NSString*)folder
{
    // NSLog(@"● changes %@ ▸▸▸", folder);
    
    BOOL reloadPage  = NO;
    BOOL rebuildApp  = NO;
    
    NSMutableArray* filesToTranspile = [NSMutableArray array];
    
    for (WatchChange* change in changes)
    {
        id type;
        switch (change.type)
        {
            case 0: type = @"deleted"; break;
            case 1: type = @"created"; break;
            case 2: type = @"changed"; break;
        }
        // NSLog(@"%@ %@ %@ ", change.isDir ? @"▸" : @"▪", type, change.path);
        
        if ([change.path hasPrefix:@"js/"]) { reloadPage = YES; }

        if ([change.path hasPrefix:@"Contents/Resources/"]) { reloadPage = YES; }

        if ([change.path hasPrefix:@"src/"] || [change.path isEqualToString:@"Contents/Info.plist"])
        {
            rebuildApp = YES;
        }
        
        if ([change.path hasPrefix:@"pug/"] || [change.path hasPrefix:@"kode/"])
        {
            [filesToTranspile addObject:[NSString stringWithFormat:@"%@/%@", folder, change.path]];
        }
    }
    
    if (rebuildApp)
    {
        NSLog(@"rebuild!");
    }
    else if ([filesToTranspile count])
    {
        static BOOL isTranspiling = NO;
        
        if (isTranspiling)
        {
            // NSLog(@"already transpiling!");
            return;
        }
        
        isTranspiling = YES;
        
        // NSLog(@"transpile! %@", filesToTranspile);
        
        NSTask *task = [[NSTask alloc] init];

        [task setLaunchPath:@"/usr/bin/env"];

        NSMutableArray* arguments = [NSMutableArray array];
        [arguments addObject:@"node"];
        [arguments addObject:@"--experimental-detect-module"];
        [arguments addObject:[Bundle appPath:@"kk"]];
        [arguments addObject:@"-k"];
        [arguments addObjectsFromArray:filesToTranspile];
        
        [task setArguments:arguments];
        
        // hides the output:
        // NSPipe *outputPipe = [NSPipe pipe]; 
        // [task setStandardOutput:outputPipe];

        [task launch];
        [task waitUntilExit];
        isTranspiling = NO;
        if ([task terminationStatus]) NSLog(@"transpile failed? %d", [task terminationStatus]);
        [task release];
        filesToTranspile = nil;
        // NSLog(@"reload");
        [self reload];
    }
    else if (reloadPage)
    {
        // NSLog(@"reload!");
        [self reload];
    }
}

//- (void) applicationWillFinishLaunching:(NSNotification *)notification { }
//- (void) applicationDidFinishLaunching:(NSNotification *)notification { }
//- (void) applicationWillBecomeActive:(NSNotification *)notification { }

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