/*
0000000    00000000  000      00000000   0000000    0000000   000000000  00000000  
000   000  000       000      000       000        000   000     000     000       
000   000  0000000   000      0000000   000  0000  000000000     000     0000000   
000   000  000       000      000       000   000  000   000     000     000       
0000000    00000000  0000000  00000000   0000000   000   000     000     00000000  
*/

#import "win.h"
#import "route.h"
#import "bundle.h"

@interface WinDelegate : NSObject <NSWindowDelegate> {}
@end

@implementation WinDelegate

- (void) windowDidBecomeKey:(NSNotification *)notification { [Route send:@"window.focus" win:(Win*)notification.object]; }
- (void) windowDidResignKey:(NSNotification *)notification { [Route send:@"window.blur"  win:(Win*)notification.object]; }
- (void) windowDidBecomeMain:(NSNotification *)notification { /*NSLog(@"window.main"); */ }
- (void) windowDidResignMain:(NSNotification *)notification { /*NSLog(@"window.resignmain"); */ }

- (BOOL) windowShouldZoom:(NSWindow*)window toFrame:(NSRect)frame
{
    NSDictionary* resize = [NSDictionary dictionaryWithObjectsAndKeys: 
        window, NSViewAnimationTargetKey, 
        [NSValue valueWithRect: frame], NSViewAnimationEndFrameKey, 
        nil];
        
    NSArray* animations = [NSArray arrayWithObject:resize];
    NSViewAnimation* animation = [[NSViewAnimation alloc] initWithViewAnimations: animations];
    
    if ([window isZoomed])
    {
        [Route emit:@"window.demaximizes"];
        [animation setAnimationCurve: NSAnimationEaseOut];
    }
    else
    {
        [Route emit:@"window.maximizes"];
        [animation setAnimationCurve: NSAnimationEaseIn];
    }
        
    [animation setAnimationBlockingMode: NSAnimationNonblocking];
    [animation setDuration: [window animationResizeTime:frame]];     
    [animation setFrameRate: 0];
    [animation startAnimation]; 
    
    return NO;
}

@end

/*
000   000  000  000   000  
000 0 000  000  0000  000  
000000000  000  000 0 000  
000   000  000  000  0000  
00     00  000  000   000  
*/

@implementation Win

+ (Win*) withURL:(NSURL*)url
{
    return [[Win alloc] initWithURL:url];
}

- (Win*) new:(NSString*)urlString
{
    NSURL* url;
    
    NSLog(@"Win new %@", urlString);
    
    if (!urlString) urlString = @"index.html";
    
    if ([urlString hasPrefix:@"http://"] || 
        [urlString hasPrefix:@"https://"] || 
        [urlString hasPrefix:@"file://"])
    {
        url = [NSURL urlWithString:urlString];
    }
    else
    {
        url = [Bundle jsURL:urlString];
    }
    
    NSLog(@"Win new %@", url);
    return [Win withURL:url];
}

// 000  000   000  000  000000000  
// 000  0000  000  000     000     
// 000  000 0 000  000     000     
// 000  000  0000  000     000     
// 000  000   000  000     000     

- (Win*) initWithURL:(NSURL*)url
{
    BOOL nativeTitleBar = NO;

    NSWindowStyleMask styleMask =     
        NSWindowStyleMaskTitled | 
        NSWindowStyleMaskMiniaturizable | 
        NSWindowStyleMaskClosable | 
        NSWindowStyleMaskResizable;
        
    if (!nativeTitleBar)
    {
        styleMask |= NSWindowStyleMaskFullSizeContentView;
    }

    self = [self initWithContentRect: CGRectMake(0, 0, 0, 0)
                 styleMask: styleMask
                 backing:   NSBackingStoreBuffered
                 defer:     YES];
                
    if (!self) { return nil; }
    
    [self setDelegate:[[WinDelegate alloc] init]];

    self.view = [[View alloc] init];
    
    if (!nativeTitleBar)
    {
        [self setOpaque:NO];
        [self setBackgroundColor:[NSColor clearColor]];
        
        self.titleVisibility = NSWindowTitleHidden;
        self.titlebarAppearsTransparent = YES;
        
        [self standardWindowButton:NSWindowCloseButton      ].hidden = YES;
        [self standardWindowButton:NSWindowMiniaturizeButton].hidden = YES;
        [self standardWindowButton:NSWindowZoomButton       ].hidden = YES;
    }
    
    [self setContentMinSize:CGSizeMake(200, 200)];
    [self setFrame:CGRectMake(0, 0, 400, 400) display:YES animate:NO];
    [self center];
    
    [self setContentView:self.view];
    [self makeKeyAndOrderFront:nil];
       
    [self navigateToURL:url];
    
	return self;
}

// 000   000   0000000   000   000  000   0000000    0000000   000000000  00000000  
// 0000  000  000   000  000   000  000  000        000   000     000     000       
// 000 0 000  000000000   000 000   000  000  0000  000000000     000     0000000   
// 000  0000  000   000     000     000  000   000  000   000     000     000       
// 000   000  000   000      0      000   0000000   000   000     000     00000000  

- (void) navigateToURL:(NSURL*)url
{
    if ([url isFileURL])
    {
        [self.view loadFileRequest:[NSURLRequest requestWithURL:url] allowingReadAccessToURL:[Bundle fileURL:@"/"]]; // ▸ WKNavigation*
    }
    else
    {
        [self.view loadRequest:[NSURLRequest requestWithURL:url]];
    }
}

// 00000000   0000000    0000000  000   000   0000000  
// 000       000   000  000       000   000  000       
// 000000    000   000  000       000   000  0000000   
// 000       000   000  000       000   000       000  
// 000        0000000    0000000   0000000   0000000   

- (Win*) focusNext { return [self focusSibling:+1]; }
- (Win*) focusPrev { return [self focusSibling:-1]; }
- (Win*) focusSibling:(int)offset
{
    NSArray* windows = [[NSApplication sharedApplication] windows];
    NSUInteger index = [windows indexOfObject:self];
    if (index != NSNotFound && [windows count] > 1)
    {    
        int sibIndex = index + offset;
        if (sibIndex < 0) sibIndex = [windows count]-1;
        if (sibIndex >= [windows count]) sibIndex = 0;
        if (sibIndex != index)
        {
            Win* sibling = (Win*)[windows objectAtIndex:sibIndex];
            NSLog(@"%d focus sibling %d/%d %d", self.windowNumber, sibIndex, [windows count], sibling.windowNumber);
            [sibling makeKeyAndOrderFront:self];
            return sibling;
        }
    }
    NSLog(@"no sibling window!");
    return nil;
}

//  0000000  000   000   0000000   00000000    0000000  000   000   0000000   000000000  
// 000       0000  000  000   000  000   000  000       000   000  000   000     000     
// 0000000   000 0 000  000000000  00000000   0000000   000000000  000   000     000     
//      000  000  0000  000   000  000             000  000   000  000   000     000     
// 0000000   000   000  000   000  000        0000000   000   000   0000000      000     

-(NSString*) snapshot:(NSString*)pngFilePath
{
    NSString *filePath = @"~/Desktop/kakao.png"; // todo: make path configurable somehow
    
    if (!pngFilePath)
    {
        int number = 0;
        while ([[NSFileManager defaultManager] fileExistsAtPath:[filePath stringByExpandingTildeInPath]])
        {
            number++;
            filePath = [NSString stringWithFormat:@"~/Desktop/kakao_%d.png", number];
        }
    }
    else
    {
        filePath = [NSString stringWithString:pngFilePath];
    }
                
    WKSnapshotConfiguration * snapshotConfiguration = [[WKSnapshotConfiguration alloc] init];
    [self.view takeSnapshotWithConfiguration:snapshotConfiguration completionHandler:
        ^(NSImage * image, NSError * error) 
        {
            if (error) { NSLog(@"%@", error); return; }
                                    
            NSData *imageData = [image TIFFRepresentation];
            NSBitmapImageRep *imageRep = [NSBitmapImageRep imageRepWithData:imageData];
            imageData = [imageRep representationUsingType:NSBitmapImageFileTypePNG properties:[NSDictionary dictionary]];
            [imageData writeToFile:[filePath stringByExpandingTildeInPath] atomically:NO];        
            
        }];
    [snapshotConfiguration release];
    
    return filePath;
}

// 00     00  000   0000000   0000000    
// 000   000  000  000       000         
// 000000000  000  0000000   000         
// 000 0 000  000       000  000         
// 000   000  000  0000000    0000000    


- (NSTimeInterval)animationResizeTime:(NSRect)newFrame
{
    NSTimeInterval interval = [super animationResizeTime:newFrame];
    // NSLog(@"resizeTime %d", interval);
    return interval;
}

- (void)framerateDrop:(long)ms
{
    NSLog(@"framrateDrop %ld", ms);
}

- (BOOL) canBecomeKeyWindow
{
	return YES;
}

- (BOOL) canBecomeMainWindow
{
	return YES;
}

- (void) reload
{
    [self.view reload];
}

@end