const hasAtLeastOne = (reqBody) => {
  const arrWithVals = Object.values(reqBody).filter(val => val)
  return arrWithVals.length > 0  ?  true : false
}


module.exports = {}
