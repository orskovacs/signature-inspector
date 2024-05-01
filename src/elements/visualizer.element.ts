import { LitElement, html } from 'lit'
import { customElement, state } from 'lit/decorators.js'

@customElement('visualizer-element')
export class VisualizerElement extends LitElement {
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

  render() {
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
