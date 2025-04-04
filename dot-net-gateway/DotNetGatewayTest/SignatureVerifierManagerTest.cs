using DotNetGateway;
using DotNetGateway.SignatureVerifier;

namespace DotNetGatewayTest;

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
}