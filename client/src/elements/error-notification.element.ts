import { customElement, query, state } from 'lit/decorators.js'
import { css, html, LitElement } from 'lit'
import { MdDialog } from '@material/web/dialog/dialog'

@customElement('error-notification-element')
export class ErrorNotificationElement extends LitElement {
  static styles = css`
    :host {
      --md-filled-button-container-color: var(--md-sys-color-error);
      --md-filled-button-label-text-color: var(--md-sys-color-on-error);
      --md-filled-button-pressed-state-layer-color: var(
        --md-sys-color-on-error
      );
      --md-filled-button-pressed-label-text-color: var(--md-sys-color-on-error);
      --md-filled-button-hover-state-layer-color: var(--md-sys-color-on-error);
      --md-filled-button-hover-label-text-color: var(--md-sys-color-on-error);
      --md-filled-button-focus-label-text-color: var(--md-sys-color-on-error);
      --md-focus-ring-color: var(--md-sys-color-error);
    }

    #error-dialog {
      width: 560px;
    }

    .error-container {
      color: var(--md-sys-color-on-error-container);
      border: 1px solid var(--md-sys-color-on-error-container);
      border-radius: 28px;
      padding-inline: 24px;
      padding-block: 18px;
      margin-bottom: 12px;
    }

    .error-container p {
      font-family: monospace;
    }
  `

  @state()
  private errors: Error[] = []

  @query('#error-dialog')
  private errorDialog!: MdDialog

  render() {
    return html`<md-dialog
      id="error-dialog"
      type="alert"
      @cancel="${(e: Event) => e.preventDefault()}"
      @keydown="${(e: KeyboardEvent) => {
        if (e.key === 'Escape') e.preventDefault()
      }}"
    >
      <div slot="content">
        ${this.errors.map(
          (error) =>
            html`
              <details class="error-container">
                <summary>${error?.name ?? 'Error'}: ${error?.message}</summary>
                <p>${error?.stack}</p>
                <p>${error?.cause}</p>
                <p>${error}</p>
              </details>
            </div>`
        )}
      </div>
      <div slot="actions">
        <md-filled-button
          @click="${() => {
            this.dismiss()
          }}"
          form="signature-loader-dialog-form"
        >
          Dismiss
        </md-filled-button>
      </div>
    </md-dialog>`
  }

  public addError(error: Error): void {
    this.errors = [...this.errors, error]
    console.error(error)
    if (!this.errorDialog.open) {
      this.errorDialog.show()
    }
  }

  private dismiss(): void {
    this.errorDialog.close().then(() => {
      this.errors = []
    })
  }
}

export class DisplayErrorEvent extends CustomEvent<{ error: Error }> {
  public static readonly key = 'display-error'

  constructor(error: Error) {
    super(DisplayErrorEvent.key, {
      bubbles: true,
      composed: true,
      detail: { error },
    })
  }
}

type CustomEventMap = {
  [DisplayErrorEvent.key]: DisplayErrorEvent
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
