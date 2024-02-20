/*
00     00   0000000    0000000       0000000   00000000   00000000   
000   000  000   000  000           000   000  000   000  000   000  
000000000  000000000  000           000000000  00000000   00000000   
000 0 000  000   000  000           000   000  000        000        
000   000  000   000   0000000      000   000  000        000        
*/

#import <Cocoa/Cocoa.h>
#import "win.h"

@interface App : NSResponder <NSApplicationDelegate>
{
}

@property (readwrite,assign) NSString* snapshotFolder;
@property (readwrite,assign) NSString* snapshotFile;

+ (id)   new;
- (void) run; 
- (void) setIcon:(NSString*) pngFilePath;
- (Win*) win;

@end
