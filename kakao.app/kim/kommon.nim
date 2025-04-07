#[
    ███   ███   ███████   ██     ██  ██     ██   ███████   ███   ███
    ███  ███   ███   ███  ███   ███  ███   ███  ███   ███  ████  ███
    ███████    ███   ███  █████████  █████████  ███   ███  ███ █ ███
    ███  ███   ███   ███  ███ █ ███  ███ █ ███  ███   ███  ███  ████
    ███   ███   ███████   ███   ███  ███   ███   ███████   ███   ███
]#

import std/[tables, typetraits]

converter toBool*(x: int): bool = x != 0
converter toBool*[T](x: seq[T]): bool = x.len > 0

proc deepEqual*[T](a, b: T): bool =

    when T is (seq or array):
        if a.len != b.len:
            return false
        for i in 0..<a.len:
            if not deepEqual(a[i], b[i]):
                return false
    elif T is (Table or TableRef or OrderedTable):
        if a.len != b.len:
            return false
        for (key, valA) in a.pairs:
            if not b.hasKey(key):
                return false
            let valB = b[key]
            if not deepEqual(valA, valB):
                return false
    elif T is object:
        for key, valA in a.fieldPairs:
            let valB = b[key]
            if not deepEqual(valA, valB):
                return false
    elif T is tuple:
        if a != b:
            return false
    else: # primitives
        if a != b: 
            return false
    true
    

