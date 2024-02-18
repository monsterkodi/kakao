/*
  000   000  000  00000000  000   000  
  000   000  000  000       000 0 000  
   000 000   000  0000000   000000000  
     000     000  000       000   000  
      0      000  00000000  00     00  
*/

#import "view.h"
#import "bundle.h"

@implementation View

-(id) init
{
    WKWebViewConfiguration *config = [[WKWebViewConfiguration alloc] init];
    
    [[config preferences] setValue:@YES forKey:@"developerExtrasEnabled"];
    [[config preferences] setValue:@YES forKey:@"fullScreenEnabled"];
    [[config preferences] setValue:@YES forKey:@"javaScriptCanAccessClipboard"];
    [[config preferences] setValue:@YES forKey:@"DOMPasteAllowed"];
    [config setValue:@YES forKey:@"allowUniversalAccessFromFileURLs"];

    if (self = [super initWithFrame:CGRectMake(0,0,0,0) configuration:config])
    {
        [self setValue:@NO forKey:@"drawsBackground"];
    }
    
    [self initScripting];
    
    return self;
}

-(void) mouseDown:(NSEvent *)event 
{
    NSPoint   viewLoc = [self convertPoint:event.locationInWindow fromView:nil];
    NSString *docElem = [NSString stringWithFormat:@"document.elementFromPoint(%f, %f)", viewLoc.x, viewLoc.y];
    NSString *jsCode  = [NSString stringWithFormat:@"%@.classList.contains(\"app-drag-region\")", docElem];
    
    [self evaluateJavaScript:jsCode completionHandler:
        ^(id result, NSError * error) {
            if (error) NSLog(@"%@", error);
            else 
            {
                if ([[NSNumber numberWithInt:1] compare:result] == NSOrderedSame)
                {
                    NSLog(@"mouseDown performDragWithEvent %@", event);    
                    [self.window performWindowDragWithEvent:event];
                }
            }
    }];
    
    [super mouseDown:event];
}

-(void) initScripting
{
    WKUserContentController* ucc = [[self configuration] userContentController];
    
    [ucc addScriptMessageHandler:self name:@"kakao"];
    [ucc addScriptMessageHandlerWithReply:self contentWorld:[WKContentWorld pageWorld] name:@"kakao_request"];
}

- (void) userContentController:(WKUserContentController *)ucc didReceiveScriptMessage:(WKScriptMessage*)msg
{
    NSLog(@"%@ %@", msg.name, msg.body);
}

- (void) userContentController:(WKUserContentController *)ucc didReceiveScriptMessage:(WKScriptMessage*)msg replyHandler:(void (^)(id reply, NSString *errorMessage))replyHandler
{
    NSLog(@"%@ %@", msg.name, msg.body);
    
    id reply = @"???";
    
    NSDictionary* request = msg.body;
    NSString* route = [request valueForKey:@"route"];
    NSArray*  args  = [request valueForKey:@"args"];
    
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
    else if ([route compare:@"test.ping"] == NSOrderedSame)
    {
        reply = [NSString stringWithFormat:@"you say %@ you get pong!", [args objectAtIndex:0]];
    }
    else if ([route compare:@"test.struct"] == NSOrderedSame)
    {
        NSDictionary* dict = [NSMutableDictionary dictionary];
        [dict setObject:[NSString stringWithFormat:@"you sent %@", [args objectAtIndex:0]] forKey:@"input"];
        [dict setObject:[NSString stringWithString:@"you get this!"] forKey:@"output"];
        reply = dict;
    }
    
    replyHandler(reply, nil);
}

@end