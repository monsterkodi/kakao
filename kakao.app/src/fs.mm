/*
    00000000   0000000
    000       000     
    000000    0000000 
    000            000
    000       0000000 
*/

#import "fs.h"
#import "bundle.h"

@implementation FS

+ (id) fs:(NSString*)req args:(NSArray*)args win:(Win*)win
{
    NSString* path = [Bundle path];
    
    if ([args count] && [[args objectAtIndex:0] isKindOfClass:[NSString class]]) 
    {
        path = [[args objectAtIndex:0] stringByExpandingTildeInPath];
    }
    else
    {
        NSLog(@"fallback to bundle path! %@", args);
    }
          
    if ([req isEqualToString:@"info"])
    {
        id attr = [[NSFileManager defaultManager] attributesOfItemAtPath:path error:nil];
        
        if (![attr objectForKey:@"NSFileSize"])
        {
            NSLog(@"no size? %@ %@", path, attr);
            return @"no size?";
        }
        
        NSMutableDictionary* info = [NSMutableDictionary dictionary];
        [info setObject:[attr objectForKey:@"NSFileSize"                  ] forKey:@"size"];
        [info setObject:[attr objectForKey:@"NSFileCreationDate"          ] forKey:@"created"];
        [info setObject:[attr objectForKey:@"NSFileGroupOwnerAccountName" ] forKey:@"group"];
        [info setObject:[attr objectForKey:@"NSFileOwnerAccountName"      ] forKey:@"owner"];
        [info setObject:[attr objectForKey:@"NSFileModificationDate"      ] forKey:@"modified"];
        [info setObject:[attr objectForKey:@"NSFilePosixPermissions"      ] forKey:@"permission"];
        
        if ([[attr objectForKey:@"NSFileType"] isEqualToString:@"NSFileTypeRegular"])
        {
            [info setObject:@"file" forKey:@"type"];
        }
        else
        {
            [info setObject:@"dir" forKey:@"type"];
        }
        return info;
    }
    if ([req isEqualToString:@"fileExists"])
    {
        BOOL isDir;
        BOOL exists = [[NSFileManager defaultManager] fileExistsAtPath:path isDirectory:&isDir];
        return [NSNumber numberWithBool:exists && !isDir];
    }
    if ([req isEqualToString:@"dirExists"])
    {
        BOOL isDir;
        BOOL exists = [[NSFileManager defaultManager] fileExistsAtPath:path isDirectory:&isDir];
        return [NSNumber numberWithBool:exists && isDir];
    }
    if ([req isEqualToString:@"exists"])
    {
        return [NSNumber numberWithBool:[[NSFileManager defaultManager] fileExistsAtPath:path]];
    }
    if ([req isEqualToString:@"isWritable"])
    {
        return [NSNumber numberWithBool:[[NSFileManager defaultManager] isWritableFileAtPath:path]];
    }
    if ([req isEqualToString:@"isReadable"])
    {
        return [NSNumber numberWithBool:[[NSFileManager defaultManager] isReadableFileAtPath:path]];
    }
    if ([req isEqualToString:@"read"])
    {
        return [NSString stringWithContentsOfFile:path encoding:NSUTF8StringEncoding error:nil];
    }
    else if ([req isEqualToString:@"write"])
    {
        NSString* text = [args objectAtIndex:1];
        NSData* data = [text dataUsingEncoding:NSUTF8StringEncoding];
        if ([data writeToFile:path options:NSAtomicWrite error:nil])
            return path;
        else
            return nil;
    }
    else if ([req isEqualToString:@"list"])
    {
        NSLog(@"list %@", path);
        
        NSDirectoryEnumerator<NSString*>* dirEnum = [[NSFileManager defaultManager] enumeratorAtPath:path];
        
        NSMutableArray* result = [NSMutableArray array];
        
        NSString *file;
        while ((file = [dirEnum nextObject])) 
        {
            [dirEnum skipDescendants];
            id type; 
            id fileType = [dirEnum.fileAttributes objectForKey:NSFileType];
            if ([fileType isEqualToString:NSFileTypeRegular])
            {
                type = @"file";
            }
            else if ([fileType isEqualToString:NSFileTypeDirectory])
            {
                type = @"dir";
            }
            
            NSMutableDictionary* fileInfo = [NSMutableDictionary dictionary];
            [fileInfo setObject:type forKey:@"type"];
            [fileInfo setObject:file forKey:@"file"];
            [fileInfo setObject:[path stringByAppendingPathComponent:file] forKey:@"path"];
            [result addObject:fileInfo];
        }
        
        NSLog(@"results %d", [result count]);
                
        return result;
    }
    else if ([req isEqualToString:@"listDeep"])
    {
        NSLog(@"listDeep %@", path);
        
        NSDirectoryEnumerator<NSString*>* dirEnum = [[NSFileManager defaultManager] enumeratorAtPath:path];
        
        NSMutableArray* result = [NSMutableArray array];
        
        NSString *file;
        while ((file = [dirEnum nextObject])) 
        {
            id type; 
            id fileType = [dirEnum.fileAttributes objectForKey:NSFileType];
            if ([fileType isEqualToString:NSFileTypeRegular])
            {
                type = @"file";
            }
            else if ([fileType isEqualToString:NSFileTypeDirectory])
            {
                type = @"dir";
            }
                    
            NSMutableDictionary* fileInfo = [NSMutableDictionary dictionary];
            [fileInfo setObject:type forKey:@"type"];
            [fileInfo setObject:file forKey:@"file"];
            [fileInfo setObject:[path stringByAppendingPathComponent:file] forKey:@"path"];
            [result addObject:fileInfo];
        }
                
        return result;
    }
    return nil;
}

@end