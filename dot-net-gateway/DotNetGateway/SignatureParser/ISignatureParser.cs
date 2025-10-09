using SigStat.Common;

namespace DotNetGateway.SignatureParser;

public interface ISignatureParser
{
    IEnumerable<ExportTypes.Signer> ParseFileBase64(string fileBase64, Predicate<Signer> signerFilter);
}