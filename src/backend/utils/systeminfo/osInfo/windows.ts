import si from 'systeminformation'

async function osInfo_windows(): Promise<{ name: string; version?: string }> {
  try {
    const info = await si.osInfo()
    return { name: info.distro, version: info.release }
  } catch {
    return { name: 'Unknown Windows Version' }
  }
}

export { osInfo_windows }
