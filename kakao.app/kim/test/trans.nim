# █████████  ████████    ███████   ███   ███   ███████      █████████  ████████   ███████  █████████  
#    ███     ███   ███  ███   ███  ████  ███  ███              ███     ███       ███          ███     
#    ███     ███████    █████████  ███ █ ███  ███████          ███     ███████   ███████      ███     
#    ███     ███   ███  ███   ███  ███  ████       ███         ███     ███            ███     ███     
#    ███     ███   ███  ███   ███  ███   ███  ███████          ███     ████████  ███████      ███     

import std/[pegs, strutils, strformat, unittest]
import ../kommon
import ../trans

suite "trans":

    test "pose":
        
        check pose("log ''") == "echo \"\""
        check pose("log()") == "echo()"
        check pose("log 'hello'") == "echo \"hello\""
        check pose("log('hello')") == "echo(\"hello\")"
        check pose("log 'hello' ; log 'world'") == "echo \"hello\" ; echo \"world\""
        check pose("log 'a';log 'b'") == "echo \"a\";echo \"b\""
        check pose("▸ suite") == "suite \"suite\":"
        check pose("    ▸ test") == "    test \"test\":"
        check pose("### comment") == "#[ comment"
        check pose("a=\"''\"") == "a=\"''\""
        check pose("proc logToEcho") == "proc logToEcho"
        check pose("let pat = peg\"\"\"") == "let pat = peg\"\"\""
        check pose("if true") == "if true:"
        check pose("if true:") == "if true:"
        check pose("elif true") == "elif true:"
        check pose("elif true:") == "elif true:"
        check pose("else") == "else:"
        check pose("else:") == "else:"
        check pose("while true") == "while true:"
        check pose("while true:") == "while true:"
        check pose("for i in [0..20]") == "for i in [0..20]:"
        check pose("⮐  42") == "return  42"
        
    test "stringSegments":
    
        check stringSegments("none") == @["none"]
        check stringSegments("n\"one\"") == @["n", "\"one\""]
        check stringSegments("n\"one\" and \"two\" and \"three\" end") == @[
            "n", "\"one\"", " and ", "\"two\"", " and ", "\"three\"", " end"]
        check stringSegments("escaped(\"\\\"\")") == @["escaped(", "\"\\\"\"", ")"]
        check stringSegments("\"'\"") == @["\"'\""]
        check stringSegments("'\"'") == @["'\"'"]
        check stringSegments("'\"'") == @["'\"'"]
        check stringSegments("""'"\\''""") == @["\'\"\\\\\'"]
        check stringSegments("hello \"\"\"'world'\"\"\" !") == @["hello ", "\"\"\"'world'\"\"\"", " !"]
        
    test "statements":
    
        check statements(@["let a=1; let b=2; let c=3"]) == @[@["let a=1"], @[" let b=2"], @[" let c=3"]]
        
    test "deepEqual":
    
        check deepEqual(statements(@["let a=1; let b=2; let c=3"]), @[@["let a=1"], @[" let b=2"], @[" let c=3"]])
        check deepEqual(@{"a":1, "b":2}, @{"a":1, "b":2})
        check deepEqual((a:1, b:2), (a:1, b:2))
        check deepEqual(("a", 2), ("a", 2))

        check statements(@["let a=1; let b=2; let c=3"]) == @[@["let a=1"], @[" let b=2"], @[" let c=3"]]
        check @{"a":1, "b":2} ==  @{"a":1, "b":2}
        check (a:1, b:2) == (a:1, b:2)
        check ("a", 2) == ("a", 2)
        
        check @{"b":(("c", (4,5)), ((d:"e"), (5,6,)))} == @{"b":(("c", (4,5)), ((d:"e"), (5,6,)))}
        check deepEqual(@{"b":(("c", (4,5)), ((d:"e"), (5,6,)))}, @{"b":(("c", (4,5)), ((d:"e"), (5,6,)))})
        
    test "peg":
        
        let l = "log hello"
        var m = default array[20, string]
        
        check l.match(peg"{log}", m) == true
        check m[0] == "log" 
        
        m = default typeof m

        check l.match(peg"{ 'log' }", m) == true
        check m[0] == "log" 
        
        m = default typeof m
        
        check l.match(peg"{ 'log' }\s{.*}", m) == true
        check m[0] == "log" 
        check m[1] == "hello" 
        
        m = default typeof m
        
        check "▸ test".match(peg"^{'▸'\s*}{.*}$", m) == true
        check m[0] == "▸ " 
        check m[1] == "test" 

    test "string":
    
        var s = """
        a
        b
        """ 
        check s == "        a\n        b\n        "
        
        s = """"""""""""
        check s == "\"\"\"\"\"\""
        
        s = 
            "a"     & "\n" &
            "b"     & "\n" &
            "c" 
            
        check s == "a\nb\nc"

        s = 
            "a\n" &
            &"{1+1}\n" &
            "c"
            
        check s == "a\n2\nc"    
        
    # test "Edge cases":
    #     expect OverflowError:
    #         discard add(high(int), 1)
