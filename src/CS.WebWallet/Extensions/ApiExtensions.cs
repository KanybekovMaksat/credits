using Microsoft.AspNetCore.Mvc;
using IResult = CS.Sdk.Commons.Models.IResult;

namespace CS.WebWallet.Extensions;

internal static class ServicesExtensions
{
    public static IActionResult Response(this ControllerBase controllerBase, IResult result)
    {
        return controllerBase.StatusCode(result.StatusCode, result);
    }

    public static IActionResult Respond(this ControllerBase controllerBase, IResult result)
    {
        return controllerBase.StatusCode(result.StatusCode, result);
    }
}