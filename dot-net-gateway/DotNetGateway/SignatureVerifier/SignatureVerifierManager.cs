using EbDbaLsDtw;
using Newtonsoft.Json;
using SigStat.Common.Pipeline;

namespace DotNetGateway.SignatureVerifier;

public class SignatureVerifierManager
{
    public static SignatureVerifierManager Instance { get; } = new();

    private Dictionary<string, IClassifier> Classifiers { get; } = new();
    
    private Dictionary<string, ISignerModel> TrainedModels { get; } = new();

    private SignatureVerifierManager() { }
    
    public string InitializeNewVerifier()
    {
        var id = Guid.NewGuid().ToString();
        Classifiers[id] = new EbDbaLsDtwClassifier(distances =>
            distances.Average() + distances.StandardDeviation() * 1.25);
        return id;
    }
    
    public Task TrainUsingSignatures(string classifierId, string signaturesJson)
    {
        ArgumentNullException.ThrowIfNull(Classifiers[classifierId]);
        
        var signatureDataList = JsonConvert.DeserializeObject<List<SignatureData>>(signaturesJson) ?? [];
        var signers = new SignatureInspectorClientLoader(signatureDataList).EnumerateSigners().ToList();
        var signatures = signers[0].Signatures;
        
        foreach (var signature in signatures)
        {
            EbDbaLsDtwVerifierItems.FeatureExtractorPipeline.Transform(signature);
        }

        var trainingTask = new Task(() =>
        {
            TrainedModels[classifierId] = Classifiers[classifierId].Train(signatures);
        });
        trainingTask.Start();
        
        return trainingTask;
    }
    
    public Task<bool> TestSignature(string classifierId, string signatureJson)
    {
        ArgumentNullException.ThrowIfNull(Classifiers[classifierId]);
        
        var signatureData = JsonConvert.DeserializeObject<SignatureData>(signatureJson);
        var signers = new SignatureInspectorClientLoader([signatureData]).EnumerateSigners().ToList();
        var signature = signers[0].Signatures[0];
        EbDbaLsDtwVerifierItems.FeatureExtractorPipeline.Transform(signature);
        
        var testTask = new Task<bool>(() => Math.Abs(Classifiers[classifierId].Test(TrainedModels[classifierId], signature) - 1.0) < 0.001);
        testTask.Start();
        return testTask;
    }
}
