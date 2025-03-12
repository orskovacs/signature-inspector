using System.Runtime.InteropServices.JavaScript;
using System.Runtime.Versioning;
using DotNetGateway.SignatureVerifier;
// ReSharper disable MemberCanBePrivate.Global
// ReSharper disable UnusedType.Global

namespace DotNetGateway;

[SupportedOSPlatform("browser")]
public static partial class SignatureVerifierExport
{
    private static readonly SignatureVerifierManager Manager = SignatureVerifierManager.Instance;

    [JSExport]
    public static string InitializeNewVerifier() => Manager.InitializeNewVerifier();

    [JSExport]
    public static Task TrainUsingSignatures(string classifierId, string signaturesJson)
    {
        ArgumentNullException.ThrowIfNull(classifierId);
        ArgumentNullException.ThrowIfNull(signaturesJson);
        
        return Manager.TrainUsingSignatures(classifierId, signaturesJson);
    }

    [JSExport]
    public static Task<bool> TestSignature(string classifierId, string signatureJson)
    {
        ArgumentNullException.ThrowIfNull(classifierId);
        ArgumentNullException.ThrowIfNull(signatureJson);
        
        return Manager.TestSignature(classifierId, signatureJson);
    }
}
