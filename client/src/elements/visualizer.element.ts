import { provide } from '@lit/context'
import { LitElement, css, html, nothing } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { normalizeDataContext } from '../contexts/normalize-data.context'

@customElement('visualizer-element')
export class VisualizerElement extends LitElement {
  static styles = css`
    :host {
      display: grid;
      grid-template-rows: 48px 1fr;
      grid-template-columns: 1fr 180px;
    }

    div[role='tabpanel'] {
      height: 100%;
      overflow: clip;
      grid-column: 1 / 3;
      border-bottom-left-radius: inherit;
      border-bottom-right-radius: inherit;
    }

    div[role='tabpanel']#summary-panel {
      overflow: auto;
    }

    md-tabs {
      display: flex;
      overflow: auto;
      scrollbar-width: none;
      border-top-left-radius: inherit;
    }

    label {
      font-size: var(
        --md-primary-tab-label-text-size,
        var(--md-sys-typescale-title-small-size, 0.875rem)
      );
      justify-self: end;
      display: flex;
      align-items: center;
      margin-inline: 16px;
      margin-left: 26px;
      gap: 6px;
    }
  `

  @provide({ context: normalizeDataContext })
  @state()
  private normalizeData: boolean = false

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
    [
      'summary',
      'Summary',
      html`<table-summary-element></table-summary-element>`,
    ],
  ]

  @state()
  private activeTabIndex: number = 0

  render() {
    return html`
      <md-tabs>
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
      <label>
        Normalize:
        <md-switch
          .selected=${this.normalizeData}
          @click=${() => (this.normalizeData = !this.normalizeData)}
        ></md-switch>
      </label>
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
      )}
    `
  }
}
