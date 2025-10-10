import { LitElement, css, html } from 'lit'
import { customElement } from 'lit/decorators.js'
import { ref } from 'lit/directives/ref.js'
import { signaturesContext } from '../contexts/signatures.context'
import { setupSignatureSummaryTable } from '../utils/chart.util'
import { consume } from '@lit/context'
import { Signature } from '../model/signature.ts'

@customElement('table-summary-element')
export class TableSummaryElement extends LitElement {
  static styles = css`
    :host,
    .chart-wrapper {
      width: 100%;
      height: 100%;
    }

    thead {
      position: sticky;
      top: 0;
    }
  `

  @consume({ context: signaturesContext, subscribe: true })
  private signatures!: Signature[]

  private get visibleSignatures(): Signature[] {
    return this.signatures.filter((s) => s.visible)
  }

  render() {
    if (this.visibleSignatures.length !== 1) {
      return html`<div style="font-style: oblique">
        Select one and only one signature
      </div>`
    }

    return html`<div
      class="chart-wrapper"
      ${setupChart(this.visibleSignatures[0])}
    ></div>`
  }
}

function setupChart(signature: Signature) {
  return ref((element) => {
    if (!element) {
      return
    }

    setupSignatureSummaryTable(element, signature)
  })
}
