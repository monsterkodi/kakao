import ../toks

template t(a:string, b:seq[seq[Tkn]]) = testCmp(a, toks(a), b, instantiationInfo())
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