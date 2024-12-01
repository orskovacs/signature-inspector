namespace Verifier;

public record struct SignatureData(
    long TimeStamp,
    List<SignatureDataPoint> DataPoints
);
