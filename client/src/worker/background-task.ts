export class BackgroundTask<T extends object, R> {
  constructor(
    private readonly worker: Worker,
    private readonly message: T,
    private readonly transfer?: Transferable[]
  ) {}

  public execute(): Promise<R> {
    return new Promise<R>((resolve, reject) => {
      const messageId = crypto.randomUUID()
      const message = {
        messageId,
        message: this.message,
      }

      const onMessageHandler = (
        e: MessageEvent<{
          messageId: typeof messageId
          message: R
          error?: Error
        }>
      ) => {
        if (messageId !== e.data.messageId) return

        if ('error' in e.data && e.data.error !== undefined) {
          reject(e.data.error)
        } else {
          resolve(e.data.message)
        }

        cleanup()
      }

      const onMessageErrorHandler = (e: MessageEvent) => {
        reject(
          new Error(
            `Worker messageerror event. Details: ${JSON.stringify(e.data)}`
          )
        )
        cleanup()
      }

      const onErrorHandler = (e: ErrorEvent) => {
        reject(e)
        cleanup()
      }

      const cleanup = () => {
        this.worker.removeEventListener('message', onMessageHandler)
        this.worker.removeEventListener('messageerror', onMessageErrorHandler)
        this.worker.removeEventListener('error', onErrorHandler)
      }

      this.worker.addEventListener('message', onMessageHandler)
      this.worker.addEventListener('messageerror', onMessageErrorHandler)
      this.worker.addEventListener('error', onErrorHandler)

      if (this.transfer) this.worker.postMessage(message, this.transfer)
      else this.worker.postMessage(message)
    })
  }
}
