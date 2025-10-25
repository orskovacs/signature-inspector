namespace DotNetGateway.SignatureVerifier;

public record struct SignatureData(
    string Id,
    string Name,
    string Authenticity,
    string Origin,
    List<SignatureDataPoint> DataPoints
);
