/*
  000   000  000  000   000  
  000 0 000  000  0000  000  
  000000000  000  000 0 000  
  000   000  000  000  0000  
  00     00  000  000   000  
*/

#import <Cocoa/Cocoa.h>
#import "view.h"

@interface Win : NSWindow <NSApplicationDelegate>
{
    View* view;
}

+ (id) new;
- (id) init;

- (void) snapshot:(NSString*)pngFilePath;

@end
