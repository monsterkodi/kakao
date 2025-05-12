import ../toks
import parseutils

template t(a:string, b:seq[seq[Tkn]]) = testCmp(a, toks(a), b, instantiationInfo())

template n(a:string, b:seq[seq[Tkn]]) = testCmp(a, nums(kseg(a), toks(kseg(a))), b, instantiationInfo())
suite "toks": 
    test "$": 
        check $tkn(◂number, 0, 1, 2) == "tkn(◂number 0 0 1 2)"
    test "tknz": 
        t("", default(seq[seq[Tkn]]))
        t("hello", @[@[tkn(◂text, 0, 5, 0, 0)]])
        t("hello  world", @[@[tkn(◂text, 0, 5, 0, 0), tkn(◂text, 7, 12, 0, 7)]])
        t("hello  world bla", @[@[tkn(◂text, 0, 5, 0, 0), tkn(◂text, 7, 12, 0, 7), tkn(◂text, 13, 16, 0, 13)]])
        t("hi\nthere!", @[@[tkn(◂text, 0, 2, 0, 0)], @[tkn(◂text, 3, 9, 1, 0)]])
        t("\n\n@\n\n\n@", @[@[tkn(◂text, 2, 3, 2, 0)], @[tkn(◂text, 6, 7, 5, 0)]])
        t("a\n  b  c\n  d\n  \ne", @[@[tkn(◂text, 0, 1, 0, 0)], @[tkn(◂text, 4, 5, 1, 2), tkn(◂text, 7, 8, 1, 6)], @[tkn(◂text, 11, 12, 2, 2)], @[tkn(◂text, 16, 17, 4, 0)]])
    test "nums": 
        n("abc 123 4.5 def", @[@[tkn(◂text, 0, 3, 0, 0), tkn(◂number, 4, 7, 0, 4), tkn(◂number, 8, 11, 0, 8), tkn(◂text, 12, 15, 0, 12)]])
        # n currentSourcePath().readFile() [[tkn(◂text 0 3 0 0)]]
        let s = "012334567 012334567 a b c d e f g h i j k l m n o p q r s t u v w x y z"
        var t = ""
        for l in 0..1000: 
            for i in 0..80: 
                (t &= s[rand((s.len - 1))])
            (t &= "\n")
        # log t
        let segs = kseg(t)
        profileStart("toks")
        var tkns = toks(segs)
        profileStop("toks")
        profileStart("nums")
        tkns = nums(segs, tkns)
        profileStop("nums")
        var number : float
        for tknl in tkns: 
            for tkn in tknl: 
                let w = segs[tkn.s..<tkn.e].join("")
                if (w != t[tkn.s..<tkn.e]): fail()
                if (tkn.t == ◂number): 
                    if (w.parseFloat(number) == 0): fail()
        # fail()