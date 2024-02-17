/*
  0000000    000   000  000   000  0000000    000      00000000    
  000   000  000   000  0000  000  000   000  000      000         
  0000000    000   000  000 0 000  000   000  000      0000000     
  000   000  000   000  000  0000  000   000  000      000         
  0000000     0000000   000   000  0000000    0000000  00000000    
*/

#import "bundle.h"

@implementation Bundle

+ (NSString*) path
{
    id path = [[NSBundle mainBundle] description];
    id cset = [NSCharacterSet characterSetWithCharactersInString:@"<>"];
    id comp = [path componentsSeparatedByCharactersInSet:cset];
    return [comp objectAtIndex:1];
}

+ (NSURL*) fileURLWithPath:(NSString*)path // absoulte file url relative to .app folder
{
    id comp = [[NSArray arrayWithObject:[Bundle path]] arrayByAddingObject:path];

    id norm = [[NSString pathWithComponents:comp] stringByStandardizingPath];
    
    //NSLog(norm);
    
    return [NSURL fileURLWithPath:norm];
}

@end