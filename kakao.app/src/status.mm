
//  0000000  000000000   0000000   000000000  000   000   0000000  
// 000          000     000   000     000     000   000  000       
// 0000000      000     000000000     000     000   000  0000000   
//      000     000     000   000     000     000   000       000  
// 0000000      000     000   000     000      0000000   0000000   

#import "view.h"
#import "route.h"
#import "status.h"
#import <WebKit/WebKit.h>

@implementation Status

- (NSStatusItem*) statusItem
{
    if (!self.item) 
    {
        self.item = [[NSStatusBar systemStatusBar] statusItemWithLength:NSVariableStatusItemLength];
        
        [self.item.button setTarget:self];   
        [self.item.button setAction:@selector(buttonPress:)];
    }
    return self.item;
}

- (void) buttonPress:(id)sender
{
    [Route emit:@"status.press"];
}

- (void) snapshot:(View*)view rect:(id)rect
{
    WKSnapshotConfiguration * snapshotConfiguration = [[WKSnapshotConfiguration alloc] init];
    
    float x = [[rect objectForKey:@"x"] floatValue];
    float y = [[rect objectForKey:@"y"] floatValue];
    float w = [[rect objectForKey:@"w"] floatValue];
    float h = [[rect objectForKey:@"h"] floatValue];
    
    // NSLog(@"%f %f %f %f", x, y, w, h);
    
    snapshotConfiguration.rect = CGRectMake(x, y, w, h);
    
    [view takeSnapshotWithConfiguration:snapshotConfiguration completionHandler:
        
        ^(NSImage * image, NSError * error) 
        {
            if (error) { NSLog(@"%@", error); return; }
            
            NSStatusItem* item = [self statusItem];
            
            // NSLog(@"image %@", image);
            
            item.button.cell.image = image;
        }];
        
    [snapshotConfiguration release];
}

@end