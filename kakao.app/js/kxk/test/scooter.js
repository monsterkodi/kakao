var toExport = {}
var _k_

import scooter from "../scooter.js"

toExport["scooter"] = function ()
{
    section("add", function ()
    {
        compare(scooter('1+1'),2)
        compare(scooter('0+0'),0)
        compare(scooter('+2'),2)
        compare(scooter('-3'),-3)
    })
    section("multiply", function ()
    {
        compare(scooter('9*9'),81)
        compare(scooter('9*-3'),-27)
        compare(scooter('-2*-2'),4)
        compare(scooter('3*3*3'),27)
        compare(scooter('1/0'),Infinity)
        compare(scooter('0/0'),NaN)
        compare(scooter('1/Infinity'),0)
    })
    section("pow", function ()
    {
        compare(scooter('2^2'),4)
        compare(scooter('2^-2'),0.25)
        compare(scooter('2^0.5'),Math.sqrt(2))
        compare(scooter('2^2^2'),16)
        compare(scooter('2^3^4'),Math.pow(2,Math.pow(3,4)))
        compare(scooter('2^(3^4)'),Math.pow(2,Math.pow(3,4)))
        compare(scooter('(2^3)^4'),4096)
    })
    section("constants", function ()
    {
        compare(scooter('PI'),Math.PI)
        compare(scooter('E'),Math.E)
        compare(scooter('PHI'),(1 + Math.sqrt(5)) / 2)
    })
    section("trigonometry", function ()
    {
        compare(scooter('cos(PI)'),-1)
        compare(scooter('sin(PI/2)'),1)
        compare(scooter('cos(sin(PI))'),1)
    })
    section("logarithm", function ()
    {
        compare(scooter('log(E)'),1)
        compare(scooter('log(0)'),-Infinity)
        compare(scooter('log(-1)'),NaN)
        compare(scooter('log(10)'),Math.log(10))
    })
    section("degrees", function ()
    {
        compare(scooter('rad(180)'),Math.PI)
        compare(scooter('deg(PI)'),180)
    })
    section("sqrt", function ()
    {
        compare(scooter('sqrt(9)'),3)
        compare(scooter('sqrt(8+1)'),3)
    })
    section("unicode", function ()
    {
        compare(scooter('∡(π)'),180)
        compare(scooter('√(9)'),3)
        compare(scooter('π'),Math.PI)
        compare(scooter('𝒆'),Math.E)
        compare(scooter('∞'),Infinity)
        compare(scooter('ϕ'),(1 + Math.sqrt(5)) / 2)
        section("degree", function ()
        {
            compare(scooter('180°'),Math.PI)
            compare(scooter('(90+90)°'),Math.PI)
            compare(scooter('(2*90)°'),Math.PI)
            compare(scooter('2*90°'),Math.PI)
            compare(scooter('90°+90°'),Math.PI)
        })
    })
}
toExport["scooter"]._section_ = true
toExport._test_ = true
export default toExport
