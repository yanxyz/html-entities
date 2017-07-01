#!/usr/bin/env node

const fs = require('fs')
const data = require('./entities.json')

const m = new Map()
for (const [key, val] of Object.entries(data)) {
  //
  if (!key.endsWith(';')) continue
  const c = val.characters
  const h = c.codePointAt(0).toString(16).toUpperCase()
  if (m.has(h)) {
    m.get(h).push(key)
  } else {
    m.set(h, [key])
  }
}
fs.writeFileSync('data.json', JSON.stringify(strMapToObj(m)), 'utf8')

function strMapToObj(strMap) {
  const obj = Object.create(null)
  for (const [k, v] of strMap) {
    obj[k] = v
  }
  return obj
}
