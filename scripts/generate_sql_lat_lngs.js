//for single run SQL commands
const country_coords = require('../seeds/country_coords.json') // src lat lngs to each country
const fs = require('fs')

// pre format json here
const formatRaw = (objArr) => {
  const arr = objArr.map(country => {
    return `
      UPDATE country
      SET lat = ${country.latlng[0]}, lng = ${country.latlng[1]}
      WHERE country_code = '${country.country_code}';
    `
  })
  return arr.join(`\n`)
}

const logCB = () => {
  console.log('done')
}

async function writeSQL(format, cb) {
  const info = await format(country_coords)
  fs.writeFileSync('./seeds/003.seed.country_lat_lng.sql', info)
  return cb()
}

writeSQL(formatRaw, logCB)
