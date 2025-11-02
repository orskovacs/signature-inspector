import { DotNetInteropManager } from '../dot-net-interop/dot-net-interop-manager.ts'
import { arrayBufferToBase64 } from '../utils/file.util.ts'
import { SignerDto } from '../model/dto/signer-dto.ts'

type MessageData = {
  messageId: ReturnType<typeof crypto.randomUUID>
  message: {
    method: 'parse'
    loaderId: string
    arrayBuffer: ArrayBuffer
    signerIds: string[]
  }
}

let assemblyImports: Awaited<
  typeof DotNetInteropManager.instance.dotNetImports
> | null = null

let initializeNewParser: (loaderId: string) => string
let parseFileContents: (
  id: string,
  fileContents: string,
  signerIds: string[]
) => Promise<string>

onmessage = async (e: MessageEvent<MessageData>) => {
  try {
    await initDotNetInterop()
    if (e.data.message.method === 'parse') {
      const id = initializeNewParser(e.data.message.loaderId)
      const signerDtoArrayJson = await parseFileContents(
        id,
        await arrayBufferToBase64(e.data.message.arrayBuffer),
        e.data.message.signerIds
      )

      const signerDtoArray: Array<SignerDto> = JSON.parse(signerDtoArrayJson)

      postMessage({ messageId: e.data.messageId, message: signerDtoArray })
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

async function initDotNetInterop(): Promise<void> {
  if (assemblyImports !== null) return

  assemblyImports = await DotNetInteropManager.instance.dotNetImports
  initializeNewParser =
    assemblyImports.SignatureParserExport.InitializeNewParser
  parseFileContents = assemblyImports.SignatureParserExport.ParseFileContents
}
