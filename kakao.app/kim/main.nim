
import "mod"

echo(getNum())
echo(getNum2())
echo(getNum3())

var numbers = @[1, 2, 3, 4]
numbers.add(5)             
echo numbers

if false:
    discard
else: 
    echo "jello"
    
type Answer = enum Yes, No

proc ask (question:auto) : Answer =
    echo(question, " (y/n)")
    while true:
        case readLine(stdin)
            of "y", "Y", "yes", "Yes", "YES":
                return Yes
            of "n", "N", "no", "No", "NO":
                return No
            else: echo("yes or no?")
            
case ask("Feeling good?")
    of Yes:
        echo("nice!")
    of No:
        echo("bummer!")

# ask = question -> Answer
#     log question '(y/n)'
#     while
#         readLine stdin
#             "y" "Y" "yes" "Yes" "YES" ➜ ⮐  Yes
#             "n" "N" "no" "No" "NO"    ➜ ⮐  No
#                                       ➜ log "yes or no?"
# ask "Feeling good?"
#     Yes ➜ log "nice!"
#     No  ➜ log "bummer!"
#     
# "Milk"
#     in drinks ➜ 