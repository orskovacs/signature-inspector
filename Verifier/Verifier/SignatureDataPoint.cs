namespace Verifier;

public record struct SignatureDataPoint(
    long TimeStamp,
    int XCoord,
    int YCoord,
    int Pressure,
    int AltitudeAngle,
    int AzimuthAngle,
    int Height,
    int Twist
);
