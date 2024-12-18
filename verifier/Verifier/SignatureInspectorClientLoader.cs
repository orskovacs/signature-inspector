using SigStat.Common;
using SigStat.Common.Loaders;

namespace Verifier;

public class SignatureInspectorClientLoader(List<SignatureData> signatureDataList) : DataSetLoader
{
    public override int SamplingFrequency => 100;

    public override IEnumerable<Signer> EnumerateSigners(Predicate<Signer> signerFilter)
    {
        var signer = new Signer { ID = new Guid().ToString() };
        
        signer.Signatures = signatureDataList
            .Select(s => s.ToSignature(signer))
            .ToList();

        Console.WriteLine($"Loaded {signer.Signatures.Count} signatures");
        return [signer];
    }
}
