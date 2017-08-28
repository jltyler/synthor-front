const store = require('../store')

const createPatchSuccess = res => {
  console.log('createPatchSuccess')
  console.log(res)
  store.patch = res.patch
}
const createPatchError = res => {
  console.log('createPatchError')
  console.log(res)
}

const updatePatchSuccess = res => {
  console.log('updatePatchSuccess')
  console.log(res)
}
const updatePatchError = res => {
  console.log('updatePatchError')
  console.log(res)
}

module.exports = {
  createPatchSuccess,
  createPatchError,
  updatePatchSuccess,
  updatePatchError
}
