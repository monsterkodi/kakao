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

    NSLog(@"%@ %@ %d", route, NSStringFromClass([route class]), [route hasPrefix:@"window"]);
        
    if ([route compare:@"Bundle.path"] == NSOrderedSame)
    {
        reply = [Bundle path];
    }
    else if ([route compare:@"fs.readText"] == NSOrderedSame)
    {
        NSString* path = [args objectAtIndex:0];
        NSLog(@"readText %@", path);
        reply = [NSString stringWithContentsOfFile:path encoding:NSUTF8StringEncoding error:nil];
    }
    else if ([route hasPrefix:@"window."])
    {
        reply = [Route windowRequest:[route substringFromIndex:7]];
    }
    else if ([route compare:@"test.ping"] == NSOrderedSame)
    {
        reply = [NSString stringWithFormat:@"you say %@ you get pong!", [args objectAtIndex:0]];
    }
    else if ([route compare:@"test.struct"] == NSOrderedSame)
    {
        id dict = [NSMutableDictionary dictionary];
        [dict setObject:[NSString stringWithFormat:@"you sent %@", [args objectAtIndex:0]] forKey:@"input"];
        [dict setObject:@"you get this!" forKey:@"output"];
        reply = dict;
    }
    
    callback(reply, nil);
}

+ (id) windowRequest:(NSString*)req
{
    id app    = [NSApplication sharedApplication];
    id window = [app mainWindow];
    
    if ([req isEqualToString:@"close"   ]) { [window close];           return nil; }
    if ([req isEqualToString:@"minimize"]) { [window miniaturize:nil]; return nil; }
    if ([req isEqualToString:@"maximize"]) { [window zoom:nil];        return nil; }
}

+ (void) message:(WKScriptMessage*)msg
{
    NSLog(@"%@ %@", msg.name, msg.body);
 
    NSString* route = [msg.body valueForKey:@"route"];
    NSArray*  args  = [msg.body valueForKey:@"args"];
    
    if ([route hasPrefix:@"window."])
    {
        [Route windowRequest:[route substringFromIndex:7]];
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