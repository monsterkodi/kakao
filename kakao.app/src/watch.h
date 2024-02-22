/*
   000   000   0000000   000000000   0000000  000   000  
   000 0 000  000   000     000     000       000   000  
   000000000  000000000     000     000       000000000  
   000   000  000   000     000     000       000   000  
   00     00  000   000     000      0000000  000   000  

   a merged and slightly modified version of:
   
   https://github.com/andreyvit/FSMonitoringKit
   
   Copyright (c) 2015 Andrey Tarantsov   
*/

#import <Cocoa/Cocoa.h>

//  0000000  000   000   0000000   000   000   0000000   00000000  
// 000       000   000  000   000  0000  000  000        000       
// 000       000000000  000000000  000 0 000  000  0000  0000000   
// 000       000   000  000   000  000  0000  000   000  000       
//  0000000  000   000  000   000  000   000   0000000   00000000  

@interface FSChange : NSObject

@property(nonatomic, copy) NSSet *changedFiles;
@property(nonatomic) BOOL foldersChanged;

@end

@class FSTreeDiffer;
@class FSTree;

@protocol WatchDelegate;

// 000   000   0000000   000000000   0000000  000   000  
// 000 0 000  000   000     000     000       000   000  
// 000000000  000000000     000     000       000000000  
// 000   000  000   000     000     000       000   000  
// 00     00  000   000     000      0000000  000   000  

@interface Watch : NSObject 
{
    NSString *_path;

    BOOL _running;

    FSEventStreamRef _streamRef;
    FSTreeDiffer *_treeDiffer;

    NSMutableSet *_eventCache;
    NSTimeInterval _cacheWaitingTime;
    NSTimeInterval _eventProcessingDelay;
}

- (Watch*)initWithPath:(NSString*)path;

@property(nonatomic, readonly, copy)    NSString            *path;
@property(nonatomic, retain)            id<WatchDelegate>   delegate;
@property(nonatomic, getter=isRunning)  BOOL                running;
@property(nonatomic, readonly, strong)  FSTree              *tree;
@property(nonatomic, assign)            NSTimeInterval      eventProcessingDelay;

@end

// 0000000    00000000  000      00000000   0000000    0000000   000000000  00000000  
// 000   000  000       000      000       000        000   000     000     000       
// 000   000  0000000   000      0000000   000  0000  000000000     000     0000000   
// 000   000  000       000      000       000   000  000   000     000     000       
// 0000000    00000000  0000000  00000000   0000000   000   000     000     00000000  

@protocol WatchDelegate <NSObject>

- (void)watch:(Watch*)watch detectedChange:(FSChange*)change;

@end
