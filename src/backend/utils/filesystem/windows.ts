
import type { Path } from 'backend/schemas'
import { access, constants } from 'fs/promises'
import si from 'systeminformation'
import type { DiskInfo } from './index'

// TODO: use win32 APIs to parse ACLs for finer-grained checks

async function getDiskInfo_windows(path: Path): Promise<DiskInfo> {
  const disks = await si.fsSize()
  const driveLetter = path.slice(0, 2).toUpperCase()
  for (const disk of disks) {
    if (disk.fs.toUpperCase().startsWith(driveLetter)) {
      const freeSpace = disk.size - disk.used
      return { freeSpace, totalSpace: disk.size }
    }
  }
  return { freeSpace: 0, totalSpace: 0 }
}

async function isWritable_windows(path: Path): Promise<boolean> {
  try {
    await access(path, constants.W_OK)
    return true
  } catch {
    return false
  }
}

export { getDiskInfo_windows, isWritable_windows }
