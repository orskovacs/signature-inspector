using SigStat.Common;

namespace Verifier;

public static class SignatureDataExtensions
{
    public static Signature ToSignature(this SignatureData signatureData, Signer signer)
    {
        var signature = new Signature
        {
            ID = signatureData.TimeStamp.ToString(),
            Origin = Origin.Genuine,
            Signer = signer,
        };
        
        var x = new List<double>(signatureData.DataPoints.Count);
        var y = new List<double>(signatureData.DataPoints.Count);
        var pressure = new List<double>(signatureData.DataPoints.Count);
        var timeStamp = new List<double>(signatureData.DataPoints.Count);
        var altitudeAngle = new List<double>(signatureData.DataPoints.Count);
        var azimuthAngle = new List<double>(signatureData.DataPoints.Count);
        
        signatureData.DataPoints.ForEach(dataPoint =>
        {
            x.Add(dataPoint.XCoord);
            y.Add(dataPoint.YCoord);
            pressure.Add(dataPoint.Pressure);
            timeStamp.Add(dataPoint.TimeStamp);
            altitudeAngle.Add(dataPoint.AltitudeAngle);
            azimuthAngle.Add(dataPoint.AzimuthAngle);
        });
        
        signature.SetFeature(Features.X, x);
        signature.SetFeature(Features.Y, y);
        signature.SetFeature(Features.Pressure, pressure);
        signature.SetFeature(Features.T, timeStamp);
        signature.SetFeature(Features.Altitude, altitudeAngle);
        signature.SetFeature(Features.Azimuth, azimuthAngle);
        
        return signature;
    }
}
