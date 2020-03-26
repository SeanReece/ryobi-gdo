const axios = require('axios')
const auth = require('./auth')

const API_URL = 'https://tti.tiwiconnect.com/api'
const supportedDevices = ['GD200', 'GD201']

/**
 * Get all GDOs registered to account
 */
const getDevices = async () => {
  if (!auth.isAuthenticated()) {
    throw new Error('Not authenticated')
  }
  try {
    const devicesResponse = await axios.get(`${API_URL}/devices`, {
      data: auth.identity,
    })
    return devicesResponse.data.result.filter((device) => supportedDevices.some((supported) => device.deviceTypeIds.includes(supported)))
  } catch (err) {
    console.error('Failed retrieving devices', err)
    return undefined
  }
}

const getStatus = async (doorId) => {
  if (!auth.isAuthenticated()) {
    throw new Error('Not authenticated')
  }
  try {
    const devicesResponse = await axios.get(`${API_URL}/devices/${doorId}`, {
      data: auth.identity,
    })
    return devicesResponse.data.result[0]
  } catch (err) {
    console.error('Failed retrieving device status', err)
    return undefined
  }
}

const getDoorStatus = async (doorId) => {
  try {
    const status = await getStatus(doorId)
    const { doorState } = status.deviceTypeMap.garageDoor_7.at
    return {
      open: !!doorState.value,
      state: doorState.enum[doorState.value],
    }
  } catch (err) {
    console.error('Failed retrieving door status', err)
    return undefined
  }
}

const getLightStatus = async (doorId) => {
  try {
    const status = await getStatus(doorId)
    const { lightState } = status.deviceTypeMap.garageLight_7.at
    return {
      on: lightState.value,
      state: lightState.value ? 'On' : 'Off',
    }
  } catch (err) {
    console.error('Failed retrieving light status', err)
    return undefined
  }
}

module.exports = {
  getDevices,
  getStatus,
  getDoorStatus,
  getLightStatus,
}
