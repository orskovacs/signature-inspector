// ReSharper disable MemberCanBePrivate.Global
// ReSharper disable UnusedType.Global

using System.Runtime.InteropServices.JavaScript;
using System.Runtime.Versioning;

namespace DotNetGateway;

[SupportedOSPlatform("browser")]
public static partial class SignatureParserExport
{
    [JSExport]
    public static string InitializeNewParser(string loaderId) => "";

    [JSExport]
    public static Task<string> ParseFileContents(string loaderId, string fileContentsJson)
    {
        var task = new Task<string>(() => "[]");
        task.Start();
        return task;
    }
}