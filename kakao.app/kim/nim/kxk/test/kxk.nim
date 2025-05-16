import ../kxk
suite "kxk": 
    test "underscore": 
        check underscore(100) == "100"
        check underscore(1234) == "1_234"
        check underscore(100000) == "100_000"
        check underscore(uint64(27318726387)) == "27_318_726_387"