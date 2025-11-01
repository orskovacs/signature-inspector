import { DotNetInteropManager } from '../dot-net-interop/dot-net-interop-manager.ts'

type MessageData = {
  messageId: ReturnType<typeof crypto.randomUUID>
  message: {
    method: 'parse'
    loaderId: string
    fileBase64: string
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
      const res = await parseFileContents(
        id,
        e.data.message.fileBase64,
        e.data.message.signerIds
      )

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

async function initDotNetInterop(): Promise<void> {
  if (assemblyImports !== null) return

  assemblyImports = await DotNetInteropManager.instance.dotNetImports
  initializeNewParser =
    assemblyImports.SignatureParserExport.InitializeNewParser
  parseFileContents = assemblyImports.SignatureParserExport.ParseFileContents
}
