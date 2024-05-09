import { LitElement, css, html, nothing } from 'lit'
import { customElement, state } from 'lit/decorators.js'

@customElement('visualizer-element')
export class VisualizerElement extends LitElement {
  static styles = css`
    div[role='tabpanel'] {
      height: calc(100% - 48px);
      overflow: auto;
      margin-inline: 16px;
    }

    md-tabs {
      display: flex;
      overflow: auto;
      scrollbar-width: none;
    }
  `

  private readonly tabData: ReadonlyArray<
    [id: string, name: string, content: ReturnType<typeof html>]
  > = [
    [
      'x-coord',
      'X Coordinate',
      html`<graph-element feature="xCoord"></graph-element>`,
    ],
    [
      'y-coord',
      'Y Coordinate',
      html`<graph-element feature="yCoord"></graph-element>`,
    ],
    [
      'pressure',
      'Pressure',
      html`<graph-element feature="pressure"></graph-element>`,
    ],
    [
      'altitude-angle',
      'Altitude Angle',
      html`<graph-element feature="altitudeAngle"></graph-element>`,
    ],
    [
      'azimuth-angle',
      'Azimuth Angle',
      html`<graph-element feature="azimuthAngle"></graph-element>`,
    ],
    [
      'visual',
      'Visual',
      html`<visual-representation-element></visual-representation-element>`,
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
            ${this.activeTabIndex === index ? content : nothing}
          </div>`
      )}`
  }
}
