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

+ (Win*) new;
- (Win*) init;
- (Win*) new:(NSString*)path;
- (Win*) focusNext;
- (Win*) focusPrev;
- (void) reload;
- (void) framerateDrop:(long)ms;
- (NSString*) snapshot:(NSString*)pngFilePath;

@end
