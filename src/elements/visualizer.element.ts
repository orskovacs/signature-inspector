import { consume } from '@lit/context'
import { LitElement, css, html, nothing } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import {
  signaturesContext,
  SignatureData,
} from '../contexts/signatures.context'

@customElement('visualizer-element')
export class VisualizerElement extends LitElement {
  static styles = css`
    :host {
      height: 100%;
      margin-top: 24px;
    }

    div[role='tabpanel'] {
      height: calc(100% - 48px);
      overflow: auto;
      margin-inline: 16px;
    }
  `

  private readonly tabData: ReadonlyArray<
    [id: string, name: string, content: ReturnType<typeof html>]
  > = [
    [
      'visual',
      'Visual',
      html`<visual-representation-element></visual-representation-element>`,
    ],
    [
      'x-coord',
      'X Coordinate',
      html`<x-coords-graph-element></x-coords-graph-element>`,
    ],
    [
      'y-coord',
      'Y Coordinate',
      html`<y-coords-graph-element></y-coords-graph-element>`,
    ],
    [
      'pressure',
      'Pressure',
      html`<pressure-graph-element></pressure-graph-element>`,
    ],
  ]

  @state()
  private activeTabIndex: number = 0

  @consume({ context: signaturesContext, subscribe: true })
  private signatures!: SignatureData[]

  private get visibleSignatures(): SignatureData[] {
    return this.signatures.filter((s) => s.visible)
  }

  render() {
    if (this.visibleSignatures.length === 0) return nothing

    return html`<md-tabs>
        ${this.tabData.map(
          ([id, name], index) =>
            html`<md-primary-tab
              id="${id}-tab"
              aria-controls="${id}-panel"
              .active=${this.activeTabIndex === index}
              @click=${() => (this.activeTabIndex = index)}
            >
              ${name}
            </md-primary-tab>`
        )}
      </md-tabs>
      ${this.tabData.map(
        ([id, , content], index) =>
          html`<div
            id="${id}-panel"
            role="tabpanel"
            aria-labelledby="${id}-tab"
            ?hidden=${this.activeTabIndex !== index}
          >
            ${content}
          </div>`
      )}`
  }
}
