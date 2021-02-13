const fs = require('fs')

const style = fs.readFileSync('../app/css/critical.min.css', 'utf8')

console.log(style)
