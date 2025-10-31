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

    const ids = file.name
      .replace('U', '')
      .replace('.TXT', '')
      .split('S')
      .map((x) => Number.parseInt(x))

    const signerId = ids[0]
    const signatureId = ids[1]

    const signatureName = `${signatureId}`.padStart(2, '0')
    const signatureAuthenticity = signatureId < 21 ? 'genuine' : 'forged'

    const signature = new Signature(
      signatureName,
      dataPoints,
      signatureAuthenticity,
      'SVC2004'
    )

    let isNewSigner = false
    const signerName = 'U' + `${signerId}`.padStart(2, '0')
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
