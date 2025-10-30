using DotNetGateway.SignatureParser;
using Convert = System.Convert;

namespace DotNetGatewayTest.SignatureParser;

[TestFixture]
public class SignatureParserManagerTest
{
    [Test]
    public void Test()
    {
        var manager = SignatureParserManager.Instance;
        Assert.That(manager, Is.Not.Null);

        var loaderId = manager.InitializeNewParser("Svc2021");
        var file = File.ReadAllBytes(
            "/Users/ors/Library/CloudStorage/OneDrive-BudapestiMu\u030bszakie\u0301sGazdasa\u0301gtudoma\u0301nyiEgyetem/MSc/Diplomaterveze\u0301s/Adatok/DeepSignDB.zip");
        var fileBase64 = Convert.ToBase64String(file);
        var signatures = manager.ParseFileContents(loaderId, fileBase64, ["1009"]);
        var json = signatures.Result;
        Assert.That(json, Is.Not.Null);
    }
    
    [Test]
    public void Test2()
    {
        var manager = SignatureParserManager.Instance;
        Assert.That(manager, Is.Not.Null);

        var loaderId = manager.InitializeNewParser("Svc2004");
        var file = File.ReadAllBytes(
            "/Users/ors/Library/CloudStorage/OneDrive-BudapestiMu\u030bszakie\u0301sGazdasa\u0301gtudoma\u0301nyiEgyetem/MSc/Diplomaterveze\u0301s/Adatok/SVC2004.zip");
        var fileBase64 = Convert.ToBase64String(file);
        var signatures = manager.ParseFileContents(loaderId, fileBase64, ["2"]);
        var json = signatures.Result;
        Assert.That(json, Is.Not.Null);
    }
}