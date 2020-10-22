const exiftool = require('node-exiftool')
const ep = new exiftool.ExiftoolProcess()

ep
  .open()
  // read and write metadata operations
  .then(() => ep.close())
  .then(() => console.log('Closed exiftool'))
  .catch(console.error)