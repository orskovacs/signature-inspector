import { Signature, SignatureDataPoint } from 'signature-field'

const dataPointsA: SignatureDataPoint[] = [
  {
    timeStamp: 0,
    xCoord: 0,
    yCoord: 0,
    pressure: 0,
    altitudeAngle: 0,
    azimuthAngle: 0,
    height: 0,
    twist: 0,
  },
]

export const getMockSignature = () => new Signature(dataPointsA)
