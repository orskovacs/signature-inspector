import { DotNetInteropManager } from './dot-net-interop-manager.ts'
import {
  DotNetAssemblyExports,
  DotNetImport,
} from './dot-net-assembly-exports.ts'

export type DotNetAssemblyName = keyof DotNetAssemblyExports['DotNetGateway']

export class DotNetBackedObject<T extends DotNetImport> {
  private readonly _dotNetInteropManager = DotNetInteropManager.instance

  protected constructor(private readonly _name: DotNetAssemblyName) {}

  protected get dotNetImport(): Promise<T> {
    return this._dotNetInteropManager.dotNetImports.then(
      (a) => a.DotNetGateway[this._name] as T
    )
  }
}
