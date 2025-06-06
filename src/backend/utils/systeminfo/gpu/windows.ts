import si from 'systeminformation'

import type { PartialGpuInfo } from './index'

async function getGpuInfo_windows(): Promise<PartialGpuInfo[]> {
  const info = await si.graphics()
  const videoControllers = info.controllers.map((c) => ({
    AdapterCompatibility: c.vendor || '',
    DriverVersion: c.driverVersion || '',
    PnPDeviceID: (c as any).pnpDeviceId || ''
  }))

  const gpus: PartialGpuInfo[] = []
  for (const gpu of videoControllers) {
    const formattedDriverVersion = getFormattedDriverVersion(
      gpu.DriverVersion,
      gpu.AdapterCompatibility
    )
    const idsMatch = gpu.PnPDeviceID.match(
      /VEN_(.{4})&DEV_(.{4})&SUBSYS_(.{4})(.{4})/
    )
    // These values *are* in hexadecimal format, but they're uppercase for
    // some reason. Everything else expects them to be lowercase, and this
    // is the only time they're uppercase, so convert them here
    const vendorId = idsMatch?.[1]?.toLowerCase()
    const deviceId = idsMatch?.[2]?.toLowerCase()
    const subdeviceId = idsMatch?.[3]?.toLowerCase()
    const subvendorId = idsMatch?.[4]?.toLowerCase()
    if (!deviceId || !vendorId) continue

    gpus.push({
      deviceId,
      vendorId,
      subdeviceId,
      subvendorId,
      driverVersion: formattedDriverVersion
    })
  }
  return gpus
}

function getFormattedDriverVersion(
  driverVersion: string,
  gpuManufacturer: string
): string {
  switch (gpuManufacturer) {
    // NVIDIA's driver versions are formatted like this: 31.0.15.3713. If we
    // grab the last 5 numbers from that & add a dot after the 3rd one, we get
    // the actual driver version (in this case 537.13)
    case 'NVIDIA': {
      const driverVersionNoDots = driverVersion.replaceAll('.', '')
      return `${driverVersionNoDots.slice(-5, -2)}.${driverVersion.slice(-2)}`
    }
    // AMD uses completely different version formatting schemas for this vs.
    // the actual driver version. It's technically possible to convert this
    // back, but it'd involve using something like a database of IDs
    // FIXME: Maybe come back to this
    case 'Advanced Micro Devices, Inc.':
      return driverVersion
    // FIXME: *I think* Intel's version numbers are just as-is
    case 'Intel Corporation':
      return driverVersion
    default:
      return driverVersion
  }
}

export { getGpuInfo_windows }
