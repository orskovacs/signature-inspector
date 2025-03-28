using SigStat.Common.Loaders;

namespace DotNetGateway.SignatureParser;

public class SignatureParserManager
{
    public static SignatureParserManager Instance { get; } = new();

    private Dictionary<string, IDataSetLoader> Loaders { get; } = new();
    
    private SignatureParserManager() { }
    
    public string InitializeNewParser(string loaderId)
    {
        IDataSetLoader? loader = null;
        if (loaderId == "SVC2021")
        {
            // loader = new Svc2021Loader();
        }
        if (loader is null)
        {
            throw new ApplicationException("Invalid parser id");
        }
        
        var id = Guid.NewGuid().ToString();
        Loaders[id] = loader;
        return id;
    }

    public Task<string> ParseFileContents(string loaderId, string fileContentsJson)
    {
        ArgumentNullException.ThrowIfNull(Loaders[loaderId]);
        
        var task = new Task<string>(() => "[]");
        task.Start();
        return task;
    }
}
