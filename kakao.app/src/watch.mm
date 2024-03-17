/*
   000   000   0000000   000000000   0000000  000   000  
   000 0 000  000   000     000     000       000   000  
   000000000  000000000     000     000       000000000  
   000   000  000   000     000     000       000   000  
   00     00  000   000     000      0000000  000   000  

   a merged and slightly modified version of:
   
   https://github.com/andreyvit/FSMonitoringKit
   
   Copyright (c) 2015 Andrey Tarantsov
   
   the modifications:
     - removed filter, bugfix and unused methods
     - main classes renamed and code cleaned up
*/

#import "watch.h"
#import <sys/stat.h>
#import <Foundation/Foundation.h>

#define INTERVAL 0.1 // minimum time in seconds between change dispatches
                     // increases automatically if folder scanning takes a long time

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

@interface FSChange ()

+ (FSChange*) changeWithFiles:(NSSet*)changedFiles foldersChanged:(BOOL)foldersChanged;

@end

@implementation FSChange

+ (FSChange*) changeWithFiles:(NSSet*)changedFiles foldersChanged:(BOOL)foldersChanged 
{
    FSChange* change = [[FSChange alloc] init];
    
    change.changedFiles = [changedFiles copy];
    change.foldersChanged = foldersChanged;

    return change;
}

@end

/*
000000000  00000000   00000000  00000000  
   000     000   000  000       000       
   000     0000000    0000000   0000000   
   000     000   000  000       000       
   000     000   000  00000000  00000000  
*/

// 000  000000000  00000000  00     00  
// 000     000     000       000   000  
// 000     000     0000000   000000000  
// 000     000     000       000 0 000  
// 000     000     00000000  000   000  

struct FSTreeItem 
{
    CFStringRef name;
    NSInteger   parent;
    mode_t      st_mode;
    dev_t       st_dev;
    ino_t       st_ino;
    timespec    st_mtimespec;
    timespec    st_ctimespec;
    off_t       st_size;
};

@interface FSTree : NSObject 

@property (nonatomic, readwrite, retain) NSMutableArray*  folders;
@property (nonatomic, readwrite, retain) NSString*        rootPath;
@property (nonatomic, readwrite) NSTimeInterval           buildTime;
@property (nonatomic, readwrite) FSTreeItem*              items;
@property (nonatomic, readwrite) NSInteger                count;

- (FSTree*) initWithPath:(NSString*) path;

@end

@implementation FSTree

- (FSTree*) initWithPath:(NSString*)path
{
    if ((self = [super init])) 
    {
        self.rootPath = path;
        self.folders  = [NSMutableArray new];

        NSInteger maxItems = 1000000;
            
        self.items = (FSTreeItem*)calloc(maxItems, sizeof(FSTreeItem));

        NSFileManager *fm = [NSFileManager defaultManager];
        @autoreleasepool 
        {
            NSDate *start = [NSDate date];

            struct stat st;
            
            if (0 == lstat([self.rootPath UTF8String], &st)) 
            {
                {
                    FSTreeItem *item = &self.items[self.count++];
                    item->name = (__bridge CFStringRef)@"";
                    item->st_mode = st.st_mode & S_IFMT;
                    item->st_dev = st.st_dev;
                    item->st_ino = st.st_ino;
                    item->st_mtimespec = st.st_mtimespec;
                    item->st_ctimespec = st.st_ctimespec;
                    item->st_size = st.st_size;
                }

                for (NSInteger next = 0; next < self.count; ++next) 
                {
                    FSTreeItem *item = &self.items[next];
                    if (item->st_mode == S_IFDIR) 
                    {
                        [self.folders addObject:(__bridge NSString *)item->name];

                        NSString *itemPath = [self.rootPath stringByAppendingPathComponent:(__bridge NSString *)(item->name)];
                        
                        for (NSString *child in [[fm contentsOfDirectoryAtPath:itemPath error:nil] sortedArrayUsingSelector:@selector(compare:)]) 
                        {
                            NSString *subpath = [itemPath stringByAppendingPathComponent:child];
                            
                            if (0 == lstat([subpath UTF8String], &st)) 
                            {
                                NSString *relativeChildPath = (CFStringGetLength(item->name) > 0 ? [(__bridge NSString *)item->name stringByAppendingPathComponent:child] : child);
                                if (self.count == maxItems) 
                                {
                                    NSLog(@"Warning: max monitored files reached! %ld", maxItems);
                                    break;
                                }
                                FSTreeItem *subitem = &self.items[self.count++];
                                subitem->parent = next;
                                subitem->name = (CFStringRef)CFBridgingRetain(relativeChildPath);                                
                                subitem->st_mode = st.st_mode & S_IFMT;
                                subitem->st_dev = st.st_dev;
                                subitem->st_ino = st.st_ino;
                                subitem->st_mtimespec = st.st_mtimespec;
                                subitem->st_ctimespec = st.st_ctimespec;
                                subitem->st_size = st.st_size;
                            }
                        }
                    }
                }
            }

            NSDate *end = [NSDate date];
            self.buildTime = [end timeIntervalSinceReferenceDate] - [start timeIntervalSinceReferenceDate];
            if (self.buildTime > 1) 
            {
                NSLog(@"%d %ld ms", (int)self.count, (long)(self.buildTime*1000.0));
            }
        }

        [self.folders sortUsingSelector:@selector(compare:)];
    }
    return self;
}

- (void) dealloc
{
    FSTreeItem *end = self.items + self.count;
    for (FSTreeItem *cur = self.items; cur < end; ++cur) 
    {
        CFRelease(cur->name);
    }
    free(self.items);
    [super dealloc];
}

//  0000000  000   000   0000000   000   000   0000000   00000000   0000000  
// 000       000   000  000   000  0000  000  000        000       000       
// 000       000000000  000000000  000 0 000  000  0000  0000000   0000000   
// 000       000   000  000   000  000  0000  000   000  000            000  
//  0000000  000   000  000   000  000   000   0000000   00000000  0000000   

- (NSArray*) changes:(FSTree*)previous 
{
    NSMutableArray* changes = [NSMutableArray array];

    FSTreeItem* previtems = previous.items;
    int prevcount   = previous.count;

    int *corresponding  = (int*)malloc(self.count * sizeof(int));
    int *rcorresponding = (int*)malloc(prevcount * sizeof(int));

    if (corresponding == NULL || rcorresponding == NULL) 
    {
        NSLog(@"Error: malloc failed!");
        return [NSArray array];
    }

    memset(corresponding, -1, self.count * sizeof(int));
    memset(rcorresponding, -1, prevcount * sizeof(int));

    corresponding[0] = 0;
    rcorresponding[0] = 0;
    int i = 1, j = 1;
    
    while (i < self.count && j < prevcount) 
    {
        NSInteger cp = corresponding[self.items[i].parent];
        if (cp < 0) 
        {
            BOOL isDir = self.items[i].st_mode == S_IFDIR;
            //NSLog(@"%@ created0 %d", self.items[i].name, isDir);
            [changes addObject:[WatchChange withPath:(__bridge NSString *)self.items[i].name type:Created isDir:isDir]];
            corresponding[i] = -2;
            ++i;
        } 
        else if (previtems[j].parent < cp) 
        {
            BOOL isDir = previtems[j].st_mode == S_IFDIR;
            //NSLog(@"%@ deleted! %d", previtems[j].name, isDir);
            [changes addObject:[WatchChange withPath:(__bridge NSString *)previtems[j].name type:Deleted isDir:isDir]];
            rcorresponding[j] = -2;
            ++j;
        } 
        else if (previtems[j].parent > cp) 
        {
            BOOL isDir = self.items[i].st_mode == S_IFDIR;
            //NSLog(@"%@ created! %d", self.items[i].name, isDir);
            [changes addObject:[WatchChange withPath:(__bridge NSString *)self.items[i].name type:Created isDir:isDir]];
            corresponding[i] = -2;
            ++i;
        } 
        else 
        {
            NSComparisonResult r = [(__bridge NSString *)self.items[i].name compare:(__bridge NSString *)previtems[j].name];
            
            if (r == 0) // same item, compare mod times
            { 
                if (self.items[i].st_mode               != previtems[j].st_mode              || 
                    self.items[i].st_dev                != previtems[j].st_dev               || 
                    self.items[i].st_ino                != previtems[j].st_ino               || 
                    self.items[i].st_mtimespec.tv_sec   != previtems[j].st_mtimespec.tv_sec  || 
                    self.items[i].st_mtimespec.tv_nsec  != previtems[j].st_mtimespec.tv_nsec || 
                    self.items[i].st_ctimespec.tv_sec   != previtems[j].st_ctimespec.tv_sec  || 
                    self.items[i].st_ctimespec.tv_nsec  != previtems[j].st_ctimespec.tv_nsec || 
                    self.items[i].st_size               != previtems[j].st_size) 
                {
                    if (self.items[i].st_mode == S_IFREG || previtems[j].st_mode == S_IFREG) 
                    {
                        BOOL isDir = self.items[i].st_mode == S_IFDIR;
                        [changes addObject:[WatchChange withPath:(__bridge NSString *)self.items[i].name type:Changed isDir:isDir]];
                    }
                }
                corresponding[i] = j;
                rcorresponding[j] = i;
                ++i;
                ++j;
            } 
            else if (r > 0) // i is after j => we need to advance j => j is deleted
            {
                BOOL isDir = previtems[j].st_mode == S_IFDIR;
                //NSLog(@"%@ deleted2 %d", previtems[j].name, isDir);
                [changes addObject:[WatchChange withPath:(__bridge NSString *)previtems[j].name type:Deleted isDir:isDir]];
                rcorresponding[j] = -3;
                ++j;
            } 
            else // (r < 0) i is before j => we need to advance i => i is new 
            {   
                BOOL isDir = self.items[i].st_mode == S_IFDIR;
                //NSLog(@"%@ created2 %d", self.items[i].name, isDir);
                [changes addObject:[WatchChange withPath:(__bridge NSString *)self.items[i].name type:Created isDir:isDir]];
                corresponding[i] = -3;
                ++i;
            }
        }
    }
    // for any tail left, we've already filled it in with -1's

    for (i = 0; i < self.count; i++) 
    {
        if (corresponding[i] == -1) 
        {
            if (self.items[i].st_mode == S_IFREG) 
            {
                BOOL isDir = self.items[i].st_mode == S_IFDIR;
                //NSLog(@"%@ created3 corresponding[%d]: %d isDir: %d", self.items[i].name, i, corresponding[i], isDir);
                [changes addObject:[WatchChange withPath:(__bridge NSString *)self.items[i].name type:Created isDir:isDir]];
            }
        }
    }
    for (j = 0; j < prevcount; j++) 
    {
        if (rcorresponding[j] == -1)
        {
            if (previtems[j].st_mode == S_IFREG) 
            {
                BOOL isDir = previtems[j].st_mode == S_IFDIR;
                //NSLog(@"%@ deleted3 rcorresponding[%d]: %d isDir: %d", previtems[j].name, j, rcorresponding[j], isDir);
                [changes addObject:[WatchChange withPath:(__bridge NSString *)previtems[j].name type:Deleted isDir:isDir]];
            }
        }
    }

    free(corresponding);
    free(rcorresponding);

    return changes;
}

@end

// 0000000    000  00000000  00000000  00000000  00000000   
// 000   000  000  000       000       000       000   000  
// 000   000  000  000000    000000    0000000   0000000    
// 000   000  000  000       000       000       000   000  
// 0000000    000  000       000       00000000  000   000  

@interface FSTreeDiffer : NSObject 

@property(nonatomic, readwrite, retain) NSString* path;
@property(nonatomic, readwrite, retain) FSTree*   savedTree;

- (id)initWithPath:(NSString*)path;

- (NSArray*)  changesInPaths:(NSSet*)pathSet;

@end

@implementation FSTreeDiffer

- (id)initWithPath:(NSString *)path
{
    if ((self = [super init])) 
    {
        self.path = path;
        self.savedTree = [[FSTree alloc] initWithPath:self.path];
    }
    return self;
}

- (NSArray*) changesInPaths:(NSSet*)paths
{
    FSTree* currentTree = [[FSTree alloc] initWithPath:self.path];

    NSArray* changes = [currentTree changes:self.savedTree];

    self.savedTree = currentTree;

    return changes;
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
    BOOL _running;

    FSEventStreamRef streamRef;
}

- (Watch*)initPath:(NSString*)path;
- (void)start;
- (void)stop;

@property(nonatomic, assign) id<WatchDelegate>  delegate;
@property(nonatomic, assign) NSTimeInterval     cacheWaitingTime;
@property(nonatomic, assign) NSTimeInterval     eventProcessingDelay;
@property(nonatomic, retain) NSString*          path;
@property(nonatomic, retain) FSTree*            tree;
@property(nonatomic, retain) FSTreeDiffer*      differ;
@property(nonatomic, retain) NSMutableSet*      eventCache;

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
        self.cacheWaitingTime = INTERVAL;
        self.eventCache = [[NSMutableSet alloc] init];
        self.path = [path copy];
        [self start];
    }
    return self;
}

- (void)dealloc
{
    [NSObject cancelPreviousPerformRequestsWithTarget:self];
    [self.delegate release];
    if (_running) 
    {
        [self stop];
    }
    [super dealloc];
}

- (void)start 
{
    self.differ = [[FSTreeDiffer alloc] initWithPath:self.path];
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
                                     0.05,
                                     kFSEventStreamCreateFlagUseCFTypes|kFSEventStreamCreateFlagNoDefer);
    if (!streamRef) 
    {
        NSLog(@"Failed to start monitoring of %@ (FSEventStreamCreate error)", self.path);
    }
    else
    {
        NSLog(@"👁  %@", self.path);
    }
    
    NSArray *actualPaths = (NSArray *) CFBridgingRelease(FSEventStreamCopyPathsBeingWatched(streamRef));
    NSString *actualPath = [actualPaths firstObject];
    // NSLog(@"Watch: %@", actualPath);

    FSEventStreamScheduleWithRunLoop(streamRef, CFRunLoopGetCurrent(), kCFRunLoopDefaultMode);
    
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
    [self.differ release];
}

- (void)sendChangeEventsFromCache 
{
    NSMutableSet * cachedPaths;

    @synchronized(self)
    {
        cachedPaths = [self.eventCache copy];
        [self.eventCache removeAllObjects];
        self.cacheWaitingTime = MAX(self.differ.savedTree.buildTime, INTERVAL);
    }
    // NSLog(@"onChanges");
    [self.delegate onChanges:[self.differ changesInPaths:cachedPaths] inFolder:self.path];
}

- (void)sendChangeEventWithPath:(NSString *)path flags:(FSEventStreamEventFlags)flags 
{    
    [self.eventCache addObject:path];
    [NSObject cancelPreviousPerformRequestsWithTarget:self];
    [self performSelector:@selector(sendChangeEventsFromCache) withObject:nil afterDelay:MAX(self.eventProcessingDelay, self.cacheWaitingTime)];
}

@end

static void FSMonitorEventStreamCallback( ConstFSEventStreamRef streamRef, 
                                          Watch* monitor, 
                                          size_t numEvents, 
                                          NSArray *eventPaths, 
                                          const FSEventStreamEventFlags eventFlags[], 
                                          const FSEventStreamEventId eventIds[]) 
{
    for (size_t i = 0; i < numEvents; i++) 
    {
        [monitor sendChangeEventWithPath:[eventPaths objectAtIndex:i] flags:eventFlags[i]];
    }
}
