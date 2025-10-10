import { DotNetBackedObject } from '../dot-net-interop/dot-net-backed-object.ts'
import { ParseResult, SignatureParser } from './signature-parser.ts'
import { Signature } from '../model/signature.ts'
import { SignatureParserImport } from '../dot-net-interop/dot-net-assembly-exports.ts'
import { fileToBase64 } from '../utils/file.util.ts'
import { Signer } from '../model/signer.ts'
import { SignatureDataPoint } from 'signature-field'

export abstract class DotNetBackedSignatureParser
  extends DotNetBackedObject<SignatureParserImport>
  implements SignatureParser
{
  private readonly _dotNetId: Promise<string>

  protected abstract get loaderId(): string

  protected constructor() {
    super('SignatureParserExport')

    this._dotNetId = this.dotNetImport.then((manager) =>
      manager.InitializeNewParser(this.loaderId)
    )
  }

  public async parse(
    file: File,
    existingSigners: Signer[],
    signerIds: string[] = []
  ): Promise<ParseResult> {
    let manager = await this.dotNetImport
    let id = await this._dotNetId
    let fileBase64 = await fileToBase64(file)
    let signersJson = await manager.ParseFileContents(id, fileBase64, signerIds)

    const parsedSigners: Array<{
      name: string
      signatures: Array<{ name: string; dataPoints: SignatureDataPoint[] }>
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
        const signature = new Signature(parsedSignature.dataPoints)
        signature.setSigner(signer)
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
