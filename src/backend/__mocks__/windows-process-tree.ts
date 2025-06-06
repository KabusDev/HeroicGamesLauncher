export interface ProcessItem {
  pid: number
  name: string
  children?: ProcessItem[]
}

export function getProcessTree(pid: number, cb: (tree: ProcessItem | undefined) => void): void {
  cb(undefined)
}
