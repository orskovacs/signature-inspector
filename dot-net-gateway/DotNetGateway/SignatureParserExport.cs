// ReSharper disable MemberCanBePrivate.Global
// ReSharper disable UnusedType.Global

using System.Runtime.InteropServices.JavaScript;
using System.Runtime.Versioning;
using DotNetGateway.SignatureParser;

namespace DotNetGateway;

[SupportedOSPlatform("browser")]
public static partial class SignatureParserExport
{
    private static readonly SignatureParserManager Manager = SignatureParserManager.Instance;

    [JSExport]
    public static string InitializeNewParser(string loaderId) => Manager.InitializeNewParser(loaderId);

    [JSExport]
    public static Task<string> ParseFileContents(string loaderId, string fileContentsJson)
    {
        ArgumentNullException.ThrowIfNull(loaderId);
        ArgumentNullException.ThrowIfNull(fileContentsJson);
        
        return Manager.ParseFileContents(loaderId, fileContentsJson);
    }
}