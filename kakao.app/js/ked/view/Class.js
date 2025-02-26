var frecent, int

int = parseInt

frecent = (function ()
{
    function frecent ()
    {}

    frecent["frecent"] = function (rank, time)
    {
        var dx

        dx = t - time
        return parseInt(10000 * rank * (3.75 / ((0.0001 * dx + 1) + 0.25)))
    }

    return frecent
})()

export default frecent;