'use strict'

const $input = $('input')
const popupName = 'popup'

$input.onchange = onQuery

$input.onfocus = function () {
  this.select()
}

$input.onkeydown = function (e) {
  if (e.keyCode === 27) {
    this.value = ''
    query(null)
  } else if (e.keyCode === 13) {
    onQuery()
  }
}

document.onkeydown = function (e) {
  if (e.keyCode === 191 && e.target.id !== 'input') {
    setTimeout(function () {
      $input.focus()
    })
  }
}

function onQuery() {
  const val = $input.value
  const trimed = val.trim()
  if (val !== trimed) $input.value = trimed

  query(trimed)
}

$('list').addEventListener('click', delegate('.toggle', function (e) {
  const parent = e.target.parentNode
  if (parent.classList.contains(popupName)) {
    parent.classList.remove(popupName)
  } else {
    const el = document.querySelector('.' + popupName)
    if (el) el.classList.remove(popupName)
    if (parent.offsetLeft < 60) {
      parent.classList.add(popupName, 'popup-right')
    } else {
      parent.classList.add(popupName)
    }
  }
}))

window.onload = function () {
  fetch('data.json').then(res => {
    if (res.ok) {
      return res.json()
    }
  }).then(build)
}

function build(json) {
  if (json == null) return
  const list = []
  for (const [key, val] of Object.entries(json)) {
    const d = parseInt(key, 16)
    const s = key.padStart(4, '0')
    const entities = val.map(s => '&amp;' + s.slice(1))
    list.push(`<li data-entities="${entities}" data-hex="${key}">
      <span class="char">${val[0]}</span>
      <ul class="detail">
        ${handleEntities(entities)}
        <li>&amp;#x${key};</li>
        <li>&amp;#${d};</li>
        <li><a href="http://www.fileformat.info/info/unicode/char/${s}/index.htm">U+${s}</a></li>
      </ul>
      <span class="toggle"></span>
      </li>`)
  }
  $('loading').setAttribute('hidden', '')
  $('list').innerHTML = list.join('\n')

  function handleEntities(entities) {
    return entities.map(s => `<li>${s}</li>`).join('')
  }
}

function query(input) {
  const lastEl = document.querySelector('.' + popupName)
  if (lastEl) lastEl.classList.remove(popupName)
  $('notfound').classList.remove('show')

  if (input === '') return

  if (/^&/.test(input)) {
    const el = $('char')
    el.innerHTML = input
    input = el.textContent
  }
  else if (/^\\u/.test(input)) {
    const str = eval(`"${input}"`)
    input = str.slice(1, -1)
  }

  const hex = input.codePointAt(0).toString(16).toUpperCase()
  const el = document.querySelector(`li[data-hex="${hex}"]`)
  if (!el) {
    $('notfound').classList.add('show')
    return
  }

  el.scrollIntoView()
  el.classList.add(popupName)
}

function $(id) {
  return document.getElementById(id)
}

function delegate(selector, handler) {
  return function (e) {
    let { target, currentTarget } = e
    if (target === currentTarget) return

    while (!target.matches(selector)) {
      const parent = target.parentNode
      if (parent === currentTarget) return
      target = parent
    }

    e.delegateTarget = target
    handler.call(this, e)
  }
}
