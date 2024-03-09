/*
  00000000    0000000   000   000  000000000  00000000
  000   000  000   000  000   000     000     000     
  0000000    000   000  000   000     000     0000000 
  000   000  000   000  000   000     000     000     
  000   000   0000000    0000000      000     00000000
*/

#import "route.h"
#import "bundle.h"

@implementation Route

// 000   000  000  000   000  0000000     0000000   000   000  
// 000 0 000  000  0000  000  000   000  000   000  000 0 000  
// 000000000  000  000 0 000  000   000  000   000  000000000  
// 000   000  000  000  0000  000   000  000   000  000   000  
// 00     00  000  000   000  0000000     0000000   00     00  

+ (id) window:(NSString*)req args:(NSArray*)args win:(Win*)win
{    
    id arg0 = nil;
    id arg1 = nil;
    if (args && [args count] > 0) arg0 = [args objectAtIndex:0];    
    if (args && [args count] > 1) arg1 = [args objectAtIndex:1];    
    
    //NSLog(@"%d ▸ %@ %@", win.windowNumber, req, arg0 ? arg0 : @"");

    if ([req isEqualToString:@"focusNext"     ]) { return [win focusNext];  }
    if ([req isEqualToString:@"focusPrev"     ]) { return [win focusPrev];  }
    if ([req isEqualToString:@"new"           ]) { return [NSNumber numberWithLong:[win new:arg0 script:arg1].windowNumber]; }
    if ([req isEqualToString:@"snapshot"      ]) { return [win snapshot:arg0]; }
    if ([req isEqualToString:@"close"         ]) { [win performClose:nil]; return nil; }
    if ([req isEqualToString:@"reload"        ]) { [win reload];           return nil; }
    if ([req isEqualToString:@"maximize"      ]) { [win zoom:nil];         return nil; }
    if ([req isEqualToString:@"minimize"      ]) { [win miniaturize:nil];  return nil; }
    if ([req isEqualToString:@"center"        ]) { [win center];           return nil; }
    if ([req isEqualToString:@"setSize"       ]) { [win setWidth:[arg0 longValue] height:[arg1 longValue]];  return nil; }
    if ([req isEqualToString:@"setMinSize"    ]) { [win setContentMinSize:CGSizeMake([arg0 longValue], [arg1 longValue])]; return nil; }
    if ([req isEqualToString:@"id"            ]) { return [NSNumber numberWithLong:win.windowNumber]; }
    if ([req isEqualToString:@"framerateDrop" ]) { [win framerateDrop:[arg0 longValue]]; return nil; }
    
    return nil;
}

// 0000000    000   000  000   000  0000000    000      00000000  
// 000   000  000   000  0000  000  000   000  000      000       
// 0000000    000   000  000 0 000  000   000  000      0000000   
// 000   000  000   000  000  0000  000   000  000      000       
// 0000000     0000000   000   000  0000000    0000000  00000000  

+ (id) bundle:(NSString*)req args:(NSArray*)args win:(Win*)win
{
    return [Bundle performSelector:sel_getUid([req cStringUsingEncoding:NSUTF8StringEncoding])];
}

+ (id) app:(NSString*)req args:(NSArray*)args win:(Win*)win
{
    NSLog(@"%d ▸ %@", (long)win.windowNumber, req);
    id app = [NSApplication sharedApplication];
    if ([req isEqualToString:@"quit"])
    {
        [app terminate:nil];
    }
    return nil;
}

// 00000000   0000000  
// 000       000       
// 000000    0000000   
// 000            000  
// 000       0000000   

+ (id) fs:(NSString*)req args:(NSArray*)args win:(Win*)win
{
    if ([req isEqualToString:@"read"])
    {
        NSString* path = [args objectAtIndex:0];
        return [NSString stringWithContentsOfFile:path encoding:NSUTF8StringEncoding error:nil];
    }
    else if ([req isEqualToString:@"write"])
    {
        NSString* path = [args objectAtIndex:0];
        NSString* text = [args objectAtIndex:1];
        NSData* data = [text dataUsingEncoding:NSUTF8StringEncoding];
        if ([data writeToFile:path options:NSAtomicWrite error:nil])
            return path;
        else
            return nil;
    }
    return nil;
}

// 000000000  00000000   0000000  000000000  
//    000     000       000          000     
//    000     0000000   0000000      000     
//    000     000            000     000     
//    000     00000000  0000000      000     

+ (id) test:(NSString*)req args:(NSArray*)args
{
    if ([req isEqualToString:@"ping"])
    {
        return [NSString stringWithFormat:@"you say %@ you get pong!", [args objectAtIndex:0]];
    }
    if ([req isEqualToString:@"struct"])
    {
        id dict = [NSMutableDictionary dictionary];
        [dict setObject:[NSString stringWithFormat:@"you sent %@", [args objectAtIndex:0]] forKey:@"input"];
        [dict setObject:@"you get this!" forKey:@"output"];
        return dict;
    }
    return nil;
}

// 00000000   00000000   0000000   000   000  00000000   0000000  000000000  
// 000   000  000       000   000  000   000  000       000          000     
// 0000000    0000000   000 00 00  000   000  0000000   0000000      000     
// 000   000  000       000 0000   000   000  000            000     000     
// 000   000  00000000   00000 00   0000000   00000000  0000000      000     

+ (void) request:(WKScriptMessage*)msg callback:(Callback)callback win:(Win*)win
{
    //NSLog(@"%@ %@", msg.name, msg.body);
    
    id reply = @"???";
    
    NSString* route = [msg.body valueForKey:@"route"];
    NSArray*  args  = [msg.body valueForKey:@"args"];

         if ([route isEqualToString:@"log"]) { NSLog(@"%ld %@ %@", (long)win.windowNumber, msg.name, msg.body); }
    else if ([route hasPrefix:@"bundle."]) { reply = [Route bundle:[route substringFromIndex:7] args:args win:win]; }
    else if ([route hasPrefix:@"window."]) { reply = [Route window:[route substringFromIndex:7] args:args win:win]; }
    else if ([route hasPrefix:@"win."   ]) { reply = [Route window:[route substringFromIndex:4] args:args win:win]; }
    else if ([route hasPrefix:@"app."   ]) { reply = [Route app:   [route substringFromIndex:4] args:args win:win]; }
    else if ([route hasPrefix:@"fs."    ]) { reply = [Route fs:    [route substringFromIndex:3] args:args win:win]; }
    else if ([route hasPrefix:@"test."  ]) { reply = [Route test:  [route substringFromIndex:5] args:args win:win]; }
    else NSLog(@"unknown request %@ %@", msg.name, msg.body);
    
    if (callback) callback(reply, nil);
}

// 00     00  00000000   0000000   0000000   0000000    0000000   00000000  
// 000   000  000       000       000       000   000  000        000       
// 000000000  0000000   0000000   0000000   000000000  000  0000  0000000   
// 000 0 000  000            000       000  000   000  000   000  000       
// 000   000  00000000  0000000   0000000   000   000   0000000   00000000  

+ (void) message:(WKScriptMessage*)msg win:(Win*)win
{     
    [self request:msg callback:nil win:win];
}

// 00000000  00     00  000  000000000  
// 000       000   000  000     000     
// 0000000   000000000  000     000     
// 000       000 0 000  000     000     
// 00000000  000   000  000     000     

+ (void) emit:(NSString*)event
{
    for (id win in [[NSApplication sharedApplication] windows])
    {
        if ([win isKindOfClass:[Win class]])
        {
            [self send:event win:(Win*)win];
        }
    }
}

//  0000000  00000000  000   000  0000000    
// 000       000       0000  000  000   000  
// 0000000   0000000   000 0 000  000   000  
//      000  000       000  0000  000   000  
// 0000000   00000000  000   000  0000000    

+ (void) send:(id)msg win:(Win*)win
{
    View* targetView = win.view;
    
    NSString* payload;
    
    if ([msg isKindOfClass:[NSString class]])
    {
        payload = [NSString stringWithFormat:@"\"%@\"", msg];
    }
    else
    {
        payload = [NSString stringWithFormat:@"{name:\"%@\", args:[%@]}", [msg objectForKey:@"name"], [msg objectForKey:@"args"]];
    }
    
    NSLog(@"▸ %@", payload);
    id script = [NSString stringWithFormat:@"window.kakao.receive(%@)", payload];

    [targetView evaluateJavaScript:script completionHandler:nil];
}

@end