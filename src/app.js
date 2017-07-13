import textHappy1 from '../texts/happy1'
import textHappy2 from '../texts/happy2'

const texts = [textHappy1, textHappy2]

export default () => {
  const $chooseList = el('chooseTextList')
  const ignoredKeys = getIgnoredKeys()
  let startingTime = 0
  let gameStatus = 'choose' // choose | ready | active | done

  document.addEventListener('keydown', onKeydown)
  document.addEventListener('click', onClick)
  injectTextList()

  function letterToDom(l) {
    const $letter = document.createElement('span')
    $letter.className = 'letter'
    $letter.dataset.js = 'letter'
    $letter.innerText = l
    el('text').appendChild($letter)
  }

  function makeFirstLetterActive() {
    el('letter').className += ' active'
    el('letter').dataset.activeLetter = 'true'
  }

  function onKeydown(evt) {
    const { key, altKey, ctrlKey } = evt
    console.log('key', key)
    if (gameStatus === 'choose') {
      if (key === 'ArrowDown') {
        focusNextChooseListItem()
      } else if (key === 'ArrowUp') {
        focusPreviousChooseListItem()
      }
      return
    }
    if (!gameStatus.match(/active|ready/)) {
      return
    }

    const $activeLetter = document.querySelector('[data-active-letter]')

    if (key === 'Backspace') {
      if ($activeLetter.previousSibling.length > 1) {
        return
      }
      delete $activeLetter.dataset.activeLetter
      $activeLetter.className = 'letter'
      $activeLetter.previousSibling.className = 'letter active'
      $activeLetter.previousSibling.dataset.activeLetter = 'true'
      return
    }

    if (ignoredKeys.includes(key) || altKey || ctrlKey) {
      return
    }

    if (gameStatus === 'ready') {
      gameStatus = 'active'
      startingTime = Date.now()
      console.log('game started!') // eslint-disable-line no-console
    }

    evt.preventDefault()
    delete $activeLetter.dataset.activeLetter

    if (key === $activeLetter.innerText) {
      $activeLetter.className = 'letter correct'
    } else {
      $activeLetter.className = 'letter wrong'
    }

    if (!$activeLetter.nextSibling) {
      gameStatus = 'done'
      alert(`done in ${getDuration()}`) // eslint-disable-line no-alert
      return
    }

    $activeLetter.nextSibling.className += ' active'
    $activeLetter.nextSibling.dataset.activeLetter = 'true'
  }

  function onClick({ target }) {
    if (target.dataset.js === 'chooseTextTitle') {
      gameStatus = 'ready'
      el('choose').style.display = 'none'
      texts.find(t => t.title === target.innerText)
        .body.split('').forEach(letterToDom)
      makeFirstLetterActive()
    }
  }

  function getIgnoredKeys() {
    return ['Meta', 'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12', 'Shift', 'Control', 'CapsLock', 'Alt', 'Tab']
  }

  function getDuration() {
    const diff = Date.now() - startingTime
    let minutes = String(Math.floor(diff / 1000 / 60))
    let seconds = String(diff % 60)
    if (minutes.length === 1) { minutes = `0${minutes}` }
    if (seconds.length === 1) { seconds = `0${seconds}` }
    return `${minutes}:${seconds}`
  }

  function injectTextList() {
    texts.map(textToEl)
      .forEach(injectTextItem)
  }

  function textToEl(text, idx) {
    const container = document.createElement('li')
    if (idx === 0) {
      container.dataset.activeChooseTextListItem = 'true'
      container.className = 'active'
    }
    container.innerHTML = `<a data-js="chooseTextTitle">${text.title}</a>`
    return container
  }

  function injectTextItem($text) {
    $chooseList.appendChild($text)
  }

  function focusNextChooseListItem() {

  }
  function focusPreviousChooseListItem() {

  }

  function el(jsId) {
    return document.querySelector(`[data-js="${jsId}"]`)
  }
}
