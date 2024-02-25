// 00     00   0000000   000  000   000  
// 000   000  000   000  000  0000  000  
// 000000000  000000000  000  000 0 000  
// 000 0 000  000   000  000  000  0000  
// 000   000  000   000  000  000   000  

#include <iostream>
#include <objc/objc-runtime.h>

id  operator"" _cls(const char *s, std::size_t) { return (id)objc_getClass(s); }
SEL operator"" _sel(const char *s, std::size_t) { return sel_registerName(s); }

using namespace std;

int main(int argc, char ** argv)
{
    for (int i = 1; i < argc; i++) 
    {
        cout << i-1 << ": " << argv[i] << endl;
    }
    
    // [[App new] run]
    
    id app = ((id(*)(id, SEL))objc_msgSend)("App"_cls, "new"_sel);
    ((void(*)(id, SEL))objc_msgSend)(app, "run"_sel);

    return 0;
}