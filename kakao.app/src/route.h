/*
  00000000    0000000   000   000  000000000  00000000
  000   000  000   000  000   000     000     000     
  0000000    000   000  000   000     000     0000000 
  000   000  000   000  000   000     000     000     
  000   000   0000000    0000000      000     00000000
*/

#import <Cocoa/Cocoa.h>
#import <WebKit/WebKit.h>

typedef void (^Callback)(id, NSString*);
typedef void (^CallbackN)(id _Nullable, NSError * _Nullable);

@interface Route : NSObject
{
}

+ (void) send:(NSDictionary*)msg;       // send application events to js in web view
+ (void) message:(WKScriptMessage*)msg; // message recieved from js in web view
// message recieved from js in web view that expects a callback
+ (void) request:(WKScriptMessage*)msg callback:(Callback)callback; 

@end
