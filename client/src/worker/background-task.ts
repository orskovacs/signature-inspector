export class BackgroundTask<T extends object, R> {
  constructor(
    private readonly worker: Worker,
    private readonly message: T
  ) {}

  public execute(): Promise<R> {
    return new Promise<R>(async (resolve, reject) => {
      const messageId = crypto.randomUUID()
      const message = {
        messageId,
        message: this.message,
      }

      const onMessageHandler = async (
        e: MessageEvent<{ messageId: typeof messageId; message: R }>
      ) => {
        if (messageId !== e.data.messageId) return

        resolve(e.data.message)
        cleanup()
      }

      const onMessageErrorHandler = async (
        e: MessageEvent<{ messageId: typeof messageId }>
      ) => {
        if (messageId !== e.data.messageId) return

        reject(e.data)
        cleanup()
      }

      const cleanup = () => {
        this.worker.removeEventListener('message', onMessageHandler)
        this.worker.removeEventListener('messageerror', onMessageErrorHandler)
      }

      this.worker.addEventListener('message', onMessageHandler)
      this.worker.addEventListener('messageerror', onMessageErrorHandler)

      this.worker.postMessage(message)
    })
  }
}
