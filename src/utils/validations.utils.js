const hasAtLeastOne = (patchBody) => {
  const arrWithVals = Object.values(patchBody).filter(val => val)
  if (arrWithVals.length === 0) {
    return res.status(400).json({ error: { message: `patch body must contain at least one required field` } })
  }
  return
}

module.exports = {
  hasAtLeastOne
}
