import si from 'systeminformation'
import { getDiskInfo_windows, isWritable_windows } from '../windows'
import { promises as fs } from 'fs'
import type { Path } from 'backend/schemas'

describe('getDiskInfo_windows', () => {
  it('Works with root path', async () => {
    const siSpy = jest
      .spyOn(si, 'fsSize')
      .mockResolvedValue([
        { fs: 'C:', used: 90, size: 100 } as any
      ])

    const ret = await getDiskInfo_windows('C:' as Path)
    expect(ret.totalSpace).toBe(100)
    expect(ret.freeSpace).toBe(10)
    expect(siSpy).toHaveBeenCalledTimes(1)
  })

  it('Works with nested path', async () => {
    const siSpy = jest
      .spyOn(si, 'fsSize')
      .mockResolvedValue([
        { fs: 'C:', used: 90, size: 100 } as any
      ])

    const ret = await getDiskInfo_windows('C:/foo/bar/baz' as Path)
    expect(ret.totalSpace).toBe(100)
    expect(ret.freeSpace).toBe(10)
    expect(siSpy).toHaveBeenCalledTimes(1)
  })
})

describe('isWritable_windows', () => {
  it('returns true for writable path', async () => {
    const tmp = await fs.mkdtemp('writeable')
    const result = await isWritable_windows(tmp as Path)
    await fs.rmdir(tmp)
    expect(result).toBe(true)
  })

  it('returns false for unwritable path', async () => {
    if (process.platform !== 'win32') {
      expect(true).toBe(true)
      return
    }
    const tmp = await fs.mkdtemp('readonly')
    await fs.chmod(tmp, 0o444)
    const result = await isWritable_windows(tmp as Path)
    await fs.chmod(tmp, 0o755)
    await fs.rmdir(tmp)
    expect(result).toBe(false)
  })
})
