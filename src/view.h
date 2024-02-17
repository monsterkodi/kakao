/*
  000   000  000  00000000  000   000  
  000   000  000  000       000 0 000  
   000 000   000  0000000   000000000  
     000     000  000       000   000  
      0      000  00000000  00     00  
*/

#import <Cocoa/Cocoa.h>
#import <WebKit/WebKit.h>

@interface View : WKWebView <WKScriptMessageHandler>
{
}

-(id)   init;
-(void) initScripting;
-(void) userContentController:(WKUserContentController *)ucc didReceiveScriptMessage:(WKScriptMessage *)msg;

@end