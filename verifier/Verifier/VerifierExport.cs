using System.Diagnostics.CodeAnalysis;
using System.Runtime.InteropServices.JavaScript;
using System.Runtime.Versioning;
using EbDbaLsDtw;
using Newtonsoft.Json;
using SigStat.Common.Pipeline;

namespace Verifier;

[SupportedOSPlatform("browser")]
[SuppressMessage("ReSharper", "MemberCanBePrivate.Global")]
public static partial class VerifierExport
{
    private static readonly Dictionary<string, IClassifier> Classifiers = new();
    private static readonly Dictionary<string, ISignerModel> TrainedModels = new();

    [JSExport]
    public static string InitializeNewVerifier()
    {
        var id = Guid.NewGuid().ToString();
        Classifiers[id] = new EbDbaLsDtwClassifier(distances =>
            distances.Average() + distances.StandardDeviation() * 1.25);
        return id;
    }

    [JSExport]
    public static Task TrainUsingSignatures(string id, string signaturesJson)
    {
        ArgumentNullException.ThrowIfNull(id);
        ArgumentNullException.ThrowIfNull(Classifiers[id]);
        
        var signatureDataList = JsonConvert.DeserializeObject<List<SignatureData>>(signaturesJson) ?? [];
        var signers = new SignatureInspectorClientLoader(signatureDataList).EnumerateSigners().ToList();
        var signatures = signers[0].Signatures;
        
        foreach (var signature in signatures)
        {
            EbDbaLsDtwVerifierItems.FeatureExtractorPipeline.Transform(signature);
        }

        var trainingTask = new Task(() =>
        {
            TrainedModels[id] = Classifiers[id].Train(signatures);
        });
        trainingTask.Start();
        
        return trainingTask;
    }

    [JSExport]
    public static Task<bool> TestSignature(string id, string signatureJson)
    {
        var signatureData = JsonConvert.DeserializeObject<SignatureData>(signatureJson);
        var signers = new SignatureInspectorClientLoader([signatureData]).EnumerateSigners().ToList();
        var signature = signers[0].Signatures[0];
        EbDbaLsDtwVerifierItems.FeatureExtractorPipeline.Transform(signature);
        
        var testTask = new Task<bool>(() => Math.Abs(Classifiers[id].Test(TrainedModels[id], signature) - 1.0) < 0.001);
        testTask.Start();
        return testTask;
    }
}
