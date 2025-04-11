using DotNetGateway.SignatureParser;
using Convert = System.Convert;

namespace DotNetGatewayTest.SignatureParserTest;

[TestFixture]
public class SignatureParserManagerTest
{

    [Test]
    public void Test()
    {
        var manager = SignatureParserManager.Instance;
        Assert.That(manager, Is.Not.Null);
        
        var loaderId = manager.InitializeNewParser("Svc2021");
        var file = File.ReadAllBytes("/Users/ors/Library/CloudStorage/OneDrive-BudapestiMu\u030bszakie\u0301sGazdasa\u0301gtudoma\u0301nyiEgyetem/MSc/Diplomaterveze\u0301s/Adatok/DeepSignDB.zip");
        var fileBase64 = Convert.ToBase64String(file);
        var signatures = manager.ParseFileContents(loaderId, fileBase64);
        var json = signatures.Result;
        Assert.That(json, Is.Not.Null);
    }
}