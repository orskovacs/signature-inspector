using DotNetGateway.SignatureVerifier;

namespace DotNetGatewayTest.SignatureVerifier;

[TestFixture]
[TestOf(typeof(SignatureData))]
public class SignatureDataTest
{
    private static List<SignatureDataPoint> CreateSamplePoints()
    {
        return
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
        ];
    }

    [Test]
    public void Constructor_ObjectInitializer_SetsAllProperties()
    {
        var points = CreateSamplePoints();

        var signatureData = new SignatureData
        {
            Id = "sig-001",
            Name = "John Doe",
            Authenticity = "Genuine",
            Origin = "Tablet",
            DataPoints = points
        };

        Assert.Multiple(() =>
        {
            Assert.That(signatureData.Id, Is.EqualTo("sig-001"));
            Assert.That(signatureData.Name, Is.EqualTo("John Doe"));
            Assert.That(signatureData.Authenticity, Is.EqualTo("Genuine"));
            Assert.That(signatureData.Origin, Is.EqualTo("Tablet"));
            Assert.That(signatureData.DataPoints, Is.SameAs(points));
            Assert.That(signatureData.DataPoints, Has.Count.EqualTo(2));
        });
    }

    [Test]
    public void DataPoints_PreserveOrderAndValues()
    {
        var points = CreateSamplePoints();
        var signatureData = new SignatureData
        {
            Id = "sig-002",
            Name = "Jane Doe",
            Authenticity = "Forged",
            Origin = "Phone",
            DataPoints = points
        };

        var p0 = signatureData.DataPoints[0];
        var p1 = signatureData.DataPoints[1];

        Assert.Multiple(() =>
        {
            Assert.That(p0.TimeStamp, Is.EqualTo(0));
            Assert.That(p0.XCoord, Is.EqualTo(10.5));
            Assert.That(p0.YCoord, Is.EqualTo(20.25));
            Assert.That(p0.Pressure, Is.EqualTo(0.8));
            Assert.That(p0.AltitudeAngle, Is.EqualTo(45));
            Assert.That(p0.AzimuthAngle, Is.EqualTo(90));

            Assert.That(p1.TimeStamp, Is.EqualTo(5));
            Assert.That(p1.XCoord, Is.EqualTo(11.5));
            Assert.That(p1.YCoord, Is.EqualTo(21.25));
            Assert.That(p1.Pressure, Is.EqualTo(0.85));
            Assert.That(p1.AltitudeAngle, Is.EqualTo(46));
            Assert.That(p1.AzimuthAngle, Is.EqualTo(91));
        });
    }

    [Test]
    public void ModifyingProvidedList_ReflectsInSignatureData()
    {
        var points = CreateSamplePoints();
        var signatureData = new SignatureData
        {
            Id = "sig-003",
            Name = "Alex",
            Authenticity = "Unknown",
            Origin = "Desktop",
            DataPoints = points
        };

        // mutate original list
        points.Add(new SignatureDataPoint(10, 12.0, 22.0, 0.9, 47, 92, 0, 0));

        Assert.That(signatureData.DataPoints, Has.Count.EqualTo(3));
        Assert.That(signatureData.DataPoints[2].TimeStamp, Is.EqualTo(10));
    }
}