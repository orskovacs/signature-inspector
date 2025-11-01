// @ts-ignore
import { dotnet as dotnet_ } from '../../../dot-net-gateway/DotNetGateway/bin/Release/net8.0/browser-wasm/AppBundle/_framework/dotnet'
import { type DotnetHostBuilder } from '../../../dot-net-gateway/DotNetGateway/bin/Release/net8.0/browser-wasm/'
import { type DotNetAssemblyExports } from './dot-net-assembly-exports.ts'

type DotNetGateway = DotNetAssemblyExports['DotNetGateway']

const dotnet: DotnetHostBuilder = dotnet_

export class DotNetInteropManager {
  private static readonly _instance: DotNetInteropManager =
    new DotNetInteropManager()
  static get instance(): DotNetInteropManager {
    return this._instance
  }

  private readonly _dotNetImports: Promise<DotNetGateway>
  public get dotNetImports(): Promise<DotNetGateway> {
    return this._dotNetImports
  }

  private constructor() {
    this._dotNetImports = this.initializeAssemblyExports()
  }

  private async initializeAssemblyExports(): Promise<DotNetGateway> {
    const { getAssemblyExports, getConfig } = await dotnet.create()
    const config = getConfig()
    const assemblyExports = await getAssemblyExports(config.mainAssemblyName!)
    return assemblyExports.DotNetGateway
  }
}
