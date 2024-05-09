import { Signature, SignatureDataPoint } from 'signature-field'
import { SignatureParser } from './signature-parser'

export class Svc2004Parser implements SignatureParser {
  private static extractPointDataFromLine(line: string): SignatureDataPoint {
    const features = line.split(' ').map((f) => Number.parseInt(f))
    return {
      timeStamp: features[2],
      xCoord: features[0],
      yCoord: features[1],
      pressure: features[6],
      altitudeAngle: features[5],
      azimuthAngle: features[4],
      height: 0,
      twist: 0,
    }
  }

  async parse(file: File): Promise<Signature[]> {
    const fileContents = await file.text()
    const lines = fileContents.split('\n')
    const pointsCount = Number.parseInt(lines[0])
    const dataPoints: SignatureDataPoint[] = []

    for (let i = 1; i < pointsCount; i++) {
      dataPoints.push(Svc2004Parser.extractPointDataFromLine(lines[i]))
    }

    return [new Signature(dataPoints)]
  }
}
