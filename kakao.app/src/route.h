/*
  00000000    0000000   000   000  000000000  00000000
  000   000  000   000  000   000     000     000     
  0000000    000   000  000   000     000     0000000 
  000   000  000   000  000   000     000     000     
  000   000   0000000    0000000      000     00000000
*/

#import <Cocoa/Cocoa.h>
#import <WebKit/WebKit.h>
#import "view.h"
#import "win.h"

@interface Route : NSObject

+ (void) emit:(id)msg;                                              // send string or object to js in web views of all windows
+ (void) emit:(NSString*)name arg:(id)arg;                          // send message with single argument to views of all windows
+ (void) emit:(NSString*)name args:(NSArray*)args;                  // send message with multiple arguments to views of all windows
            
+ (void) send:(id)msg win:(Win*)win;                                // send string or object to js in web view of win
+ (void) send:(NSString*)name arg:(id)arg win:(Win*)win;            // send message with single argument to a single window
+ (void) send:(NSString*)name args:(NSArray*)args win:(Win*)win;    // send message with multiple arguments to a single window

+ (void) message:(WKScriptMessage*)msg win:(Win*)win;                               // js in webview sent a message
+ (void) request:(WKScriptMessage*)msg callback:(Callback)callback win:(Win*)win;   //   ... and expects a callback

@end
