import { ParseResult, SignatureParser } from './signature-parser.ts'
import { Authenticity, Signature } from '../model/signature.ts'
import { fileToBase64 } from '../utils/file.util.ts'
import { Signer } from '../model/signer.ts'
import { SignatureDataPoint } from 'signature-field'
import { BackgroundTask } from '../worker/background-task.ts'

export abstract class DotNetBackedSignatureParser implements SignatureParser {
  private readonly worker: Worker

  protected abstract get loaderId(): string

  protected constructor() {
    this.worker = new Worker(
      new URL('dot-net-backed-signature-parser.worker.js', import.meta.url),
      { type: 'module' }
    )
  }

  public async parse(
    file: File,
    existingSigners: Signer[],
    signerIds: string[] = []
  ): Promise<ParseResult> {
    let fileBase64 = await fileToBase64(file)

    const message = {
      method: 'parse',
      loaderId: this.loaderId,
      fileBase64,
      signerIds,
    }

    const signersJson = await new BackgroundTask<typeof message, string>(
      this.worker,
      message
    ).execute()

    const parsedSigners: Array<{
      name: string
      signatures: Array<{
        name: string
        authenticity: string
        origin: string
        dataPoints: SignatureDataPoint[]
      }>
    }> = JSON.parse(signersJson)

    const existingSignersById: [string, Signer][] = existingSigners.map(
      (signer) => [signer.name, signer]
    )
    const signers: Map<string, Signer> = new Map<string, Signer>(
      existingSignersById
    )
    const newSigners: Signer[] = []
    const signatures: Signature[] = []

    for (const parsedSigner of parsedSigners) {
      let signer = existingSigners.find((s) => s.name === parsedSigner.name)

      if (signer === undefined) {
        signer = new Signer(parsedSigner.name)
        signers.set(signer.name, signer)
        newSigners.push(signer)
      }

      for (const parsedSignature of parsedSigner.signatures) {
        let authenticity: Authenticity = 'unknown'
        if (parsedSignature.authenticity === 'genuine') authenticity = 'genuine'
        else if (parsedSignature.authenticity === 'forged')
          authenticity = 'forged'

        const signature = new Signature(
          parsedSignature.name,
          parsedSignature.dataPoints,
          authenticity,
          parsedSignature.origin
        )
        signature.signer = signer
        signer.addSignatures(signature)

        signatures.push(signature)
      }
    }

    return {
      signatures,
      signers: newSigners,
    }
  }
}
