/*
  00000000    0000000   000   000  000000000  00000000
  000   000  000   000  000   000     000     000     
  0000000    000   000  000   000     000     0000000 
  000   000  000   000  000   000     000     000     
  000   000   0000000    0000000      000     00000000
*/

#import "route.h"
#import "bundle.h"

void sendCallback(id _Nullable msg, NSError* _Nullable error)
{
    NSLog(@"callback %@", msg);
}

@implementation Route

+ (void) request:(WKScriptMessage*)msg callback:(Callback)callback
{
    NSLog(@"%@ %@", msg.name, msg.body);
    
    id reply = @"???";
    
    NSString* route = [msg.body valueForKey:@"route"];
    NSArray*  args  = [msg.body valueForKey:@"args"];

         if (false) {}
    else if ([route hasPrefix:@"bundle."]) { reply = [Route bundle:[route substringFromIndex:7] args:args]; }
    else if ([route hasPrefix:@"window."]) { reply = [Route window:[route substringFromIndex:7] args:args]; }
    else if ([route hasPrefix:@"fs."    ]) { reply = [Route fs:    [route substringFromIndex:3] args:args]; }
    else if ([route hasPrefix:@"test."  ]) { reply = [Route test:  [route substringFromIndex:5] args:args]; }
    
    callback(reply, nil);
}

+ (id) fs:(NSString*)req args:(NSArray*)args
{
    if ([req isEqualToString:@"readText"   ])
    {
        NSString* path = [args objectAtIndex:0];
        NSLog(@"readText %@", path);
        return [NSString stringWithContentsOfFile:path encoding:NSUTF8StringEncoding error:nil];
    }
    
    return nil;
}

+ (id) bundle:(NSString*)req args:(NSArray*)args
{
    return [Bundle performSelector:sel_getUid([req cStringUsingEncoding:NSUTF8StringEncoding])];
}

+ (id) window:(NSString*)req args:(NSArray*)args
{
    id app    = [NSApplication sharedApplication];
    id window = [app mainWindow];
    
    if ([req isEqualToString:@"close"   ]) { [window close];           return nil; }
    if ([req isEqualToString:@"minimize"]) { [window miniaturize:nil]; return nil; }
    if ([req isEqualToString:@"maximize"]) { [window zoom:nil];        return nil; }
    if ([req isEqualToString:@"snapshot"]) { [window snapshot:nil];    return nil; }
    
    return nil;
}

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

+ (void) message:(WKScriptMessage*)msg
{
    NSLog(@"%@ %@", msg.name, msg.body);
 
    NSString* route = [msg.body valueForKey:@"route"];
    NSArray*  args  = [msg.body valueForKey:@"args"];
    
    if ([route hasPrefix:@"window."])
    {
        [Route window:[route substringFromIndex:7] args:args];
    }
}

+ (void) callback:(id)msg error:(NSError*)error
{
}

+ (void) send:(NSDictionary*)msg toView:(WKWebView*)view
{
    id script = [NSString stringWithFormat:@"window.kakao.receive(%@)", msg];
    
    [view evaluateJavaScript:script completionHandler:(CallbackN)&sendCallback];
}

@end