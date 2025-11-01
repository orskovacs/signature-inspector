import { SignatureVerifier } from './signature-verifier.ts'
import { Signature } from '../model/signature.ts'
import { BackgroundTask } from '../worker/background-task.ts'

export abstract class DotNetBackedSignatureVerifier
  implements SignatureVerifier
{
  private readonly worker: Worker

  protected abstract get classifierId(): string

  protected constructor() {
    this.worker = new Worker(
      new URL('dot-net-backed-signature-verifier.worker.js', import.meta.url),
      { type: 'module' }
    )
  }

  public dispose(): void {
    this.worker.terminate()
  }

  public async trainUsingSignatures(signatures: Signature[]): Promise<void> {
    const message = {
      method: 'train',
      classifierId: this.classifierId,
      signatures: signatures.map((s) => this.signatureToDto(s)),
    }

    return new BackgroundTask<typeof message, void>(
      this.worker,
      message
    ).execute()
  }

  public async testSignature(signature: Signature): Promise<boolean> {
    const message = {
      method: 'test',
      signature: this.signatureToDto(signature),
    }

    return new BackgroundTask<typeof message, boolean>(
      this.worker,
      message
    ).execute()
  }

  private signatureToDto(signature: Signature): SignatureDto {
    return {
      id: signature.id,
      name: signature.name,
      authenticity: signature.authenticity,
      origin: signature.origin,
      dataPoints: signature.dataPoints,
    }
  }
}

export type SignatureDto = {
  id: string
  name: string
  authenticity: Signature['authenticity']
  origin: Signature['origin']
  dataPoints: Signature['dataPoints']
}
