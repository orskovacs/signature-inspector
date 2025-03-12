namespace DotNetGateway.SignatureVerifier;

public record struct SignatureDataPoint(
    long TimeStamp,
    double XCoord,
    double YCoord,
    double Pressure,
    double AltitudeAngle,
    double AzimuthAngle,
    double Height,
    double Twist
);
