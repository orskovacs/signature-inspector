using SigStat.Common;
using ExternalLoader = DotNetGateway.SignatureParser.Svc2004.External.Svc2004Loader;

namespace DotNetGateway.SignatureParser.Svc2004;

public class Svc2004Parser : ISignatureParser
{
    public IEnumerable<ExportTypes.Signer> ParseFileBase64(string fileBase64, Predicate<Signer> signerFilter)
    {
        var externalLoader = new ExternalLoader(fileBase64, true);
        var loadedSigners = externalLoader.EnumerateSigners(signerFilter);

        var signers = new List<ExportTypes.Signer>();
        foreach (var loadedSigner in loadedSigners)
        {
            var signatures = new List<ExportTypes.Signature>();
            foreach (var s in loadedSigner.Signatures)
            {
                var xCoord = s.GetFeature(Features.X);
                var yCoord = s.GetFeature(Features.Y);
                var pressure = s.GetFeature(Features.Pressure);
                var azimuth = s.GetFeature(Features.Azimuth);
                var altitude = s.GetFeature(Features.Altitude);

                var dataPointCount = xCoord.Count;
                var dataPoints = new List<ExportTypes.SignatureDataPoint>(dataPointCount);

                for (var i = 0; i < dataPointCount; i++)
                {
                    dataPoints.Add(new ExportTypes.SignatureDataPoint(
                        i,
                        xCoord[i],
                        yCoord[i],
                        pressure[i],
                        altitude[i],
                        azimuth[i],
                        0,
                        0)
                    );
                }

                signatures.Add(new ExportTypes.Signature(s.ID, dataPoints));
            }

            signers.Add(new ExportTypes.Signer($"SVC2004 U{loadedSigner.ID}", signatures));
        }

        return signers;
    }
}