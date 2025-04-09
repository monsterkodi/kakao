
import std/[strformat, strutils]
import kommon

type
    tok* = enum
        ◆if,
        ◆then,
        ◆elif,
        ◆else,
        ◆switch,
        ◆for,
        ◆in,
        ◆is,
        ◆of,
        ◆break,
        ◆continue,
        ◆while,
        ◆func,
        ◆class,
        ◆this,
        ◆return,
        ◆test,
        ◆use,
        ◆string,
        ◆paren,
        
    toks* = set[tok]
    
const 
    alltoks  = { low(tok)..high(tok) }
    thenable = { ◆if, ◆elif }
    
# log "tok:"
# for t in tok:
#     log &"   {t} {ord(t)}"

dbg alltoks
