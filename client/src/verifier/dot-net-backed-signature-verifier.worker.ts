import { DotNetInteropManager } from '../dot-net-interop/dot-net-interop-manager.ts'
import { SignatureDto } from '../model/dto/signature-dto.ts'
import { VerificationStatus } from '../model/verification-status.ts'

type MessageData = {
  messageId: ReturnType<typeof crypto.randomUUID>
  message:
    | {
        method: 'train'
        classifierId: string
        signatures: SignatureDto[]
      }
    | {
        method: 'test'
        signature: SignatureDto
      }
}

let assemblyImports: Awaited<
  typeof DotNetInteropManager.instance.dotNetImports
> | null = null
let initializeNewVerifier: (classifierId: string) => string
let trainUsingSignatures: (id: string, signaturesJson: string) => Promise<void>
let testSignature: (id: string, signatureJson: string) => Promise<boolean>
let verifierId: string

onmessage = async (e: MessageEvent<MessageData>) => {
  try {
    await initDotNetInterop()
    if (e.data.message.method === 'train') {
      await train(e.data.message.classifierId, e.data.message.signatures)
      postMessage({ messageId: e.data.messageId, message: undefined })
    } else if (e.data.message.method === 'test') {
      const res: VerificationStatus = (await test(e.data.message.signature))
        ? 'genuine'
        : 'forged'
      postMessage({ messageId: e.data.messageId, message: res })
    }
  } catch (err) {
    const error =
      err instanceof Error
        ? err
        : new Error(typeof err === 'string' ? err : JSON.stringify(err))

    postMessage({
      messageId: e.data.messageId,
      error,
    })
  }
}

async function train(
  classifierId: string,
  signatureDtoArray: SignatureDto[]
): Promise<void> {
  verifierId = initializeNewVerifier(classifierId)
  const signaturesJson = JSON.stringify(signatureDtoArray)
  await trainUsingSignatures(verifierId, signaturesJson)
}

async function test(signatureDto: SignatureDto): Promise<boolean> {
  const signatureJson = JSON.stringify(signatureDto)
  return await testSignature(verifierId, signatureJson)
}

async function initDotNetInterop(): Promise<void> {
  if (assemblyImports !== null) return

  assemblyImports = await DotNetInteropManager.instance.dotNetImports
  initializeNewVerifier =
    assemblyImports.SignatureVerifierExport.InitializeNewVerifier
  trainUsingSignatures =
    assemblyImports.SignatureVerifierExport.TrainUsingSignatures
  testSignature = assemblyImports.SignatureVerifierExport.TestSignature
}
