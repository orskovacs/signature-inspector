namespace DotNetGateway.SignatureParser.ExportTypes;

public record Signature(string name, string authenticity, string origin, List<SignatureDataPoint> dataPoints);