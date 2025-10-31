import { DotNetInteropManager } from '../dot-net-interop/dot-net-interop-manager.ts'

onmessage = async (
  e: MessageEvent<{ loaderId: string; fileBase64: string; signerIds: string[] }>
) => {
  const assemblyImports = await DotNetInteropManager.instance.dotNetImports

  const initializeNewParser =
    assemblyImports.SignatureParserExport.InitializeNewParser
  const parseFileContents =
    assemblyImports.SignatureParserExport.ParseFileContents

  const id = initializeNewParser(e.data.loaderId)
  const res = await parseFileContents(id, e.data.fileBase64, e.data.signerIds)

  postMessage(res)
}
