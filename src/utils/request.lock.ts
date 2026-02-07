// utils/request.lock.ts
const requestLock = new Map<string, Promise<any>>()

export function withLock<T>(
  key: string,
  task: () => Promise<T>
): Promise<T> {
  if (requestLock.has(key)) {
    return requestLock.get(key) as Promise<T>
  }

  const promise = task().finally(() => {
    requestLock.delete(key)
  })

  requestLock.set(key, promise)
  return promise
}
