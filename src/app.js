export default () => {
  const $chooseList = el('chooseTextList')
  const texts = getTexts()
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
    if (!gameStatus.match(/active|ready/)) {
      return
    }

    const { key, altKey, ctrlKey } = evt
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

  function getTexts() {
    return [
      { title: 'Happy 1', body: `Happy things are things that are there to feel good as things that are happy are feeling and it's easy to feel happy as happy things are as happy in a way that feels good as you feel now.` }, // eslint-disable-line
      { title: 'Happy 2', body: `Happy things are things that are there to get you to feel a feeling  just things that are feeling happy and it's easy to feel happy as happy things are just happy in a way that feels good now.` }, // eslint-disable-line
    ]
  }

  function injectTextList() {
    texts.map(textToEl)
      .forEach(injectTextItem)
  }

  function textToEl({ title }) {
    const container = document.createElement('li')
    container.innerHTML = `<a data-js="chooseTextTitle">${title}</a>`
    return container
  }

  function injectTextItem($text) {
    $chooseList.appendChild($text)
  }

  function el(jsId) {
    return document.querySelector(`[data-js="${jsId}"]`)
  }
}
