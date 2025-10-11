import { SignatureDataPoint } from 'signature-field'
import { ParseResult, SignatureParser } from './signature-parser'
import { Signature } from '../model/signature.ts'
import { Signer } from '../model/signer.ts'

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

  async parse(file: File, existingSigners: Signer[]): Promise<ParseResult> {
    const fileContents = await file.text()
    const lines = fileContents.split('\n')
    const pointsCount = Number.parseInt(lines[0])
    const dataPoints: SignatureDataPoint[] = []

    for (let i = 1; i < pointsCount; i++) {
      dataPoints.push(Svc2004Parser.extractPointDataFromLine(lines[i]))
    }

    const [signerId, signatureId] = file.name.split('S')

    const signature = new Signature(`S${signatureId}`, dataPoints)
    let isNewSigner = false
    const signerName = `SVC2004 ${signerId}`
    let signer = existingSigners.find((s) => s.name === signerName)

    if (signer === undefined) {
      signer = new Signer(signerName)
      isNewSigner = true
    }

    signature.signer = signer
    signer.addSignatures(signature)

    return {
      signatures: [signature],
      signers: isNewSigner ? [signer] : [],
    }
  }
}
