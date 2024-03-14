/*
    00000000   0000000  
    000       000       
    000000    0000000   
    000            000  
    000       0000000   
*/

#import <Cocoa/Cocoa.h>
#include "win.h"

@interface FS
{
}

+ (id) req:(NSString*)req args:(NSArray*)args win:(Win*)win;

@end

