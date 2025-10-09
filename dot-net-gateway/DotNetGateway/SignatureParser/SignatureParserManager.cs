using DotNetGateway.SignatureParser.Svc2021;
using Newtonsoft.Json;
using SigStat.Common;

namespace DotNetGateway.SignatureParser;

public class SignatureParserManager
{
    public static SignatureParserManager Instance { get; } = new();

    private Dictionary<string, ISignatureParser> Parsers { get; } = new();

    private SignatureParserManager()
    {
    }

    public string InitializeNewParser(string parserId)
    {
        ISignatureParser? parser = null;
        if (parserId == "Svc2021")
        {
            parser = new Svc2021Parser();
        }

        if (parser is null)
        {
            throw new ApplicationException("Invalid parser id");
        }

        var id = Guid.NewGuid().ToString();
        Parsers[id] = parser;
        return id;
    }

    public Task<string> ParseFileContents(string parserId, string fileBase64, string[] signerIds)
    {
        ArgumentNullException.ThrowIfNull(Parsers[parserId]);
        ArgumentNullException.ThrowIfNull(fileBase64);

        Predicate<Signer> signerFilter = signerIds.Length == 0 ? _ => true : s => signerIds.Contains(s.ID);

        var task = new Task<string>(() =>
        {
            var parser = Parsers[parserId];
            var signers = parser.ParseFileBase64(fileBase64, signerFilter);
            return JsonConvert.SerializeObject(signers);
        });
        task.Start();
        return task;
    }
}