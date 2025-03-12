namespace DotNetGateway.SignatureVerifier;

public record struct SignatureData(
    long TimeStamp,
    List<SignatureDataPoint> DataPoints
);
