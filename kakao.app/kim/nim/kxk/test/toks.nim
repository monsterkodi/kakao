import ../toks

template t(a:string, b:seq[Tkn]) = testCmp(a, toks(a), b, instantiationInfo())
suite "toks": 
    test "tknz": 
        t("", default(seq[Tkn]))
        # t "1"  %(1)
        # t "hello  world"  %({"hello": "world"}.toTable)