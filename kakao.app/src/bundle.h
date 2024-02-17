/*
  0000000    000   000  000   000  0000000    000      00000000    
  000   000  000   000  0000  000  000   000  000      000         
  0000000    000   000  000 0 000  000   000  000      0000000     
  000   000  000   000  000  0000  000   000  000      000         
  0000000     0000000   000   000  0000000    0000000  00000000    
*/

#import <Cocoa/Cocoa.h>

@interface Bundle : NSObject
{
}

+ (NSURL*) fileURLWithPath:(NSString*)path; // absoulte file url relative to .app folder

@end
