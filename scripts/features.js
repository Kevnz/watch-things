const fs = require('fs')
const features = require('creature-features')();

fs.writeFileSync('./src/features.json', JSON.stringify(features, null, 2))