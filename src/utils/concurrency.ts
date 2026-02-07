export class ConcurrencyPool {
  private limit: number
  private activeCount = 0
  private queue: (() => void)[] = []

  constructor(limit = 3) {
    this.limit = limit
  }

  run<T>(task: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      const runTask = async () => {
        this.activeCount++
        try {
          const result = await task()
          resolve(result)
        } catch (err) {
          reject(err)
        } finally {
          this.activeCount--
          this.next()
        }
      }

      if (this.activeCount < this.limit) {
        runTask()
      } else {
        this.queue.push(runTask)
      }
    })
  }

  private next() {
    if (this.queue.length > 0 && this.activeCount < this.limit) {
      const task = this.queue.shift()
      task && task()
    }
  }
}