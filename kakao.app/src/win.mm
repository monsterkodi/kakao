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

    view = [[View alloc] init];
    
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
    
    [self setContentView:view];
    [self makeKeyAndOrderFront:nil];
            
    [self navigateToURL:[Bundle fileURLinJS:@"index.html"]];
	return self;
}

- (void) navigateToURL:(NSURL*)url
{
    if ([url isFileURL])
    {
        id req = [NSMutableURLRequest requestWithURL:url];
        
        NSURL* srcURL = [Bundle fileURLWithPath:@"/"];
        
        [view loadFileRequest:req allowingReadAccessToURL:srcURL]; // ▸ WKNavigation*
    }
    else
    {
        [view loadRequest:[NSURLRequest requestWithURL:url]];
    }
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