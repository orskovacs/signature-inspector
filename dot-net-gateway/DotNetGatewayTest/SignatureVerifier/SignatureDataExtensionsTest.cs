using DotNetGateway.SignatureVerifier;
using SigStat.Common;

namespace DotNetGatewayTest.SignatureVerifier;

[TestFixture]
[TestOf(typeof(SignatureDataExtensions))]
public class SignatureDataExtensionsTest
{
    [Test]
    public void ToSignature_ShouldReturnCorrectSignature()
    {
        var signatureData = new SignatureData
        {
            Id = "sig-001",
            Name = "John Doe",
            Authenticity = "Genuine",
            Origin = "Tablet",
            DataPoints =
            [
                new SignatureDataPoint(
                    TimeStamp: 0,
                    XCoord: 10.5,
                    YCoord: 20.25,
                    Pressure: 0.8,
                    AltitudeAngle: 45,
                    AzimuthAngle: 90,
                    Height: 0,
                    Twist: 0
                ),

                new SignatureDataPoint(
                    TimeStamp: 5,
                    XCoord: 11.5,
                    YCoord: 21.25,
                    Pressure: 0.85,
                    AltitudeAngle: 46,
                    AzimuthAngle: 91,
                    Height: 0,
                    Twist: 0
                )
            ]
        };

        var signature = signatureData.ToSignature(new Signer());
        
        Assert.That(signature, Is.Not.Null);
        
        Assert.Multiple(() =>
        {
            Assert.That(signature.ID, Is.EqualTo("sig-001"));
            Assert.That(signature.HasFeature(Features.X));
            Assert.That(signature.HasFeature(Features.Y));
            Assert.That(signature.HasFeature(Features.T));
            Assert.That(signature.HasFeature(Features.Altitude));
            Assert.That(signature.HasFeature(Features.Azimuth));
            Assert.That(signature.HasFeature(Features.Pressure));
        });
    }
}