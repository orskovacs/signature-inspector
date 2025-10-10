namespace DotNetGateway.SignatureParser.ExportTypes;

public record SignatureDataPoint(
    double timeStamp,
    double xCoord,
    double yCoord,
    double pressure,
    double altitudeAngle,
    double azimuthAngle,
    double height,
    double twist
);