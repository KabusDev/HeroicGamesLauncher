declare module 'regedit' {
  export interface ListResult {
    [key: string]: {
      keys: string[]
      values: Record<string, { value: unknown }>
    }
  }
  export function list(
    keys: string | readonly string[],
    callback: (err: Error | null, result: ListResult) => void
  ): void
}
