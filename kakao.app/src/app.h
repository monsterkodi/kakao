/*
    0000000   00000000   00000000   
   000   000  000   000  000   000  
   000000000  00000000   00000000   
   000   000  000        000        
   000   000  000        000        
*/

#import <Cocoa/Cocoa.h>
#import "watch.h"
#import "win.h"

@interface App : NSResponder <NSApplicationDelegate, WatchDelegate>

@property (readwrite,assign) NSString* snapshotFolder;
@property (readwrite,assign) NSString* snapshotFile;

+ (id)   new:(NSString*)indexFile;
+ (App*) get;
- (void) run; 
- (void) setIcon:(NSString*) pngFilePath;
- (int)  executeNodeScript:(NSString*)scriptPath args:(NSArray*)args;
- (NSString*) executeShellScript:(NSArray*)args;
+ (NSArray*) wins;
- (NSArray*) wins;

@end
