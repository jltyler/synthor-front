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

const indexPatch = () => {
  return $.ajax({
    url: config.apiOrigin + '/patches',
    method: 'GET',
    headers: {
      Authorization: 'Token token=' + store.user.token
    }
  })
}

const indexPatchPublic = () => {
  return $.ajax({
    url: config.apiOrigin + '/patches',
    method: 'GET'
  })
}

const showPatch = (id) => {
  return $.ajax({
    url: config.apiOrigin + '/patches/' + id,
    method: 'GET',
    headers: {
      Authorization: 'Token token=' + store.user.token
    }
  })
}

const showPatchPublic = (id) => {
  return $.ajax({
    url: config.apiOrigin + '/patches/' + id,
    method: 'GET'
  })
}

const deletePatch = (id) => {
  return $.ajax({
    url: config.apiOrigin + '/patches/' + id,
    method: 'DELETE',
    headers: {
      Authorization: 'Token token=' + store.user.token
    }
  })
}

module.exports = {
  createPatch,
  updatePatch,
  indexPatch,
  indexPatchPublic,
  showPatch,
  showPatchPublic,
  deletePatch,
}
