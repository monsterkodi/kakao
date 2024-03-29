/*
   0000000   00000000   00000000   
  000   000  000   000  000   000  
  000000000  00000000   00000000   
  000   000  000        000        
  000   000  000        000        
*/

#import "fs.h"
#import "app.h"
#import "bundle.h"
#import "watch.h"
#import "route.h"

#define OK 0

@interface App ()

@property (readwrite,retain) Watch* watch;
@property (readwrite,retain) Watch* watchHome;

+ (void) moveStashWins;

@end

@implementation App

// 000  000   000  0000000    00000000  000   000
// 000  0000  000  000   000  000        000 000 
// 000  000 0 000  000   000  0000000     00000  
// 000  000  0000  000   000  000        000 000 
// 000  000   000  0000000    00000000  000   000

+ (id) new:(NSString*)indexFile
{
    //freopen([[Bundle appPath:@"log.txt"] cStringUsingEncoding:NSASCIIStringEncoding],"a+",stderr);
    
    [App moveStashWins];
        
    App* app = [[App alloc] init];
    [app setIcon:[Bundle resourcePath:@"img/app.icns"]];
    
    app.snapshotFolder = @"~/Desktop";
    app.snapshotFile   = @"kakao";
    app.watch = [Watch path:[Bundle path] delegate:app];
    app.watchHome = [Watch path:[FS homeDir] delegate:app];
    
    id nsApp = [NSApplication sharedApplication];
    [nsApp setDelegate:app];
    [nsApp setActivationPolicy:NSApplicationActivationPolicyRegular];
    [nsApp activateIgnoringOtherApps:YES];
    
    NSMutableString* indexHTML = [NSMutableString stringWithString:indexFile];
    if (![indexHTML length])
    {
        indexHTML = [NSMutableString stringWithString:@"index.html"];
    }
    if (![indexHTML hasSuffix:@".html"])
    {
        [indexHTML appendString:@".html"];
    }
    // NSLog(@"indexFile: %@", indexFile);
    id indexURL = [Bundle jsURL:indexHTML];
    id win = [Win withURL:indexURL script:nil];
        
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

// 000   000  000  000   000   0000000  
// 000 0 000  000  0000  000  000       
// 000000000  000  000 0 000  0000000   
// 000   000  000  000  0000       000  
// 00     00  000  000   000  0000000   

+ (NSArray*) wins { return [[App get] wins]; }
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

+ (void) moveStashWins
{
    id error;
    id path = [Bundle appPath:@".stash/win"];
    id dest = [Bundle appPath:@".stash/old"];
    
    id FM = [NSFileManager defaultManager];
    [FM removeItemAtPath:dest error:&error];
    if (![FM fileExistsAtPath:path])
    {
        [FM createDirectoryAtPath:path withIntermediateDirectories:YES attributes:nil error:&error];
        return;
    }
    if ([FM moveItemAtPath:path toPath:dest error:&error])
    {
        [FM createDirectoryAtPath:path withIntermediateDirectories:YES attributes:nil error:&error];
    }
}

// 00000000   00000000  000       0000000    0000000   0000000    
// 000   000  000       000      000   000  000   000  000   000  
// 0000000    0000000   000      000   000  000000000  000   000  
// 000   000  000       000      000   000  000   000  000   000  
// 000   000  00000000  0000000   0000000   000   000  0000000    

- (void) reload
{
    for (Win* win in [self wins]) 
    {
        [win reload];
    }
}

//  0000000   000   000      0000000  000   000   0000000   000   000   0000000   00000000   0000000  
// 000   000  0000  000     000       000   000  000   000  0000  000  000        000       000       
// 000   000  000 0 000     000       000000000  000000000  000 0 000  000  0000  0000000   0000000   
// 000   000  000  0000     000       000   000  000   000  000  0000  000   000  000            000  
//  0000000   000   000      0000000  000   000  000   000  000   000   0000000   00000000  0000000   

- (void) onChanges:(NSArray*)changes inFolder:(NSString*)folder
{    
    if ([folder isEqualToString:[FS homeDir]])
    {
        // NSLog(@"● change ▸▸▸ %@", folder);
        for (WatchChange* change in changes)
        {
            id type;
            switch (change.type)
            {
                case 0: type = @"deleted"; break;
                case 1: type = @"created"; break;
                case 2: type = @"changed"; break;
            }
            NSLog(@"%@ %@ %@ ", change.isDir ? @"▸" : @"▪", type, change.path);
            
            id msg = [NSMutableDictionary dictionary];
            id args = [NSMutableArray array];
            [args addObject:type];
            [args addObject:change.path];
            [msg setObject:@"fs.change" forKey:@"name"];
            [msg setObject:args forKey:@"args"];
            
            [Route emit:msg];
        }
        
        return;
    }
    
    BOOL reloadPage = NO;
    BOOL rebuildApp = NO;
    
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
        
        NSString* relPath = [change.path substringFromIndex:[folder length]+1];
        
        // NSLog(@"%@ %@ %@ %@", change.isDir ? @"▸" : @"▪", type, change.path, relPath);
        
        if ([relPath hasPrefix:@"js/"]) { reloadPage = YES; }

        if ([relPath hasPrefix:@"Contents/Resources/"]) { reloadPage = YES; }

        if ([relPath hasPrefix:@"src/"] || [relPath isEqualToString:@"Contents/Info.plist"])
        {
            rebuildApp = YES;
        }
        
        if ([relPath hasPrefix:@"pug/"] || [relPath hasPrefix:@"kode/"])
        {
            [filesToTranspile addObject:change.path];
        }
    }
    
    if (rebuildApp)
    {
        static BOOL isCompiling = NO;
        
        if (isCompiling) { return; }
        
        int exitCode = [self kk:@"-b"];
        
        isCompiling = NO;
        
        if (exitCode == OK)
        {
            // todo: check if application binary actually changed before relaunching the application
        
            NSTask *task = [[NSTask alloc] init];
        
            [task setLaunchPath:[Bundle appPath:@"Contents/MacOS/kakao"]];
        
            [task launch];
            [[NSApplication sharedApplication] terminate:0];            
        }
        else
        {
            [Route emit:@"buildFailed"];
        }
    }
    else if ([filesToTranspile count])
    {
        static BOOL isTranspiling = NO;
        
        if (isTranspiling) { return; }
        
        isTranspiling = YES;
        
        [self kk:@"-k" args:filesToTranspile];
                        
        isTranspiling = NO;
        
        // NSLog(@"transpile %@", [changes componentsJoinedByString:@" "]);
        
        filesToTranspile = nil;
        [self reload];
    }
    else if (reloadPage)
    {
        // NSLog(@"reload %@", [changes componentsJoinedByString:@" "]);
        [self reload];
    }
}

// 00000000  000   000  00000000   0000000  000   000  000000000  00000000  
// 000        000 000   000       000       000   000     000     000       
// 0000000     00000    0000000   000       000   000     000     0000000   
// 000        000 000   000       000       000   000     000     000       
// 00000000  000   000  00000000   0000000   0000000      000     00000000  

- (int) kk:(NSString*)command { return [self kk:command args:nil]; }
- (int) kk:(NSString*)command args:(NSArray*)args
{
    NSMutableArray* arr = [NSMutableArray array];
    [arr addObject:command];
    if (args) [arr addObjectsFromArray:args];
    
    return [self executeNodeScript:[Bundle appPath:@"kk"] args:arr];
}

- (int) executeNodeScript:(NSString*)scriptPath args:(NSArray*)args
{
    NSTask *task = [[NSTask alloc] init];

    [task setLaunchPath:@"/usr/bin/env"];

    NSMutableArray* arguments = [NSMutableArray array];
    [arguments addObject:@"node"];
    [arguments addObject:@"--experimental-detect-module"];
    [arguments addObject:scriptPath];
    [arguments addObjectsFromArray:args];
    
    NSLog(@"execute %@ %@", scriptPath, [arguments componentsJoinedByString:@" "]);
    
    [task setArguments:arguments];
    
    [task launch];
    [task waitUntilExit];
    
    int exitCode = [task terminationStatus];
    
    [task autorelease];
    
    return exitCode;
}

- (NSString*) executeShellScript:(NSArray*)args
{
    NSLog(@"executeShellScript %@", args);
    
    NSTask *task = [[NSTask alloc] init];

    [task setLaunchPath:[args objectAtIndex:0]];

    // NSLog(@"execute %@", [args componentsJoinedByString:@" "]);
    
    if ([[args objectAtIndex:1] isKindOfClass:[NSDictionary class]])
    {
        NSDictionary* dict = (NSDictionary*)[args objectAtIndex:1];
        NSLog(@"dict: %@", dict);
        if ([dict objectForKey:@"args"])
        {
            [task setArguments:[dict objectForKey:@"args"]];
        }
        else if ([dict objectForKey:@"arg"])
        {
            [task setArguments:[[dict objectForKey:@"arg"] componentsSeparatedByString:@" "]];
        }
        
        if ([dict objectForKey:@"cwd"])
        {
            task.currentDirectoryURL = [NSURL fileURLWithPath:[dict objectForKey:@"cwd"]];
        }
    }
    else
    {
        NSRange range; range.location = 1; range.length = [args count]-1;
        [task setArguments:[args subarrayWithRange:range]];
    }
    
    NSPipe *outputPipe = [NSPipe pipe]; 
    [task setStandardOutput:outputPipe];

    [task launch];
    [task waitUntilExit];
    
    int exitCode = [task terminationStatus];
    
    NSFileHandle * readFileHandle = [outputPipe fileHandleForReading];
    NSData * data = [readFileHandle readDataToEndOfFile];
    NSString * outString = [[[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding] autorelease];
    
    [task autorelease];
    
    // NSLog(@"script output: '%@'", outString);
    
    return outString;
}

// 000000000  00000000  00000000   00     00  000  000   000   0000000   000000000  00000000  
//    000     000       000   000  000   000  000  0000  000  000   000     000     000       
//    000     0000000   0000000    000000000  000  000 0 000  000000000     000     0000000   
//    000     000       000   000  000 0 000  000  000  0000  000   000     000     000       
//    000     00000000  000   000  000   000  000  000   000  000   000     000     00000000  

-(NSApplicationTerminateReply) applicationShouldTerminate:(NSApplication*)sender
{
    // NSLog(@"terminate %@", sender);
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