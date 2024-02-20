/*
  000   000  000  000   000  
  000 0 000  000  0000  000  
  000000000  000  000 0 000  
  000   000  000  000  0000  
  00     00  000  000   000  
*/

#import <Cocoa/Cocoa.h>
#import "view.h"

@interface Win : NSWindow 
{
}

@property (assign) View*  view;

+ (id) new;
- (id) init;
- (id) new:(NSString*)path;
- (void) reload;
- (void) snapshot:(NSString*)pngFilePath;
- (void) framerateDrop:(long)ms;

@end
