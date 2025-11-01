import { customElement, query, state } from 'lit/decorators.js'
import { css, html, LitElement, nothing } from 'lit'
import { MdDialog } from '@material/web/dialog/dialog'
import { UUID } from '../utils/types.ts'

@customElement('loading-spinner-element')
export class LoadingSpinnerElement extends LitElement {
  static styles = css`
    :host {
      --md-circular-progress-size: 100px;
      --md-circular-progress-active-indicator-width: 6;
    }

    md-circular-progress {
      will-change: transform;
    }

    div[slot='content'] {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 18px;
    }

    span.label {
      font-style: italic;
    }
  `

  @state()
  public label: string | undefined

  @query('#loading-spinner-dialog')
  private loadingSpinnerDialog!: MdDialog

  render() {
    return html`<md-dialog
      id="loading-spinner-dialog"
      type="alert"
      @cancel="${(e: Event) => e.preventDefault()}"
      @keydown="${(e: KeyboardEvent) => e.preventDefault()}"
    >
      <div slot="content">
        <md-circular-progress
          indeterminate
          fourColor
          aria-label="${this.label}"
        ></md-circular-progress>
        ${this.label ? html`<span class="label">${this.label}</span>` : nothing}
      </div>
    </md-dialog>`
  }

  public display(label?: string): void {
    this.label = label
    if (!this.loadingSpinnerDialog.open) {
      this.loadingSpinnerDialog.show()
    }
  }

  public hide(): void {
    this.loadingSpinnerDialog.close()
    this.label = undefined
  }
}

export class BeginLoadingEvent extends CustomEvent<{
  uuid: UUID
  label?: string
}> {
  public static readonly key = 'begin-loading'

  constructor(uuid: UUID, label?: string) {
    super(BeginLoadingEvent.key, {
      bubbles: true,
      composed: true,
      detail: { uuid, label },
    })
  }
}

export class EndLoadingEvent extends CustomEvent<{
  uuid: UUID
}> {
  public static readonly key = 'end-loading'

  constructor(uuid: UUID) {
    super(EndLoadingEvent.key, {
      bubbles: true,
      composed: true,
      detail: { uuid },
    })
  }
}

type CustomEventMap = {
  [BeginLoadingEvent.key]: BeginLoadingEvent
  [EndLoadingEvent.key]: EndLoadingEvent
}

declare global {
  interface HTMLElement {
    addEventListener<K extends keyof CustomEventMap>(
      type: K,
      listener: (this: Document, ev: CustomEventMap[K]) => void
    ): void
    dispatchEvent<K extends keyof CustomEventMap>(ev: CustomEventMap[K]): void
  }
}
