// const hasAtLeastOne = (reqBody) => {
//   const arrWithVals = Object.values(reqBody).filter(val => val)
//   return arrWithVals.length > 0  ?  true : false
// }

const hasAtLeastOne = (reqBody, res) => {
  const arrWithVals = Object.values(reqBody).filter(val => val)
  if (arrWithVals.length === 0) {
    return res.status(400).json({ error: { message: 'must contain at least one required field' } }).end()
  }
  return
}




module.exports = {
  hasAtLeastOne
}
