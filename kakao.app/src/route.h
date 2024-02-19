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

typedef void (^Callback)(id, NSString*);
typedef void (^CallbackN)(id _Nullable, NSError * _Nullable);

@interface Route : NSObject
{
}

+ (void) emit:(NSString*)event;           // send string to js in main web view
+ (void) send:(id)msg toView:(View*)view; // send object to js in web view
+ (void) message:(WKScriptMessage*)msg;   // message recieved from js in web view
// message recieved from js in web view that expects a callback
+ (void) request:(WKScriptMessage*)msg callback:(Callback)callback; 

@end
