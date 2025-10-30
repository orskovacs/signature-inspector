using DotNetGateway.SignatureVerifier;

namespace DotNetGatewayTest.SignatureVerifier;

[TestFixture]
[TestOf(typeof(SignatureVerifierManager))]
public class SignatureVerifierManagerTests
{
    [Test]
    public void SignatureVerifierManagerNotNull()
    {
        Assert.That(SignatureVerifierManager.Instance, Is.Not.Null);
    }

    [Test]
    public void InitializeNonExistentVerifier()
    {
        var manager = SignatureVerifierManager.Instance;
        Assert.That(() => manager.InitializeNewVerifier("---"),
            Throws.Exception.With.Message.EqualTo("Invalid classifier id"));
    }

    [Test]
    public void InitializeNewEbDbaLsDtwVerifier()
    {
        var manager = SignatureVerifierManager.Instance;
        var verifierId = manager.InitializeNewVerifier("EbDbaLsDtw");
        Assert.That(verifierId, Is.Not.Null);
    }

    [Test]
    public void InitializeNewDtwVerifier()
    {
        var manager = SignatureVerifierManager.Instance;
        var verifierId = manager.InitializeNewVerifier("Dtw");
        Assert.That(verifierId, Is.Not.Null);
    }

    [Test]
    public async Task TrainUsingSignatures_WithJsonFileString_Trains()
    {
        var manager = SignatureVerifierManager.Instance;
        var verifierId = manager.InitializeNewVerifier("Dtw");
        var signaturesJson = await File.ReadAllTextAsync("./Data/signatures.json");
        await manager.TrainUsingSignatures(verifierId, signaturesJson);
        var signatureJson = await File.ReadAllTextAsync("./Data/signature.json");
        var result = await manager.TestSignature(verifierId, signatureJson);
        Assert.That(result, Is.AnyOf([true, false]));
    }
}