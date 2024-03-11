// monsterkodi/kode 0.256.0

var _k_

if (!String.prototype.splice)
{
    String.prototype.splice = function (start, delCount, newSubStr = '')
    {
        return this.slice(0,start) + newSubStr + this.slice(start + Math.abs(delCount))
    }
}
if (!Array.prototype.clone)
{
    Array.prototype.clone = function ()
    {
        return this.slice(0)
    }
}
if (!Array.prototype.reversed)
{
    Array.prototype.reversed = function ()
    {
        return this.slice(0).reverse()
    }
}
export default true;