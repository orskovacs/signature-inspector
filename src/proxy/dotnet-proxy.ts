// @ts-ignore
import { dotnet as dotnet_ } from '../../signature-verifier/bin/Release/net8.0/browser-wasm/AppBundle/_framework/dotnet'
import { DotnetHostBuilder } from '../../signature-verifier/bin/Release/net8.0/browser-wasm'
import type { DotnetAssemblyExports } from './dotnet-assembly-exports.ts'
import { SignatureVerifierProxy } from './signature-verifier-proxy.ts'

export const dotnet: DotnetHostBuilder = dotnet_

export class DotnetProxy {
  private static readonly _instance: DotnetProxy = new DotnetProxy();
  static get instance(): DotnetProxy {
    return this._instance
  }

  private readonly _assemblyExports: Promise<DotnetAssemblyExports>

  private readonly _signatureVerifierProxy: Promise<SignatureVerifierProxy>
  public get signatureVerifierProxy(): Promise<SignatureVerifierProxy> {
    return this._signatureVerifierProxy
  }

  private constructor() {
    this._assemblyExports = this.initializeAssemblyExports()
    this._signatureVerifierProxy = this._assemblyExports.then(a => a.SignatureVerifier.VerifierExport)
  }

  private async initializeAssemblyExports(): Promise<DotnetAssemblyExports> {
    const is_browser = typeof window != 'undefined'
    if (!is_browser) throw new Error('Expected to be running in a browser')

    const { getAssemblyExports, getConfig } = await dotnet.create()
    const config = getConfig()
    return await getAssemblyExports(config.mainAssemblyName!)
  }
}
