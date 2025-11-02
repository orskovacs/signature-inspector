import { SignatureVerifier } from './signature-verifier.ts'
import { Signature } from '../model/signature.ts'
import { BackgroundTask } from '../worker/background-task.ts'
import { signatureToDto } from '../model/dto/signature-dto.ts'
import { VerificationStatus } from '../model/verification-status.ts'

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
      signatures: signatures.map((s) => signatureToDto(s)),
    }

    return new BackgroundTask<typeof message, void>(
      this.worker,
      message
    ).execute()
  }

  public async testSignature(
    signature: Signature
  ): Promise<VerificationStatus> {
    const message = {
      method: 'test',
      signature: signatureToDto(signature),
    }

    return new BackgroundTask<typeof message, VerificationStatus>(
      this.worker,
      message
    ).execute()
  }
}
