/*
00     00   0000000    0000000       0000000   00000000   00000000   
000   000  000   000  000           000   000  000   000  000   000  
000000000  000000000  000           000000000  00000000   00000000   
000 0 000  000   000  000           000   000  000        000        
000   000  000   000   0000000      000   000  000        000        
*/

#import <Cocoa/Cocoa.h>

@interface App : NSResponder <NSApplicationDelegate>
{
}

+ (id)   new;
- (void) run; 
- (void) setIcon:(NSString*) pngFilePath;

@end
