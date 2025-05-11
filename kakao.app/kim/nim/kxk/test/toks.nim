import ../toks

template t(a:string, b:seq[Tkn]) = testCmp(a, tknz(a), b, instantiationInfo())
suite "toks": 
    t("", @[])
    # t "1"  %(1)
    # t "hello  world"  %({"hello": "world"}.toTable)