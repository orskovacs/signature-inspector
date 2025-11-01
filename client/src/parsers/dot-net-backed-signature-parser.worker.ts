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

const assemblyImports = await DotNetInteropManager.instance.dotNetImports

const initializeNewParser =
  assemblyImports.SignatureParserExport.InitializeNewParser
const parseFileContents =
  assemblyImports.SignatureParserExport.ParseFileContents

onmessage = async (e: MessageEvent<MessageData>) => {
  if (e.data.message.method === 'parse') {
    try {
      const id = initializeNewParser(e.data.message.loaderId)
      const res = await parseFileContents(
        id,
        e.data.message.fileBase64,
        e.data.message.signerIds
      )

      postMessage({ messageId: e.data.messageId, message: res })
    } catch (error) {
      postMessage({
        messageId: e.data.messageId,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error && error.stack ? error.stack : undefined,
      })
    }
  }
}
