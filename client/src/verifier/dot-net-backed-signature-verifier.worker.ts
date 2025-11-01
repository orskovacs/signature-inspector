import { DotNetInteropManager } from '../dot-net-interop/dot-net-interop-manager.ts'
import { SignatureDto } from './dot-net-backed-signature-verifier.ts'

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

const assemblyImports = await DotNetInteropManager.instance.dotNetImports

const initializeNewVerifier =
  assemblyImports.SignatureVerifierExport.InitializeNewVerifier
const trainUsingSignatures =
  assemblyImports.SignatureVerifierExport.TrainUsingSignatures
const testSignature = assemblyImports.SignatureVerifierExport.TestSignature

let verifierId: string

onmessage = async (e: MessageEvent<MessageData>) => {
  if (e.data.message.method === 'train') {
    await train(e.data.message.classifierId, e.data.message.signatures)
    postMessage({ messageId: e.data.messageId, message: undefined })
  } else if (e.data.message.method === 'test') {
    const res = await test(e.data.message.signature)
    postMessage({ messageId: e.data.messageId, message: res })
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
