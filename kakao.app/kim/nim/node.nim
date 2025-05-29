# ███   ███   ███████   ███████    ████████
# ████  ███  ███   ███  ███   ███  ███     
# ███ █ ███  ███   ███  ███   ███  ███████ 
# ███  ████  ███   ███  ███   ███  ███     
# ███   ███   ███████   ███████    ████████
import tknz
export tknz
type NodeKind* = enum
    ●error
    ●block
    ●semicolon
    ●comment
    ●literal
    ●string
    ●stripol
    ●keyword
    ●preOp
    ●operation
    ●postOp
    ●call
    ●if
    ●condThen
    ●for
    ●list
    ●curly
    ●squarely
    ●range
    ●while
    ●switch
    ●switchCase
    ●arg
    ●var
    ●let
    ●propertyAccess
    ●arrayAccess
    ●arrayLike
    ●func
    ●type
    ●signature
    ●return
    ●discard
    ●break
    ●continue
    ●use
    ●quote
    ●proc
    ●enum
    ●class
    ●struct
    ●member
    ●testSuite
    ●testSection
    ●testCase
    ●color
    ●eof
# ███   ███   ███████   ███████    ████████
# ████  ███  ███   ███  ███   ███  ███     
# ███ █ ███  ███   ███  ███   ███  ███████ 
# ███  ████  ███   ███  ███   ███  ███     
# ███   ███   ███████   ███████    ████████

type Node* = ref object of RootObj
    token*: Token
    case kind*: NodeKind:
        of ●block, ●semicolon: 
            expressions*: seq[Node]
        of ●operation: 
            operand_left*: Node
            operand_right*: Node
        of ●string: 
            string_prefix*: Node
            string_content*: Node
            string_stripols*: seq[Node]
        of ●comment: 
            comment_content*: Node
        of ●stripol: 
            stripol_xprssns*: seq[Node]
            stripol_content*: Node
        of ●range: 
            range_start*: Node
            range_end*: Node
        of ●postOp, ●preOp: 
            operand*: Node
        of ●return: 
            return_value*: Node
        of ●discard: 
            discard_value*: Node
        of ●call: 
            callee*: Node
            call_args*: seq[Node]
        of ●propertyAccess: 
            owner*: Node
            property*: Node
        of ●arrayAccess: 
            array_owner*: Node
            array_index*: Node
        of ●if: 
            # also handles when
            cond_thens*: seq[Node]
            else_branch*: Node
        of ●condThen: 
            condition*: Node
            then_branch*: Node
        of ●switch: 
            switch_value*: Node
            switch_cases*: seq[Node]
            switch_default*: Node
        of ●switchCase: 
            case_when*: seq[Node]
            case_then*: Node
        of ●while: 
            while_cond*: Node
            while_body*: Node
        of ●for: 
            for_value*: Node
            for_range*: Node
            for_body*: Node
        of ●list, ●curly, ●squarely: 
            list_values*: seq[Node]
        of ●arg: 
            arg_type*: Node
            arg_name*: Node
            arg_value*: Node
        of ●var: 
            var_name*: Node
            var_type*: Node
            var_value*: Node
        of ●let: 
            let_expr*: Node
        of ●signature: 
            sig_args*: Node
            sig_type*: Node
        of ●func: 
            func_signature*: Node
            func_mod*: Node
            func_body*: Node
        of ●use: 
            use_module*: Node
            use_kind*: Node
            use_items*: seq[Node]
        of ●class, ●struct: 
            class_name*: Node
            class_parent*: Node
            class_body*: Node
        of ●member: 
            member_key*: Node
            member_value*: Node
        of ●enum: 
            enum_name*: Node
            enum_body*: Node
        of ●quote: 
            quote_body*: Node
        of ●testSuite, ●testSection: 
            test_block*: Node
        of ●testCase: 
            test_value*: Node
            test_expected*: Node
        of ●color: 
            color_value*: Node
        else: discard

proc init*(this : Node) : Node = 
        echo("NODE")
        this

proc `$`*(this : Node) : string = 
        if (this == nil): 
            return "NIL"
        var s = $this.token.tok
        case this.kind:
            of ●string: 
                var ips = ""
                for i, s in this.string_stripols: 
                    if (i == 0): 
                        (ips &= "<")
                    (ips &= $s.stripol_xprssns)
                    if ((0 < i) and (i < (this.string_stripols.len - 1))): 
                        (ips &= " ")
                    if (i == (this.string_stripols.len - 1)): 
                        (ips &= ">")
                var p = choose(this.string_prefix, $this.string_prefix.token.str, "")
                s = &"◂{p}string{ips}"
            of ●block: 
                s = "▪["
                for e in this.expressions: 
                    if (e != nil): 
                        (s &= &"{e}")
                    else: 
                        (s &= "NIL")
                (s &= "]")
            of ●semicolon: 
                s = ";["
                for e in this.expressions: 
                    if (e != nil): 
                        (s &= &"{e}")
                    else: 
                        (s &= "NIL")
                (s &= "]")
            of ●operation: 
                s = &"({this.operand_left} {s} {this.operand_right})"
            of ●range: 
                s = &"({this.range_start} {s} {this.range_end})"
            of ●preOp: 
                s = &"({s} {this.operand})"
            of ●postOp: 
                s = &"({this.operand} {s})"
            of ●return: 
                var e = choose(this.return_value, " " & $this.return_value, "")
                s = &"({s}{e})"
            of ●call: 
                s = &"({this.callee} ◂call {this.callargs})"
            of ●propertyAccess: 
                s = &"({this.owner} {s} {this.property})"
            of ●if: 
                var e = choose(this.else_branch, &" {this.else_branch}", "")
                s = &"({s} {this.cond_thens}{e})"
            of ●condThen: 
                s = &"({this.condition} {this.then_branch})"
            of ●switch: 
                var e = choose(this.switch_default, &" {this.switch_default}", "")
                s = &"({s} {this.switch_value} {this.switch_cases}{e})"
            of ●switchCase: 
                s = &"({this.case_when} {this.case_then})"
            of ●for: 
                var b = choose(this.for_body, &" {this.for_body}", "")
                s = &"({s} {this.for_value} in {this.for_range}{b})"
            of ●list: 
                s = &"{this.list_values}"
                s = "◂" & s[1..^1]
            of ●curly: 
                s = &"{this.list_values}"
                s = "{" & s[2..^2] & "}"
            of ●squarely: 
                s = &"{this.list_values}"
                s = "[" & s[1..^1] & "]"
            of ●while: 
                var b = choose(this.while_body, &" {this.while_body}", "")
                s = &"({s} {this.while_cond}{b})"
            of ●func: 
                var sig = choose(this.func_signature, $this.func_signature, "")
                var mdf = choose(this.func_mod, &" {this.func_mod.token.str} ", "")
                var bdy = choose(this.func_body, &" {this.func_body}", "")
                s = &"({sig}{s}{mdf}{bdy})"
            of ●signature: 
                var a = if (this.sig_args and this.sig_args.list_values.len): $this.sig_args else: ""
                var t = choose(this.sig_type, &" ➜ {this.sig_type}", "")
                s = &"{a}{t}"
            of ●arrayAccess: 
                var i = choose(this.array_index, &"{this.array_index}", "")
                s = &"({this.array_owner}[{i}])"
            of ●arg: 
                var t = choose(this.arg_type, &"{s}{this.arg_type} ", "")
                var v = choose(this.arg_value, &" (= {this.arg_value})", "")
                s = &"({t}{this.arg_name}{v})"
            of ●var: 
                var t = choose(this.var_type, &" {s}{this.var_type}", "")
                var v = choose(this.var_value, &" (= {this.var_value})", "")
                s = &"({this.var_name}{t}{v})"
            of ●let: 
                s = &"({s} {this.let_expr})"
            of ●type: 
                s = &"type({this.token.str})"
            of ●use: 
                var k = choose(this.use_kind, &" {this.use_kind.token.str}", "")
                var i = choose((this.use_items.len > 0), &" {this.use_items}", "")
                s = &"({s} {this.use_module}{k}{i})"
            of ●enum: 
                var b = choose(this.enum_body, &" {this.enum_body}", "")
                s = &"({s} {this.enum_name}{b})"
            of ●class: 
                var p = choose(this.class_parent, &" {this.class_parent}", "")
                var b = choose(this.class_body, &" {this.class_body}", "")
                s = &"({s} {this.class_name}{p}{b})"
            of ●member: 
                s = &"({this.member_key} {s} {this.member_value})"
            of ●quote: 
                s = &"({s} {this.quote_body})"
            of ●testSuite: 
                var b = choose(this.test_block, &" {this.test_block}", "")
                s = &"({s} suite{b})"
            of ●testSection: 
                var b = choose(this.test_block, &" {this.test_block}", "")
                s = &"({s} section{b})"
            of ●testCase: 
                s = &"({this.test_value} {s} {this.test_expected})"
            of ●color: 
                var v = choose(this.color_value, &"{this.color_value.token.str}", "")
                s = &"{s}{v}"
            else: 
                discard
        s
# s = &"(¨s¨ ¨n.for_value¨ in ¨n.for_range¨¨b¨)"

proc nod*(kind : NodeKind, token : Token, args : varargs[Node]) : Node = 
    # log "#{kind} #{token}"
    var n = Node(kind: kind, token: token)
    case kind:
        of ●arg: 
            n.arg_type = args[0]
            n.arg_name = args[1]
            n.arg_value = args[2]
        of ●var: 
            n.var_name = args[0]
            n.var_type = args[1]
            n.var_value = args[2]
        of ●propertyAccess: 
            n.owner = args[0]
            n.property = args[1]
        of ●arrayAccess: 
            n.array_owner = args[0]
            n.array_index = args[1]
        of ●operation: 
            n.operand_left = args[0]
            n.operand_right = args[1]
        of ●postOp, ●preOp: 
            n.operand = args[0]
        of ●range: 
            n.range_start = args[0]
            n.range_end = args[1]
        of ●func: 
            n.func_signature = args[0]
            n.func_mod = args[1]
            n.func_body = args[2]
        of ●signature: 
            n.sig_args = args[0]
            n.sig_type = args[1]
        of ●let: 
            n.let_expr = args[0]
        of ●class, ●struct: 
            n.class_name = args[0]
            n.class_parent = args[1]
            n.class_body = args[2]
        of ●member: 
            n.member_key = args[0]
            n.member_value = args[1]
        of ●enum: 
            n.enum_name = args[0]
            n.enum_body = args[1]
        of ●quote: 
            n.quote_body = args[0]
        of ●comment: 
            n.comment_content = args[0]
        of ●for: 
            n.for_value = args[0]
            n.for_range = args[1]
            n.for_body = args[2]
        of ●while: 
            n.while_cond = args[0]
            n.while_body = args[1]
        of ●condThen: 
            n.condition = args[0]
            n.then_branch = args[1]
        of ●return: 
            n.return_value = args[0]
        of ●discard: 
            n.discard_value = args[0]
        of ●testCase: 
            n.test_value = args[0]
            n.test_expected = args[1]
        of ●testSection, ●testSuite: 
            n.test_block = args[0]
        of ●color: 
            n.color_value = args[0]
        else: discard
    n

proc nod*(kind : NodeKind, token : Token, args : seq[Node]) : Node = 
    var n = Node() #kind:kind token:token
    n.kind = kind
    n.token = token
    case kind:
        of ●block, ●semicolon: 
            n.expressions = args
        of ●list: 
            n.list_values = args
        of ●curly, ●squarely: 
            n.list_values = args
        else: discard
    n

proc bodify*(body : Node) : Node = 
    if not body: 
        return nod(●block, tkn(◂indent, "    "), @[])
    if (body.kind notin {●block, ●semicolon}): 
        return nod(●block, tkn(◂indent, "    ", body.token.line), @[body])
    body