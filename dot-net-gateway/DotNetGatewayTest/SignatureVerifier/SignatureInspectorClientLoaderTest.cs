using DotNetGateway.SignatureVerifier;

namespace DotNetGatewayTest.SignatureVerifier;

[TestFixture]
[TestOf(typeof(SignatureInspectorClientLoader))]
public class SignatureInspectorClientLoaderTest
{
    [Test]
    public void EnumerateSigners_ShouldReturnOneSignerWithAllSignatures()
    {
        List<SignatureData> signatureDataList =
        [
            new()
            {
                Id = "s1",
                Name = "s1",
                Origin = "unknown",
                Authenticity = "unknown",
                DataPoints = []
            },
            new()
            {
                Id = "s2",
                Name = "s2",
                Origin = "unknown",
                Authenticity = "unknown",
                DataPoints = []
            }
        ];
        var loader = new SignatureInspectorClientLoader(signatureDataList);

        // Enumerate all signers
        var signers = loader.EnumerateSigners(_ => true).ToList();

        Assert.That(signers, Has.Count.EqualTo(1));

        var signer = signers[0];
        Assert.Multiple(() =>
        {
            Assert.That(signer.Signatures, Has.Count.EqualTo(2));
            Assert.That(signer.ID, Is.Not.Null.And.Not.Empty);
        });
    }
}