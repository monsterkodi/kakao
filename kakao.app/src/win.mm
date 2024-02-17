/*
  000   000  000  000   000
  000 0 000  000  0000  000
  000000000  000  000 0 000
  000   000  000  000  0000
  00     00  000  000   000
*/

#import "win.h"
#import "bundle.h"

@implementation Win

+ (id) new
{
    return [[Win alloc] init];
}

- (id) init
{
    self = [self initWithContentRect: CGRectMake(0, 0, 0, 0)
                 styleMask: (   
                                NSWindowStyleMaskTitled | 
                                NSWindowStyleMaskMiniaturizable | 
                                NSWindowStyleMaskClosable | 
                                NSWindowStyleMaskResizable 
                                //NSWindowStyleMaskFullSizeContentView
                            )
                 backing:   NSBackingStoreBuffered
                 defer:     YES];
                
    if (!self) { return nil; }

    view = [[View alloc] init];
    
    //[view initScripting];        
        
    if (0)
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
    
    [self setContentView:view];
    [self makeKeyAndOrderFront:nil];
            
    NSLog(@"bundle url %@", [Bundle fileURLWithPath:@"./Contents/MacOS/js/index.htm"]);
    
    id url = [NSURL fileURLWithPath:@"/Users/kodi/s/kakao/kakao.app/Contents/MacOS/js/index.html"];
    //id url = [self URLforBundlePath:@"./Contents/MacOS/js/index.html"];
    NSLog(@"url: %@", url);
    [self navigateToURL:url];
	return self;
}

- (NSURL*) URLforBundlePath:(NSString*)bundlePath // absoulte file url relative to .app folder
{

    NSLog([[bundlePath lastPathComponent] stringByDeletingPathExtension]);
    NSLog([bundlePath pathExtension]);
    NSLog([bundlePath stringByDeletingLastPathComponent]);
    NSLog(@"%@", [NSBundle mainBundle]);
    NSLog(@"%@", [[NSBundle mainBundle] URLForResource:bundlePath withExtension:nil]);
    
    return [[NSBundle mainBundle] URLForResource:bundlePath withExtension:nil];

    //return [[NSBundle mainBundle] URLForResource:[[bundlePath lastPathComponent] stringByDeletingPathExtension]
    //                               withExtension:[bundlePath pathExtension]
    //                                subdirectory:[bundlePath stringByDeletingLastPathComponent]];
}

- (void) navigateToURL:(NSURL*)url
{
    if ([url isFileURL])
    {
        NSLog(@"WebWin navigate file %@", url);
        // WKNavigation* nav = 
        [view loadFileURL:url allowingReadAccessToURL:url];
    }
    else
    {
        NSLog(@"WebWin navigate http %@", url);
        [view loadRequest:[NSURLRequest requestWithURL:url]];
    }
    
    NSLog(@"WebWin navigate %@", view);
}

-(void) takeSnapshot:(NSString*)pngFilePath
{
    WKSnapshotConfiguration * snapshotConfiguration = [[WKSnapshotConfiguration alloc] init];
    [view takeSnapshotWithConfiguration:snapshotConfiguration completionHandler:
        ^(NSImage * image, NSError * error) {
            
            if (error) { NSLog(@"%@", error); return; }
            
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
            
            NSData *imageData = [image TIFFRepresentation];
            NSBitmapImageRep *imageRep = [NSBitmapImageRep imageRepWithData:imageData];
            imageData = [imageRep representationUsingType:NSBitmapImageFileTypePNG properties:[NSDictionary dictionary]];
            [imageData writeToFile:[filePath stringByExpandingTildeInPath] atomically:NO];        
            
    }];
    [snapshotConfiguration release];
}

- (BOOL) canBecomeKeyWindow
{
	return YES;
}

- (BOOL) canBecomeMainWindow
{
	return YES;
}

@end