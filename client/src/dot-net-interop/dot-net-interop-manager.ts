// @ts-ignore
import { dotnet as dotnet_ } from '../../../dot-net-gateway/DotNetGateway/bin/Release/net8.0/browser-wasm/AppBundle/_framework/dotnet'
import { type DotnetHostBuilder } from '../../../dot-net-gateway/DotNetGateway/bin/Release/net8.0/browser-wasm/'
import { type DotNetAssemblyExports } from './dot-net-assembly-exports.ts'
import { SignatureVerifierManager } from './signature-verifier-manager.ts'

const dotnet: DotnetHostBuilder = dotnet_

export class DotNetInteropManager {
  private static readonly _instance: DotNetInteropManager = new DotNetInteropManager();
  static get instance(): DotNetInteropManager {
    return this._instance
  }

  private readonly _assemblyExports: Promise<DotNetAssemblyExports>

  private readonly _signatureVerifierManager: Promise<SignatureVerifierManager>
  public get signatureVerifierManager(): Promise<SignatureVerifierManager> {
    return this._signatureVerifierManager
  }

  private constructor() {
    this._assemblyExports = this.initializeAssemblyExports()
    this._signatureVerifierManager = this._assemblyExports.then(a => a.DotNetGateway.SignatureVerifierExport)
  }

  private async initializeAssemblyExports(): Promise<DotNetAssemblyExports> {
    const is_browser = typeof window != 'undefined'
    if (!is_browser) throw new Error('Expected to be running in a browser')

    const { getAssemblyExports, getConfig } = await dotnet.create()
    const config = getConfig()
    return await getAssemblyExports(config.mainAssemblyName!)
  }
}
