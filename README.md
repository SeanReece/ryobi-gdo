# Ryobi GDO
**Unofficial** Ryobi garage door opener API.

Open/Close your Ryobi garage door from anywhere.

Supported Garage Doors
- GD200
- GD201

Easy to use
```js
const gdo = require('ryobi-gdo')
await gdo.login('myUsername', 'myPassword')
await gdo.connect()

// Find your door id
const devices = await gdo.getDevices()
const myDoorId = devices[0].varName

//Now we can send commands
await gdo.openDoor(myDoorId)
await gdo.closeDoor(myDoorId)
```

Also provides helper functions to get more information
```js
const gdo = require('ryobi-gdo')
await gdo.login('myUsername', 'myPassword')

// Must be authenticated but do not need to be connected
const doorStatus = await gdo.getDoorStatus() // { open: false, state: 'Opening' }
```

## API
`ryobi-gdo` exposes the following functions

### Login
Used to login to the ryobi gdo service. **Must be called before any other operations can be performed**
```js
await ryobi-gdo.login(username, password)
```
example response
```js
{
  apiKey: '123456ab`, // *WARNING* Yes your API key is 8 characters long and never expires
  username: 'username',
  password: 'password'
}
```
### connect
Used to connect to the ryobi gdo service command websocket. Used to send commands to a garage door. Connection is not needed for status requests.
```js
await ryobi-gdo.connect()
```
### openDoor
Open the door! Promise resolves when command has been sent, *not* when door has been opened. Call `getDoorStatus` to check if door is open.
```js
await openDoor('doorId')
```
### closeDoor
Close the door! Promise resolves when command has been sent, *not* when door has been closed. Call `getDoorStatus` to check if door is closed.
```js
await closeDoor('doorId')
```
### turnOnLight
### turnOffLight
### getDevices
Get a list of supported garage door openers. `varName` is the "doorId"
```js
const devices = await getDevices()
```
example response
```js
[
  {
    _id: '5e7c1c1ac0aac10c3f2b50b0',
    varName: 'a1bc2345d6e7',
    metaData: {
      sys: [Object],
      authCount: 236,
      wskAuthAttempts: [Array],
      description: 'RYOBI Connected Garage Door Opener Master Unit',
      icon: '/img/devices/gdo.png',
      version: 1,
      name: 'Garage',
      socketId: '19d93b923bx92b2981b21982918n298ns12',
      maxPostion: 95,
      minPosition: 0
    },
    enabled: true,
    deleted: false,
    createdDate: '2019-05-16T16:05:43.860Z',
    activated: 2,
    deviceTypeIds: [ 'GD201' ],
    activatedDate: '2019-05-17T04:00:01.720Z'
  }
]
```
### getDoorStatus
Get the current status of a garage door opener
```js
const status = await getDoorStatus('doorId')
```
example response
```js
{ open: true, state: 'Opening' } // Possible states: [ 'Closed', 'Open', 'Closing', 'Opening', 'Fault' ]
```
### getLightStatus
Get the current status of a garage door light
```js
const status = await getLightStatus('doorId')
```
example response
```js
{ on: true, state: 'On' }
```
