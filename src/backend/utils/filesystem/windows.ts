
import type { Path } from 'backend/schemas'
import { GetNamedSecurityInfoW, SE_OBJECT_TYPE, DACL_SECURITY_INFORMATION } from 'win32-api'
import si from 'systeminformation'
import type { DiskInfo } from './index'

// TODO: implement parseSecurityDescriptor to properly enumerate ACL entries

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
  return new Promise<boolean>((resolve) => {
    // Replaced Get-Acl with win32-api GetNamedSecurityInfoW
    GetNamedSecurityInfoW(
      path,
      SE_OBJECT_TYPE.SE_FILE_OBJECT,
      DACL_SECURITY_INFORMATION,
      null,
      null,
      null,
      null,
      (err, pSD) => {
        if (err !== 0) return resolve(false)
        // TODO: implement parseSecurityDescriptor to check FileSystemRights.Modify
        resolve(true)
      }
    )
  })
}

export { getDiskInfo_windows, isWritable_windows }
