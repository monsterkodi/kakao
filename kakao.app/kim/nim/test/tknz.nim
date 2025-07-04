# █████████  ███   ███  ███   ███  ███████
#    ███     ███  ███   ████  ███     ███ 
#    ███     ███████    ███ █ ███    ███  
#    ███     ███  ███   ███  ████   ███   
#    ███     ███   ███  ███   ███  ███████
import ../tknz

template t(a:string, b:seq[Token]) = testCmp(a, tokenize(a, "nim"), b, instantiationInfo())

template l(a:string, b:seq[Token]) = testCmp(a, tokenize(a, "lua"), b, instantiationInfo())

proc tk(str:string, tok:tok, line:int, col:int) : Token = Token(str:str, tok:tok, line:line, col:col)
suite "tknz": 
    test "empty": 
        t("", default(seq[Token]))
        t(" ", default(seq[Token]))
    test "single line": 
        t("a", @[tk("a", ◂name, 0, 0)])
        t("    a", @[tk("a", ◂name, 0, 4)])
        t("a = b", @[tk("a", ◂name, 0, 0), tk("=", ◂assign, 0, 2), tk("b", ◂name, 0, 4)])
        t("a == b", @[tk("a", ◂name, 0, 0), tk("==", ◂equal, 0, 2), tk("b", ◂name, 0, 5)])
        t("a != b", @[tk("a", ◂name, 0, 0), tk("!=", ◂not_equal, 0, 2), tk("b", ◂name, 0, 5)])
        t("a >= b", @[tk("a", ◂name, 0, 0), tk(">=", ◂greater_equal, 0, 2), tk("b", ◂name, 0, 5)])
        t("a <= b", @[tk("a", ◂name, 0, 0), tk("<=", ◂less_equal, 0, 2), tk("b", ◂name, 0, 5)])
        t("a < b ; c > d", @[tk("a", ◂name, 0, 0), tk("<", ◂less, 0, 2), tk("b", ◂name, 0, 4), tk(";", ◂semicolon, 0, 6), tk("c", ◂name, 0, 8), tk(">", ◂greater, 0, 10), tk("d", ◂name, 0, 12)])
        t("a_c, d23", @[tk("a_c", ◂name, 0, 0), tk(",", ◂comma, 0, 3), tk("d23", ◂name, 0, 5)])
        t("if true", @[tk("if", ◂if, 0, 0), tk("true", ◂true, 0, 3)])
        t("iforintruefalse", @[tk("iforintruefalse", ◂name, 0, 0)])
        t("ifor intrue falselse", @[tk("ifor", ◂name, 0, 0), tk("intrue", ◂name, 0, 5), tk("falselse", ◂name, 0, 12)])
    # ██     ██  ███   ███  ███      █████████  ███
    # ███   ███  ███   ███  ███         ███     ███
    # █████████  ███   ███  ███         ███     ███
    # ███ █ ███  ███   ███  ███         ███     ███
    # ███   ███   ███████   ███████     ███     ███
    test "multi line": 
        t("a\nb\n1\nfalse", @[tk("a", ◂name, 0, 0), tk("", ◂indent, 1, 0), tk("b", ◂name, 1, 0), tk("", ◂indent, 2, 0), tk("1", ◂number, 2, 0), tk("", ◂indent, 3, 0), tk("false", ◂false, 3, 0)])
        t("if false\n    null", @[tk("if", ◂if, 0, 0), tk("false", ◂false, 0, 3), tk("    ", ◂indent, 1, 0), tk("null", ◂null, 1, 4)])
        t("for i in l\n    ⮐  i", @[tk("for", ◂for, 0, 0), tk("i", ◂name, 0, 4), tk("in", ◂in, 0, 6), tk("l", ◂name, 0, 9), tk("    ", ◂indent, 1, 0), tk("⮐", ◂return, 1, 4), tk("i", ◂name, 1, 7)])
        t("for x,y in l\n  if x ➜ y\n  else z", @[tk("for", ◂for, 0, 0), tk("x", ◂name, 0, 4), tk(",", ◂comma, 0, 5), tk("y", ◂name, 0, 6), tk("in", ◂in, 0, 8), tk("l", ◂name, 0, 11), tk("  ", ◂indent, 1, 0), tk("if", ◂if, 1, 2), tk("x", ◂name, 1, 5), tk("➜", ◂then, 1, 7), tk("y", ◂name, 1, 9), tk("  ", ◂indent, 2, 0), tk("else", ◂else, 2, 2), tk("z", ◂name, 2, 7)])
        t("if\n   \n   \n  true\n        \n   \n    yes\n \n  \n \n     \n  2   \n \n   \n \n    3", @[tk("if", ◂if, 0, 0), tk("  ", ◂indent, 3, 0), tk("true", ◂true, 3, 2), tk("    ", ◂indent, 6, 0), tk("yes", ◂name, 6, 4), tk("  ", ◂indent, 11, 0), tk("2", ◂number, 11, 2), tk("    ", ◂indent, 15, 0), tk("3", ◂number, 15, 4)])
    #  ███████  █████████  ████████   ███  ███   ███   ███████    ███████
    # ███          ███     ███   ███  ███  ████  ███  ███        ███     
    # ███████      ███     ███████    ███  ███ █ ███  ███  ████  ███████ 
    #      ███     ███     ███   ███  ███  ███  ████  ███   ███       ███
    # ███████      ███     ███   ███  ███  ███   ███   ███████   ███████ 
    test "strings": 
        t("''", @[tk("\'", ◂string_start, 0, 0), tk("\'", ◂string_end, 0, 1)])
        t("'\\\\'", @[tk("\'", ◂string_start, 0, 0), tk("\\\\", ◂string, 0, 1), tk("\'", ◂string_end, 0, 3)])
        t("'\\''", @[tk("\'", ◂string_start, 0, 0), tk("\\'", ◂string, 0, 1), tk("\'", ◂string_end, 0, 3)])
        t("a = 'if'", @[tk("a", ◂name, 0, 0), tk("=", ◂assign, 0, 2), tk("'", ◂string_start, 0, 4), tk("if", ◂string, 0, 5), tk("'", ◂string_end, 0, 7)])
        t("'if then it\\'s = 2'", @[tk("'", ◂string_start, 0, 0), tk("if then it\\'s = 2", ◂string, 0, 1), tk("'", ◂string_end, 0, 18)])
        t("\"\"", @[tk("\"", ◂string_start, 0, 0), tk("\"", ◂string_end, 0, 1)])
        t("(\"\")", @[tk("(", ◂paren_open, 0, 0), tk("\"", ◂string_start, 0, 1), tk("\"", ◂string_end, 0, 2), tk(")", ◂paren_close, 0, 3)])
        t("\"'\"", @[tk("\"", ◂string_start, 0, 0), tk("'", ◂string, 0, 1), tk("\"", ◂string_end, 0, 2)])
        t("\"'\" \"'\\\"'\"", @[tk("\"", ◂string_start, 0, 0), tk("'", ◂string, 0, 1), tk("\"", ◂string_end, 0, 2), tk("\"", ◂string_start, 0, 4), tk("'\\\"'", ◂string, 0, 5), tk("\"", ◂string_end, 0, 9)])
        t("""rndr("")""", @[tk("rndr", ◂name, 0, 0), tk("(", ◂paren_open, 0, 4), tk("\"", ◂string_start, 0, 5), tk("\"", ◂string_end, 0, 6), tk(")", ◂paren_close, 0, 7)])
        t("\"\"\"triple\"\"\"", @[tk("\"\"\"", ◂string_start, 0, 0), tk("triple", ◂string, 0, 3), tk("\"\"\"", ◂string_end, 0, 9)])
        t("\"\"\"\n\n\"\"\"", @[tk("\"\"\"", ◂string_start, 0, 0), tk("\n\n", ◂string, 0, 3), tk("\"\"\"", ◂string_end, 2, 0)])
        t("s = \"\"\"\nl1 #" & "{1}\nl2 #" & "{2}\"\"\"", @[tk("s", ◂name, 0, 0), tk("=", ◂assign, 0, 2), tk("\"\"\"", ◂string_start, 0, 4), tk("\nl1 ", ◂string, 0, 7), tk("#" & "{", ◂stripol_start, 1, 3), tk("1", ◂number, 1, 5), tk("}", ◂stripol_end, 1, 6), tk("\nl2 ", ◂string, 1, 7), tk("#" & "{", ◂stripol_start, 2, 3), tk("2", ◂number, 2, 5), tk("}", ◂stripol_end, 2, 6), tk("\"\"\"", ◂string_end, 2, 7)])
        t("a & b", @[tk("a", ◂name, 0, 0), tk("&", ◂ampersand, 0, 2), tk("b", ◂name, 0, 4)])
    #  ███████  █████████  ████████   ███  ████████    ███████   ███    
    # ███          ███     ███   ███  ███  ███   ███  ███   ███  ███    
    # ███████      ███     ███████    ███  ████████   ███   ███  ███    
    #      ███     ███     ███   ███  ███  ███        ███   ███  ███    
    # ███████      ███     ███   ███  ███  ███         ███████   ███████
    test "stripol": 
        t("'#" & "{}'", @[tk("'", ◂string_start, 0, 0), tk("#" & "{}", ◂string, 0, 1), tk("'", ◂string_end, 0, 4)])
        t("\"#" & "{}\"", @[tk("\"", ◂string_start, 0, 0), tk("#" & "{", ◂stripol_start, 0, 1), tk("}", ◂stripol_end, 0, 3), tk("\"", ◂string_end, 0, 4)])
        t("\"#" & "{a}\"", @[tk("\"", ◂string_start, 0, 0), tk("#" & "{", ◂stripol_start, 0, 1), tk("a", ◂name, 0, 3), tk("}", ◂stripol_end, 0, 4), tk("\"", ◂string_end, 0, 5)])
        t("\"\"\"#" & "{a}\"\"\"", @[tk("\"\"\"", ◂string_start, 0, 0), tk("#" & "{", ◂stripol_start, 0, 3), tk("a", ◂name, 0, 5), tk("}", ◂stripol_end, 0, 6), tk("\"\"\"", ◂string_end, 0, 7)])
        t("\"head #" & "{a}\"", @[tk("\"", ◂string_start, 0, 0), tk("head ", ◂string, 0, 1), tk("#" & "{", ◂stripol_start, 0, 6), tk("a", ◂name, 0, 8), tk("}", ◂stripol_end, 0, 9), tk("\"", ◂string_end, 0, 10)])
        t("\"#" & "{abc}\"", @[tk("\"", ◂string_start, 0, 0), tk("#" & "{", ◂stripol_start, 0, 1), tk("abc", ◂name, 0, 3), tk("}", ◂stripol_end, 0, 6), tk("\"", ◂string_end, 0, 7)])
        t("\"#" & "{a}#" & "{b}\"", @[tk("\"", ◂string_start, 0, 0), tk("#" & "{", ◂stripol_start, 0, 1), tk("a", ◂name, 0, 3), tk("}", ◂stripol_end, 0, 4), tk("#" & "{", ◂stripol_start, 0, 5), tk("b", ◂name, 0, 7), tk("}", ◂stripol_end, 0, 8), tk("\"", ◂string_end, 0, 9)])
        t("s = \"num #" & "{1+2} end\"", @[tk("s", ◂name, 0, 0), tk("=", ◂assign, 0, 2), tk("\"", ◂string_start, 0, 4), tk("num ", ◂string, 0, 5), tk("#" & "{", ◂stripol_start, 0, 9), tk("1", ◂number, 0, 11), tk("+", ◂plus, 0, 12), tk("2", ◂number, 0, 13), tk("}", ◂stripol_end, 0, 14), tk(" end", ◂string, 0, 15), tk("\"", ◂string_end, 0, 19)])
        t("s = \"\"\"num #" & "{1+2} end\"\"\"", @[tk("s", ◂name, 0, 0), tk("=", ◂assign, 0, 2), tk("\"\"\"", ◂string_start, 0, 4), tk("num ", ◂string, 0, 7), tk("#" & "{", ◂stripol_start, 0, 11), tk("1", ◂number, 0, 13), tk("+", ◂plus, 0, 14), tk("2", ◂number, 0, 15), tk("}", ◂stripol_end, 0, 16), tk(" end", ◂string, 0, 17), tk("\"\"\"", ◂string_end, 0, 21)])
        t("s = \"(#" & "{s}#" & "{e})\"", @[tk("s", ◂name, 0, 0), tk("=", ◂assign, 0, 2), tk("\"", ◂string_start, 0, 4), tk("(", ◂string, 0, 5), tk("#" & "{", ◂stripol_start, 0, 6), tk("s", ◂name, 0, 8), tk("}", ◂stripol_end, 0, 9), tk("#" & "{", ◂stripol_start, 0, 10), tk("e", ◂name, 0, 12), tk("}", ◂stripol_end, 0, 13), tk(")", ◂string, 0, 14), tk("\"", ◂string_end, 0, 15)])
        t("&\"{s}\"", @[tk("\"", ◂string_start, 0, 1), tk("{", ◂stripol_start, 0, 2), tk("s", ◂name, 0, 3), tk("}", ◂stripol_end, 0, 4), tk("\"", ◂string_end, 0, 5)])
    # ███████    ████████    ███████    ███████  ███   ███  ████████  █████████   ███████
    # ███   ███  ███   ███  ███   ███  ███       ███  ███   ███          ███     ███     
    # ███████    ███████    █████████  ███       ███████    ███████      ███     ███████ 
    # ███   ███  ███   ███  ███   ███  ███       ███  ███   ███          ███          ███
    # ███████    ███   ███  ███   ███   ███████  ███   ███  ████████     ███     ███████ 
    test "brackets  ": 
        t("{()}[{}]", @[tk("{", ◂bracket_open, 0, 0), tk("(", ◂paren_open, 0, 1), tk(")", ◂paren_close, 0, 2), tk("}", ◂bracket_close, 0, 3), tk("[", ◂square_open, 0, 4), tk("{", ◂bracket_open, 0, 5), tk("}", ◂bracket_close, 0, 6), tk("]", ◂square_close, 0, 7)])
        t(")}]", @[tk(")", ◂paren_close, 0, 0), tk("}", ◂bracket_close, 0, 1), tk("]", ◂square_close, 0, 2)])
        t("[{(", @[tk("[", ◂square_open, 0, 0), tk("{", ◂bracket_open, 0, 1), tk("(", ◂paren_open, 0, 2)])
        t("a[0]", @[tk("a", ◂name, 0, 0), tk("[", ◂square_open, 0, 1), tk("0", ◂number, 0, 2), tk("]", ◂square_close, 0, 3)])
    test "mod": 
        t("setControlCHook(() {.noconv.} ->", @[tk("setControlCHook", ◂name, 0, 0), tk("(", ◂paren_open, 0, 15), tk("(", ◂paren_open, 0, 16), tk(")", ◂paren_close, 0, 17), tk("{.noconv.}", ◂mod, 0, 19), tk("->", ◂func, 0, 30)])
    #  ███████   ███████   ██     ██  ██     ██  ████████  ███   ███  █████████   ███████
    # ███       ███   ███  ███   ███  ███   ███  ███       ████  ███     ███     ███     
    # ███       ███   ███  █████████  █████████  ███████   ███ █ ███     ███     ███████ 
    # ███       ███   ███  ███ █ ███  ███ █ ███  ███       ███  ████     ███          ███
    #  ███████   ███████   ███   ███  ███   ███  ████████  ███   ███     ███     ███████ 
    test "comments": 
        t("#", @[tk("#", ◂comment_start, 0, 0)])
        t("# if true", @[tk("#", ◂comment_start, 0, 0), tk(" if true", ◂comment, 0, 1)])
        t("### if\n    true###", @[tk("###", ◂comment_start, 0, 0), tk(" if\n    true", ◂comment, 0, 3), tk("###", ◂comment_end, 1, 8)])
        t("\n\n# comment\n\n", @[tk("#", ◂comment_start, 2, 0), tk(" comment", ◂comment, 2, 1), tk("", ◂indent, 3, 0)])
        t("""
# ███   ███  ███  ██     ██
# ███  ███   ███  ███   ███
# ███████    ███  █████████
# ███  ███   ███  ███ █ ███
# ███   ███  ███  ███   ███
""", @[tk("#", ◂comment_start, 0, 0), tk(" ███   ███  ███  ██     ██", ◂comment, 0, 1), tk("", ◂indent, 1, 0), tk("#", ◂comment_start, 1, 0), tk(" ███  ███   ███  ███   ███", ◂comment, 1, 1), tk("", ◂indent, 2, 0), tk("#", ◂comment_start, 2, 0), tk(" ███████    ███  █████████", ◂comment, 2, 1), tk("", ◂indent, 3, 0), tk("#", ◂comment_start, 3, 0), tk(" ███  ███   ███  ███ █ ███", ◂comment, 3, 1), tk("", ◂indent, 4, 0), tk("#", ◂comment_start, 4, 0), tk(" ███   ███  ███  ███   ███", ◂comment, 4, 1)])
    #  ███████   ████████   ████████  ████████    ███████   █████████   ███████   ████████    ███████
    # ███   ███  ███   ███  ███       ███   ███  ███   ███     ███     ███   ███  ███   ███  ███     
    # ███   ███  ████████   ███████   ███████    █████████     ███     ███   ███  ███████    ███████ 
    # ███   ███  ███        ███       ███   ███  ███   ███     ███     ███   ███  ███   ███       ███
    #  ███████   ███        ████████  ███   ███  ███   ███     ███      ███████   ███   ███  ███████ 
    test "operators": 
        t("a += 123", @[tk("a", ◂name, 0, 0), tk("+=", ◂plus_assign, 0, 2), tk("123", ◂number, 0, 5)])
        t("b -= 456", @[tk("b", ◂name, 0, 0), tk("-=", ◂minus_assign, 0, 2), tk("456", ◂number, 0, 5)])
        t("x /= y", @[tk("x", ◂name, 0, 0), tk("/=", ◂divide_assign, 0, 2), tk("y", ◂name, 0, 5)])
        t("x *= y", @[tk("x", ◂name, 0, 0), tk("*=", ◂multiply_assign, 0, 2), tk("y", ◂name, 0, 5)])
        t("x != y", @[tk("x", ◂name, 0, 0), tk("!=", ◂not_equal, 0, 2), tk("y", ◂name, 0, 5)])
        t("s &= v", @[tk("s", ◂name, 0, 0), tk("&=", ◂ampersand_assign, 0, 2), tk("v", ◂name, 0, 5)])
        t("s ?= v", @[tk("s", ◂name, 0, 0), tk("?=", ◂qmark_assign, 0, 2), tk("v", ◂name, 0, 5)])
    # ███   ███  ███   ███  ██     ██  ███████    ████████  ████████    ███████
    # ████  ███  ███   ███  ███   ███  ███   ███  ███       ███   ███  ███     
    # ███ █ ███  ███   ███  █████████  ███████    ███████   ███████    ███████ 
    # ███  ████  ███   ███  ███ █ ███  ███   ███  ███       ███   ███       ███
    # ███   ███   ███████   ███   ███  ███████    ████████  ███   ███  ███████ 
    test "numbers": 
        t("123", @[tk("123", ◂number, 0, 0)])
        t("1234", @[tk("1234", ◂number, 0, 0)])
        t("0xff", @[tk("0xff", ◂number, 0, 0)])
        t("0xFF", @[tk("0xFF", ◂number, 0, 0)])
        t("3.14", @[tk("3.14", ◂number, 0, 0)])
        t("3.14", @[tk("3.14", ◂number, 0, 0)])
        t("1e5", @[tk("1e5", ◂number, 0, 0)])
        t("1e+5", @[tk("1e+5", ◂number, 0, 0)])
        t("1e-5", @[tk("1e-5", ◂number, 0, 0)])
        t("0b101", @[tk("0b101", ◂number, 0, 0)])
        t("0b101", @[tk("0b101", ◂number, 0, 0)])
        t("0o755", @[tk("0o755", ◂number, 0, 0)])
        t("0o755", @[tk("0o755", ◂number, 0, 0)])
    test "keywords": 
        t("for ◂for in ◂in", @[tk("for", ◂for, 0, 0), tk("◂for", ◂name, 0, 4), tk("in", ◂in, 0, 9), tk("◂in", ◂name, 0, 12)])
        t("r.▸for", @[tk("r", ◂name, 0, 0), tk(".", ◂dot, 0, 1), tk("▸for", ◂name, 0, 2)])
        t("quote", @[tk("quote", ◂quote, 0, 0)])
        t("quote do:", @[tk("quote", ◂quote, 0, 0)])
        l("for key val of opt", @[tk("for", ◂for, 0, 0), tk("key", ◂name, 0, 4), tk("val", ◂name, 0, 8), tk("of", ◂of, 0, 12), tk("opt", ◂name, 0, 15)])
    # ███████     ███████   █████████   ███████
    # ███   ███  ███   ███     ███     ███     
    # ███   ███  ███   ███     ███     ███████ 
    # ███   ███  ███   ███     ███          ███
    # ███████     ███████      ███     ███████ 
    test "dots": 
        t(".", @[tk(".", ◂dot, 0, 0)])
        t("..", @[tk("..", ◂doubledot, 0, 0)])
        t("...", @[tk("...", ◂tripledot, 0, 0)])
        t("..<", @[tk("...", ◂tripledot, 0, 0)])
        t("for i in 0..10", @[tk("for", ◂for, 0, 0), tk("i", ◂name, 0, 4), tk("in", ◂in, 0, 6), tk("0", ◂number, 0, 9), tk("..", ◂doubledot, 0, 10), tk("10", ◂number, 0, 12)])
    # █████████  ████████   ███████  █████████   ███████
    #    ███     ███       ███          ███     ███     
    #    ███     ███████   ███████      ███     ███████ 
    #    ███     ███            ███     ███          ███
    #    ███     ████████  ███████      ███     ███████ 
    test "tests": 
        t("▸ tets", @[tk("▸ tets", ◂test, 0, 0)])
        t("    ▸ sect", @[tk("▸ sect", ◂test, 0, 4)])
        t("    a ▸ 2", @[tk("a", ◂name, 0, 4), tk("▸", ◂test, 0, 6), tk("2", ◂number, 0, 8)])
    test "types": 
        t("a◇string", @[tk("a", ◂name, 0, 0), tk("◇", ◂val_type, 0, 1), tk("string", ◂name, 0, 2)])
    test "export*": 
        t("exp* =", @[tk("exp*", ◂name, 0, 0), tk("=", ◂assign, 0, 5)])
        t("exp* :", @[tk("exp*", ◂name, 0, 0), tk(":", ◂colon, 0, 5)])
        t("class exp*\n    ", @[tk("class", ◂class, 0, 0), tk("exp*", ◂name, 0, 6)])
    # ███   ███   ███████  ████████
    # ███   ███  ███       ███     
    # ███   ███  ███████   ███████ 
    # ███   ███       ███  ███     
    #  ███████   ███████   ████████
    test "use": 
        t("use std ▪ unittest", @[tk("use", ◂use, 0, 0), tk("std", ◂name, 0, 4), tk("▪", ◂name, 0, 8), tk("unittest", ◂name, 0, 10)])
        t("use ../rndr", @[tk("use", ◂use, 0, 0), tk("..", ◂doubledot, 0, 4), tk("/", ◂divide, 0, 6), tk("rndr", ◂name, 0, 7)])
        t("use std ▪ os logging\nuse kommon", @[tk("use", ◂use, 0, 0), tk("std", ◂name, 0, 4), tk("▪", ◂name, 0, 8), tk("os", ◂name, 0, 10), tk("logging", ◂name, 0, 13), tk("", ◂indent, 1, 0), tk("use", ◂use, 1, 0), tk("kommon", ◂name, 1, 4)])
    test "verbatim": 
        t("proc exp* (", @[tk("proc exp* (", ◂verbatim, 0, 0)])
        t("import ../../rel/[s1, s2]", @[tk("import ../../rel/[s1, s2]", ◂verbatim, 0, 0)])
    test "lua": 
        l("str:match()", @[tk("str", ◂name, 0, 0), tk(":", ◂colon, 0, 3), tk("match", ◂name, 0, 4), tk("(", ◂paren_open, 0, 9), tk(")", ◂paren_close, 0, 10)])
        l("str∙match()", @[tk("str:match", ◂name, 0, 0), tk("(", ◂paren_open, 0, 9), tk(")", ◂paren_close, 0, 10)])
        l("rtrim():ltrim()", @[tk("rtrim", ◂name, 0, 0), tk("(", ◂paren_open, 0, 5), tk(")", ◂paren_close, 0, 6), tk(":", ◂colon, 0, 7), tk("ltrim", ◂name, 0, 8), tk("(", ◂paren_open, 0, 13), tk(")", ◂paren_close, 0, 14)])
        l("rtrim()∙ltrim()", @[tk("rtrim", ◂name, 0, 0), tk("(", ◂paren_open, 0, 5), tk(")", ◂paren_close, 0, 6), tk(":", ◂colon, 0, 7), tk("ltrim", ◂name, 0, 8), tk("(", ◂paren_open, 0, 13), tk(")", ◂paren_close, 0, 14)])