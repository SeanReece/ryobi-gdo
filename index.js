const auth = require('./auth')
const ws = require('./websocket')
const rest = require('./rest')

module.exports = {
  login: auth.login,
  connect: ws.connect,
  openDoor: ws.openDoor,
  closeDoor: ws.closeDoor,
  turnOnLight: ws.turnOnLight,
  turnOffLight: ws.turnOffLight,
  getDevices: rest.getDevices,
  getDoorStatus: rest.getDoorStatus,
  getLightStatus: rest.getLightStatus,
}
