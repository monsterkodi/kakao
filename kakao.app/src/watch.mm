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
     - main classes renamed
*/

#import "watch.h"
#import <sys/stat.h>
#import <Foundation/Foundation.h>

//  0000000  000   000   0000000   000   000   0000000   00000000  
// 000       000   000  000   000  0000  000  000        000       
// 000       000000000  000000000  000 0 000  000  0000  0000000   
// 000       000   000  000   000  000  0000  000   000  000       
//  0000000  000   000  000   000  000   000   0000000   00000000  

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

// 000000000  00000000   00000000  00000000  
//    000     000   000  000       000       
//    000     0000000    0000000   0000000   
//    000     000   000  000       000       
//    000     000   000  00000000  00000000  

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
{
    NSString*       _rootPath;
    FSTreeItem*     _items;
    NSInteger       _count;
    NSTimeInterval  _buildTime;
    NSMutableArray* _folders;
}

- (id)initWithPath:(NSString *)path;

@property (nonatomic, readonly, copy) NSString *rootPath;
@property (nonatomic, readonly) NSTimeInterval buildTime;

- (NSSet *)differenceFrom:(FSTree *)previous;

@property(nonatomic, readonly, strong) NSArray *folderPaths;

@end

@implementation FSTree

@synthesize rootPath = _rootPath;
@synthesize buildTime = _buildTime;

- (id)initWithPath:(NSString *)rootPath
{
    if ((self = [super init])) 
    {
        _rootPath = [rootPath copy];
        _folders = [NSMutableArray new];

        NSInteger maxItems = 1000000;
            
        _items = (FSTreeItem*)calloc(maxItems, sizeof(FSTreeItem));

        NSFileManager *fm = [NSFileManager defaultManager];
        @autoreleasepool 
        {
            NSDate *start = [NSDate date];

            struct stat st;
            
            if (0 == lstat([rootPath UTF8String], &st)) 
            {
                {
                    FSTreeItem *item = &_items[_count++];
                    item->name = (__bridge CFStringRef)@"";
                    item->st_mode = st.st_mode & S_IFMT;
                    item->st_dev = st.st_dev;
                    item->st_ino = st.st_ino;
                    item->st_mtimespec = st.st_mtimespec;
                    item->st_ctimespec = st.st_ctimespec;
                    item->st_size = st.st_size;
                }

                for (NSInteger next = 0; next < _count; ++next) 
                {
                    FSTreeItem *item = &_items[next];
                    if (item->st_mode == S_IFDIR) 
                    {
                        [_folders addObject:(__bridge NSString *)item->name];

                        NSString *itemPath = [_rootPath stringByAppendingPathComponent:(__bridge NSString *)(item->name)];
                        
                        for (NSString *child in [[fm contentsOfDirectoryAtPath:itemPath error:nil] sortedArrayUsingSelector:@selector(compare:)]) 
                        {
                            NSString *subpath = [itemPath stringByAppendingPathComponent:child];
                            
                            if (0 == lstat([subpath UTF8String], &st)) 
                            {
                                BOOL isDir = (st.st_mode & S_IFMT) == S_IFDIR;
                                NSString *relativeChildPath = (CFStringGetLength(item->name) > 0 ? [(__bridge NSString *)item->name stringByAppendingPathComponent:child] : child);
                                if (_count == maxItems) 
                                {
                                    NSLog(@"Warning: max monitored files reached! %d", maxItems);
                                    break;
                                }
                                FSTreeItem *subitem = &_items[_count++];
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
            _buildTime = [end timeIntervalSinceReferenceDate] - [start timeIntervalSinceReferenceDate];
            //NSLog(@"Scanned %d %.3lfs in %@", (int)_count, _buildTime, rootPath);
            NSLog(@"%d %ld ms", (int)_count, (long)(_buildTime*1000.0));
        }

        [_folders sortUsingSelector:@selector(compare:)];
    }
    return self;
}

- (void)dealloc 
{
    FSTreeItem *end = _items + _count;
    for (FSTreeItem *cur = _items; cur < end; ++cur) 
    {
        CFRelease(cur->name);
    }
    free(_items);
    [super dealloc];
}

- (NSSet *)differenceFrom:(FSTree *)previous 
{
    NSMutableSet *differences = [NSMutableSet set];

    FSTreeItem *previtems = previous->_items;
    NSInteger prevcount = previous->_count;

    NSInteger *corresponding = (NSInteger*)malloc(_count * sizeof(NSInteger));
    NSInteger *rcorresponding = (NSInteger*)malloc(prevcount * sizeof(NSInteger));

    if (corresponding == NULL || rcorresponding == NULL) 
    {
        NSLog(@"Error: malloc failed!");
        return [NSSet set];
    }

    memset(corresponding, -1, _count * sizeof(NSInteger));
    memset(rcorresponding, -1, prevcount * sizeof(NSInteger));

    corresponding[0] = 0;
    rcorresponding[0] = 0;
    NSInteger i = 1, j = 1;
    
    while (i < _count && j < prevcount) 
    {
        NSInteger cp = corresponding[_items[i].parent];
        if (cp < 0) 
        {
            NSLog(@"%@ subitem", _items[i].name);
            corresponding[i] = -1;
            ++i;
        } 
        else if (previtems[j].parent < cp) 
        {
            NSLog(@"%@ deleted", previtems[j].name);
            rcorresponding[j] = -1;
            ++j;
        } 
        else if (previtems[j].parent > cp) 
        {
            NSLog(@"%@ created", _items[i].name);
            corresponding[i] = -1;
            ++i;
        } 
        else 
        {
            NSComparisonResult r = [(__bridge NSString *)_items[i].name compare:(__bridge NSString *)previtems[j].name];
            if (r == 0) 
            { // same item! compare mod times
                if (_items[i].st_mode               != previtems[j].st_mode              || 
                    _items[i].st_dev                != previtems[j].st_dev               || 
                    _items[i].st_ino                != previtems[j].st_ino               || 
                    _items[i].st_mtimespec.tv_sec   != previtems[j].st_mtimespec.tv_sec  || 
                    _items[i].st_mtimespec.tv_nsec  != previtems[j].st_mtimespec.tv_nsec || 
                    _items[i].st_ctimespec.tv_sec   != previtems[j].st_ctimespec.tv_sec  || 
                    _items[i].st_ctimespec.tv_nsec  != previtems[j].st_ctimespec.tv_nsec || 
                    _items[i].st_size               != previtems[j].st_size) 
                {
                    NSLog(@"%@ changed", _items[i].name);
                    if (_items[i].st_mode == S_IFREG || previtems[j].st_mode == S_IFREG) 
                    {
                        [differences addObject:(__bridge NSString *)_items[i].name];
                    }
                }
                corresponding[i] = j;
                rcorresponding[j] = i;
                ++i;
                ++j;
            } 
            else if (r > 0) // i is after j => we need to advance j => j is deleted
            {
                NSLog(@"%@ deleted", previtems[j].name);
                rcorresponding[j] = -1;
                ++j;
            } 
            else // (r < 0) i is before j => we need to advance i => i is new 
            {   
                NSLog(@"%@ created", _items[i].name);
                corresponding[i] = -1;
                ++i;
            }
        }
    }
    // for any tail left, we've already filled it in with -1's

    for (i = 0; i < _count; i++) 
    {
        if (corresponding[i] < 0) 
        {
            if (_items[i].st_mode == S_IFREG) 
            {
                [differences addObject:(__bridge NSString *)_items[i].name];
            }
        }
    }
    for (j = 0; j < prevcount; j++) 
    {
        if (rcorresponding[j] < 0) 
        {
            if (previtems[j].st_mode == S_IFREG) 
            {
                [differences addObject:(__bridge NSString *)previtems[j].name];
            }
        }
    }

    free(corresponding);
    free(rcorresponding);

    return differences;
}

- (NSArray *)folderPaths 
{
    return _folders;
}

@end

// 0000000    000  00000000  00000000  00000000  00000000   
// 000   000  000  000       000       000       000   000  
// 000   000  000  000000    000000    0000000   0000000    
// 000   000  000  000       000       000       000   000  
// 0000000    000  000       000       00000000  000   000  

@interface FSTreeDiffer : NSObject 
{
    NSString *_path;
    NSSet *_savedFileList;
    FSTree *_previousTree;
}

- (id)initWithPath:(NSString *)path;

- (FSChange *)changedPathsByRescanningSubfolders:(NSSet *)subfolderPathes;

@property(nonatomic, readonly, strong) FSTree *savedTree;

@end

@implementation FSTreeDiffer

- (id)initWithPath:(NSString *)path
{
    if ((self = [super init])) 
    {
        _path = [path copy];
        _previousTree = [[FSTree alloc] initWithPath:_path];
    }
    return self;
}

- (NSSet *)allFiles 
{
    NSTimeInterval start = [[NSDate date] timeIntervalSinceReferenceDate];
    NSSet *result = [NSSet setWithArray:[[NSFileManager defaultManager] subpathsOfDirectoryAtPath:_path error:nil]];
    NSTimeInterval elapsed = [[NSDate date] timeIntervalSinceReferenceDate] - start;
    NSLog(@"Scanning of %@ took %0.3lf sec.", _path, elapsed);
    return result;
}

- (FSChange *)changedPathsByRescanningSubfolders:(NSSet *)subfolderPathes 
{
    FSTree *currentTree = [[FSTree alloc] initWithPath:_path];

    NSSet *changedPaths = [currentTree differenceFrom:_previousTree];
    BOOL foldersChanged = ![currentTree.folderPaths isEqualToArray:_previousTree.folderPaths];

    _previousTree = currentTree;

    return [FSChange changeWithFiles:changedPaths foldersChanged:foldersChanged];
}

- (FSTree *)savedTree 
{
    return _previousTree;
}

@end

// 000   000   0000000   000000000   0000000  000   000  
// 000 0 000  000   000     000     000       000   000  
// 000000000  000000000     000     000       000000000  
// 000   000  000   000     000     000       000   000  
// 00     00  000   000     000      0000000  000   000  

static void FSMonitorEventStreamCallback(ConstFSEventStreamRef streamRef, Watch* monitor, size_t numEvents, NSArray *eventPaths, const FSEventStreamEventFlags eventFlags[], const FSEventStreamEventId eventIds[]);

@interface Watch ()

- (void)start;
- (void)stop;

@property (nonatomic, readonly, strong) NSMutableSet * eventCache;
@property (nonatomic, assign) NSTimeInterval cacheWaitingTime;

@end

@implementation Watch

@synthesize path=_path;
@synthesize delegate=_delegate;

@synthesize eventCache = _eventCache;
@synthesize cacheWaitingTime = _cacheWaitingTime;
@synthesize eventProcessingDelay=_eventProcessingDelay;

- (Watch*)initWithPath:(NSString *)path 
{
    if ((self = [super init])) 
    {
        _cacheWaitingTime = 0.1;
        _eventCache = [[NSMutableSet alloc] init];
        _path = [path copy];
        [self setRunning:true];
    }
    return self;
}

- (void)dealloc 
{
    [NSObject cancelPreviousPerformRequestsWithTarget:self];
    if (_running) 
    {
        [self stop];
    }
    [super dealloc];
}

- (BOOL)isRunning 
{
    return _running;
}

- (void)setRunning:(BOOL)running 
{
    if (_running != running) 
    {
        _running = running;
        if (running) 
        {
            [self start];
        } 
        else 
        {
            [self stop];
        }
    }
}

- (void)start 
{
    _treeDiffer = [[FSTreeDiffer alloc] initWithPath:_path];
    NSArray *paths = [NSArray arrayWithObject:_path];

    FSEventStreamContext context;
    context.version = 0;
    context.info = (__bridge void *)(self);
    context.retain = NULL;
    context.release = NULL;
    context.copyDescription = NULL;

    _streamRef = FSEventStreamCreate(nil,
                                     (FSEventStreamCallback)FSMonitorEventStreamCallback,
                                     &context,
                                     (__bridge CFArrayRef)paths,
                                     kFSEventStreamEventIdSinceNow,
                                     0.05,
                                     kFSEventStreamCreateFlagUseCFTypes|kFSEventStreamCreateFlagNoDefer);
    if (!_streamRef) 
    {
        NSLog(@"Failed to start monitoring of %@ (FSEventStreamCreate error)", _path);
    }
    else
    {
        NSLog(@"Start monitoring of %@", _path);
    }
    
    NSArray *actualPaths = (NSArray *) CFBridgingRelease(FSEventStreamCopyPathsBeingWatched(_streamRef));
    NSString *actualPath = [actualPaths firstObject];
    NSLog(@"FSEvents actual path being watched: %@", actualPath);

    //dispatch_queue_t q = dispatch_queue_create("Watch", NULL);
    //FSEventStreamSetDispatchQueue(_streamRef, q);
    
    FSEventStreamScheduleWithRunLoop(_streamRef, CFRunLoopGetCurrent(), kCFRunLoopDefaultMode);
    
    if (!FSEventStreamStart(_streamRef)) {
        NSLog(@"Failed to start monitoring of %@ (FSEventStreamStart error)", _path);
    }
}

- (void)stop
{
    FSEventStreamStop(_streamRef);
    FSEventStreamInvalidate(_streamRef);
    FSEventStreamRelease(_streamRef);
    _streamRef = nil;
    _treeDiffer = nil;
}

- (void)sendChangeEventsFromCache 
{
    NSMutableSet * cachedPaths;

    @synchronized(self)
    {
        cachedPaths = [self.eventCache copy];
        [self.eventCache removeAllObjects];
        NSTimeInterval lastRebuildTime = _treeDiffer.savedTree.buildTime;

        NSTimeInterval minDelay = [[NSUserDefaults standardUserDefaults] integerForKey:@"MinEventProcessingDelay"] / 1000.0;
        _cacheWaitingTime = MAX(lastRebuildTime, minDelay);
    }

    FSChange *change = [_treeDiffer changedPathsByRescanningSubfolders:cachedPaths];
    
    if (change.changedFiles.count > 0 || change.foldersChanged)
    {
        [self.delegate watch:self detectedChange:change];
    }
}

- (void)sendChangeEventWithPath:(NSString *)path flags:(FSEventStreamEventFlags)flags 
{
    NSString *flagsStr = @"";
    
    if ((flags & kFSEventStreamEventFlagMustScanSubDirs)) 
    {
        flagsStr = [flagsStr stringByAppendingString:@"MustScanSubDirs"];
    }
    if ((flags & kFSEventStreamEventFlagRootChanged)) 
    {
        flagsStr = [flagsStr stringByAppendingString:@"RootChanged"];
    }
    if ([flagsStr length]) 
    {
        flagsStr = [NSString stringWithFormat:@" [%@]", flagsStr];
    }
    
    NSLog(@"%@%@", path, flagsStr);

    [self.eventCache addObject:path];
    [NSObject cancelPreviousPerformRequestsWithTarget:self];
    [self performSelector:@selector(sendChangeEventsFromCache) withObject:nil afterDelay:MAX(_eventProcessingDelay, self.cacheWaitingTime)];
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
