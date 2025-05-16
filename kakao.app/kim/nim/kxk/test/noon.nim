import ../noon

template t(a:string, b:JsonNode) = testCmp(a, parseNoon(a), b, instantiationInfo())
suite "noon": 
    test "basic": 
        t("", %(""))
        # t "1"  %(1)
        # t "hello  world"  %({"hello": "world"}.toTable)