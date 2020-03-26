const WebSocket = require('ws')
const auth = require('./auth')

const WS_URL = 'wss://tti.tiwiconnect.com/api/wsrpc'

let ws

let wsCommandId = 1

const commands = {
  openDoor: { doorCommand: 1 },
  closeDoor: { doorCommand: 0 },
  lightOn: { lightState: true },
  lightOff: { lightState: false },
}

const connect = async () => new Promise((resolve, reject) => {
  console.log(auth)
  if (!auth.isAuthenticated()) {
    throw new Error('Not authenticated')
  }
  ws = new WebSocket(WS_URL)
  ws.once('open', () => {
    ws.send(
      JSON.stringify({
        jsonrpc: '2.0',
        id: wsCommandId,
        method: 'srvWebSocketAuth',
        params: { varName: auth.identity.username, apiKey: auth.identity.apiKey },
      }),
    )
  })
  ws.once('message', (data) => {
    const { params = {} } = JSON.parse(data)
    if (params && params.authorized === true) {
      resolve()
    } else if (params && params.authorized === false) {
      reject(new Error('Not authorized'))
    }
  })
})

/**
 * Send a garage door command
 * @param {string} doorId
 * @param {} command
 */
const sendCommand = async (doorId, command) => {
  if (!auth.isAuthenticated()) {
    throw new Error('Not authenticated')
  }
  try {
    if (!ws) {
      await connect()
    }
    ws.send(
      JSON.stringify({
        jsonrpc: '2.0',
        id: wsCommandId += 1,
        method: 'gdoModuleCommand',
        params: {
          msgType: 16,
          moduleType: 5,
          portId: 7,
          moduleMsg: command,
          topic: doorId,
        },
      }),
    )
  } catch (err) {
    console.error('Failed sending command', err)
  }
}

const openDoor = async (doorId) => {
  await sendCommand(doorId, commands.openDoor)
}

const closeDoor = async (doorId) => {
  await sendCommand(doorId, commands.closeDoor)
}

const turnOnLight = async (doorId) => {
  await sendCommand(doorId, commands.lightOn)
}

const turnOffLight = async (doorId) => {
  await sendCommand(doorId, commands.lightOff)
}

module.exports = {
  connect,
  sendCommand,
  openDoor,
  closeDoor,
  turnOnLight,
  turnOffLight,
}
