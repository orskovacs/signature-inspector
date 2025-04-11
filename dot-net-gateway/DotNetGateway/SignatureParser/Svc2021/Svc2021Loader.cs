using SigStat.Common;
using SigStat.Common.Loaders;

namespace DotNetGateway.SignatureParser.Svc2021;

public class Svc2021Loader(string dataBaseZipBase64) : DataSetLoader
{
    private string DataBaseZipBase64 { get; } = dataBaseZipBase64;

    public override int SamplingFrequency => 100;

    public override IEnumerable<Signer> EnumerateSigners(Predicate<Signer> signerFilter)
    {
        var externalLoader =
            new DotNetGateway.SignatureParser.Svc2021.External.Svc2021Loader(DataBaseZipBase64, true, signerFilter);
        var signers = externalLoader.EnumerateSigners();
        return signers;
    }
}