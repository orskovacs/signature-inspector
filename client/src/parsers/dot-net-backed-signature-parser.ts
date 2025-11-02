import { ParseResult, SignatureParser } from './signature-parser.ts'
import { Signer } from '../model/signer.ts'
import { BackgroundTask } from '../worker/background-task.ts'
import { dtoToSigner, SignerDto } from '../model/dto/signer-dto.ts'
import { dtoToSignature } from '../model/dto/signature-dto.ts'

export abstract class DotNetBackedSignatureParser implements SignatureParser {
  private readonly worker: Worker

  protected abstract get loaderId(): string

  protected constructor() {
    this.worker = new Worker(
      new URL('dot-net-backed-signature-parser.worker.js', import.meta.url),
      { type: 'module' }
    )
  }

  public dispose(): void {
    this.worker.terminate()
  }

  public async parse(
    file: File,
    existingSigners: Signer[],
    signerIds: string[] = []
  ): Promise<ParseResult> {
    const arrayBuffer = await file.arrayBuffer()
    const message = {
      method: 'parse',
      loaderId: this.loaderId,
      arrayBuffer,
      signerIds,
    }

    const signerDtoArray = await new BackgroundTask<
      typeof message,
      SignerDto[]
    >(this.worker, message, [arrayBuffer]).execute()

    const existingSignersByName: Map<string, Signer> = new Map<string, Signer>(
      existingSigners.map((signer) => [signer.name, signer])
    )
    const newSigners: Signer[] = []
    const signersWithNewSignatures: Signer[] = []

    for (const signerDto of signerDtoArray) {
      let existingSigner = existingSignersByName.get(signerDto.name)

      if (existingSigner === undefined) {
        existingSigner = newSigners.find((s) => s.name === signerDto.name)
      }

      if (existingSigner === undefined) {
        const signer = dtoToSigner(signerDto)
        newSigners.push(signer)
      } else {
        signerDto.signatures.forEach((dto) =>
          dtoToSignature(dto, existingSigner)
        )
        signersWithNewSignatures.push(existingSigner)
      }
    }

    return {
      newSigners,
      signersWithNewSignatures,
    }
  }
}
