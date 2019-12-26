const hasAtLeastOne = (reqBody) => {
  const arrWithVals = Object.values(reqBody).filter(val => val)
  if (arrWithVals.length === 0) {
    return false
  }
  return true
}

module.exports = {
  hasAtLeastOne
}
