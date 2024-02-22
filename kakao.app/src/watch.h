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

@property(nonatomic, copy)  NSSet   *changedFiles;
@property(nonatomic)        BOOL    foldersChanged;

@end

@protocol WatchDelegate;

// 000   000   0000000   000000000   0000000  000   000  
// 000 0 000  000   000     000     000       000   000  
// 000000000  000000000     000     000       000000000  
// 000   000  000   000     000     000       000   000  
// 00     00  000   000     000      0000000  000   000  

@interface Watch : NSObject

+ (Watch*)path:(NSString*)path delegate:(id<WatchDelegate>)delegate;

@end

// 0000000    00000000  000      00000000   0000000    0000000   000000000  00000000  
// 000   000  000       000      000       000        000   000     000     000       
// 000   000  0000000   000      0000000   000  0000  000000000     000     0000000   
// 000   000  000       000      000       000   000  000   000     000     000       
// 0000000    00000000  0000000  00000000   0000000   000   000     000     00000000  

@protocol WatchDelegate <NSObject>

- (void)watch:(Watch*)watch detectedChange:(FSChange*)change;

@end
