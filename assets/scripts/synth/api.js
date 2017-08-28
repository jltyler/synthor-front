'use strict'

const config = require('../config')
const store = require('../store')

const createPatch = (data) => {
  return $.ajax({
    url: config.apiOrigin + '/patches',
    method: 'POST',
    headers: {
      Authorization: 'Token token=' + store.user.token
    },
    data
  })
}

const updatePatch = (data) => {
  return $.ajax({
    url: config.apiOrigin + '/patches/' + store.patch.id,
    method: 'PATCH',
    headers: {
      Authorization: 'Token token=' + store.user.token
    },
    data
  })
}

module.exports = {
  createPatch,
  updatePatch
}
