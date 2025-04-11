using DotNetGateway.SignatureParser.Svc2021;
using Newtonsoft.Json;
using SigStat.Common;
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
        if (loaderId == "Svc2021")
        {
            loader = new Svc2021Loader(null);
        }
        if (loader is null)
        {
            throw new ApplicationException("Invalid parser id");
        }
        
        var id = Guid.NewGuid().ToString();
        Loaders[id] = loader;
        return id;
    }

    public Task<string> ParseFileContents(string loaderId, string fileBase64)
    {
        ArgumentNullException.ThrowIfNull(Loaders[loaderId]);
        ArgumentNullException.ThrowIfNull(fileBase64);
        
        var task = new Task<string>(() =>
        {
            // var loader = Loaders[loaderId];
            var loader = new Svc2021Loader(fileBase64);
            var signatures = loader.EnumerateSigners(s => s.ID.Equals("1009")).SelectMany(signer => signer.Signatures).Select(s => new
            {
                x = s.GetFeature(Features.X),
                y = s.GetFeature(Features.Y),
                id = s.ID,
                signer = s.Signer.ID,
            }).ToList();
            return JsonConvert.SerializeObject(signatures);
        });
        task.Start();
        return task;
    }
}
