/*
   000   000   0000000   000000000   0000000  000   000  
   000 0 000  000   000     000     000       000   000  
   000000000  000000000     000     000       000000000  
   000   000  000   000     000     000       000   000  
   00     00  000   000     000      0000000  000   000  
*/

#import "watch.h"
#import <sys/stat.h>
#import <Foundation/Foundation.h>

#define INTERVAL 0.2 // time in seconds between change dispatches

BOOL shouldIgnoreChangedPath(NSString* path)
{
    if ([path hasPrefix:NSHomeDirectory()])
    {
        NSString* homePath = [path substringFromIndex:[NSHomeDirectory() length]+1];        
        if ([homePath hasPrefix:@"Library/"])
        {
            return YES;
        }
    }
    return NO;
} 

//  0000000  000   000   0000000   000   000   0000000   00000000  
// 000       000   000  000   000  0000  000  000        000       
// 000       000000000  000000000  000 0 000  000  0000  0000000   
// 000       000   000  000   000  000  0000  000   000  000       
//  0000000  000   000  000   000  000   000   0000000   00000000  

@implementation WatchChange

+ (WatchChange*) withPath:(NSString*)path type:(ChangeType)type isDir:(BOOL)isDir
{
    WatchChange* change = [[WatchChange alloc] init];
    change.path  = path;
    change.type  = type;
    change.isDir = isDir;
    return change;
}

@end

// 000   000   0000000   000000000   0000000  000   000  
// 000 0 000  000   000     000     000       000   000  
// 000000000  000000000     000     000       000000000  
// 000   000  000   000     000     000       000   000  
// 00     00  000   000     000      0000000  000   000  

static void FSMonitorEventStreamCallback(ConstFSEventStreamRef streamRef, Watch* monitor, size_t numEvents, NSArray *eventPaths, const FSEventStreamEventFlags eventFlags[], const FSEventStreamEventId eventIds[]);

@interface Watch ()
{
    FSEventStreamRef streamRef;
}

- (Watch*)initPath:(NSString*)path;
- (void)start;
- (void)stop;

@property(nonatomic, assign) id<WatchDelegate>  delegate;
@property(nonatomic, retain) NSString*          path;

@end

@implementation Watch

+ (Watch*) path:(NSString*)path delegate:(id<WatchDelegate>)delegate
{
    Watch* watch = [[Watch alloc] initPath:path];
    watch.delegate = delegate;
    return watch;
}

- (Watch*)initPath:(NSString*)path 
{
    if ((self = [super init])) 
    {
        self.path = [path copy];
        [self start];
    }
    return self;
}

- (void)dealloc
{
    [self.delegate release];
    [self stop];
    [super dealloc];
}

- (void)start 
{
    NSArray *paths = [NSArray arrayWithObject:self.path];

    FSEventStreamContext context;
    context.version = 0;
    context.info = (__bridge void *)(self);
    context.retain = NULL;
    context.release = NULL;
    context.copyDescription = NULL;

    streamRef = FSEventStreamCreate(nil,
                                     (FSEventStreamCallback)FSMonitorEventStreamCallback,
                                     &context,
                                     (__bridge CFArrayRef)paths,
                                     kFSEventStreamEventIdSinceNow,
                                     INTERVAL,
                                     kFSEventStreamCreateFlagUseCFTypes|kFSEventStreamCreateFlagNoDefer|kFSEventStreamCreateFlagFileEvents);
    if (!streamRef) 
    {
        NSLog(@"Failed to start monitoring of %@ (FSEventStreamCreate error)", self.path);
    }
    else
    {
        NSLog(@"👁  %@", self.path);
    }
    
    FSEventStreamSetDispatchQueue(streamRef, dispatch_get_main_queue());
    
    if (!FSEventStreamStart(streamRef)) 
    {
        NSLog(@"Error: can't watch %@ (FSEventStreamStart error)", self.path);
    }
}

- (void)stop
{
    FSEventStreamStop(streamRef);
    FSEventStreamInvalidate(streamRef);
    FSEventStreamRelease(streamRef);
    streamRef = nil;
}

@end

static void FSMonitorEventStreamCallback( ConstFSEventStreamRef streamRef, 
                                          Watch* monitor, 
                                          size_t numEvents, 
                                          NSArray *eventPaths, 
                                          const FSEventStreamEventFlags eventFlags[], 
                                          const FSEventStreamEventId eventIds[]) 
{
    NSMutableArray* changes = [NSMutableArray array];
            
    for (size_t i = 0; i < numEvents; i++) 
    {
        // NSLog(@"▸▸          %@ %x event %llu", [eventPaths objectAtIndex:i], eventFlags[i], eventIds[i]);
        if (shouldIgnoreChangedPath([eventPaths objectAtIndex:i]))
        {
            continue;
        }       
        
        BOOL isDir; ChangeType changeType;
        
        if (eventFlags[i] & kFSEventStreamEventFlagItemIsFile)
        {
            isDir = false;
        }
        else
        {
            isDir = true;
        }
        
        if (eventFlags[i] & kFSEventStreamEventFlagItemCreated)
        {
            changeType = ChangeType::Created;
        }
        else if (eventFlags[i] & kFSEventStreamEventFlagItemRemoved)
        {
            changeType = ChangeType::Deleted;
        }
        else
        {
            changeType = ChangeType::Changed;
        }
        
        [changes addObject:[WatchChange withPath:[eventPaths objectAtIndex:i] type:changeType isDir:isDir]];
    }
    
    if ([changes count])
    {
        [monitor.delegate onChanges:changes inFolder:monitor.path];
    }
}
