import textHappy1 from '../texts/happy1'
import textHappy2 from '../texts/happy2'
import textHappy3 from '../texts/happy3'

import { el, ignoredKeys } from './utils'

const texts = [textHappy1, textHappy2, textHappy3]

export default class App {
  devTear() {
    document.removeEventListener('keydown', this.onKeydown) // for HMR
    document.removeEventListener('click', this.onMouseClick) // for HMR
    this.$chooseList.innerHTML = ''
  }

  init() {
    this.$chooseList = el('chooseTextList')
    this.startingTime = 0
    this.gameStatus = 'choose' // choose | ready | active | done
    document.addEventListener('keydown', this.onKeydown)
    document.addEventListener('click', this.onMouseClick)
    this.injectTextList()
  }

  letterToDom = (l) => {
    const $letter = document.createElement('span')
    $letter.className = 'letter'
    $letter.dataset.js = 'letter'
    $letter.innerText = l
    el('text').appendChild($letter)
  }

  onKeydown = (evt) => {
    const { key, altKey, ctrlKey } = evt
    if (this.gameStatus === 'choose') {
      if (key === 'ArrowDown') {
        focusNextChooseListItem()
      } else if (key === 'ArrowUp') {
        focusPreviousChooseListItem()
      } else if (key === 'Enter' || key === ' ') {
        el('activeChooseTextListItem').firstChild.click()
      }
      return
    }
    if (!this.gameStatus.match(/active|ready/)) {
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

    if (this.gameStatus === 'ready') {
      this.gameStatus = 'active'
      this.startingTime = Date.now()
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
      this.gameStatus = 'done'
      // let dom render before presenting the alert
      setTimeout(() => {
        confirm(`done in ${this.getDuration()}\nRestart?`) ? this.restart() : this.goToChoose() // eslint-disable-line no-alert, no-unused-expressions
      }, 0)
      return
    }

    $activeLetter.nextSibling.className += ' active'
    $activeLetter.nextSibling.dataset.activeLetter = 'true'
  }

  onMouseClick = ({ target }) => {
    if (target.dataset.js === 'chooseTextTitle') {
      this.gameStatus = 'ready'
      el('choose').style.display = 'none'
      texts.find(t => t.title === target.innerText)
        .body.split('').forEach(this.letterToDom)
      makeFirstLetterActive()
    }
  }

  getDuration() {
    const diff = Date.now() - this.startingTime
    let minutes = String(Math.floor(diff / 1000 / 60))
    let seconds = String(diff % 60)
    if (minutes.length === 1) { minutes = `0${minutes}` }
    if (seconds.length === 1) { seconds = `0${seconds}` }
    return `${minutes}:${seconds}`
  }

  injectTextList() {
    texts.map(this.textToEl)
      .forEach(this.injectTextItem)
  }

  textToEl = (text, idx, _texts) => {
    const container = document.createElement('li')
    if (idx === 0) {
      container.dataset.js = 'activeChooseTextListItem'
      container.dataset.first = 'true'
      container.className = 'active'
    }
    if (idx === _texts.length - 1) {
      container.dataset.last = 'true'
    }
    container.innerHTML = `<a data-js="chooseTextTitle">${text.title}</a>`
    return container
  }

  injectTextItem = ($text) => {
    this.$chooseList.appendChild($text)
  }

  restart() {
    this.gameStatus = 'ready'
    document.querySelectorAll('.letter').forEach(this.resetLetter)
    makeFirstLetterActive()
  }

  resetLetter = ($letter) => {
    $letter.className = 'letter' // eslint-disable-line no-param-reassign
  }

  goToChoose() {
    el('choose').style.display = 'block'
    el('text').innerHTML = ''
    this.gameStatus = 'choose'
  }
}

function makeFirstLetterActive() {
  el('letter').className += ' active'
  el('letter').dataset.activeLetter = 'true'
}

function focusNextChooseListItem() {
  const $activeItem = el('activeChooseTextListItem')
  if ($activeItem.dataset.last) {
    return
  }
  $activeItem.className = ''
  delete $activeItem.dataset.js
  $activeItem.nextSibling.className = 'active'
  $activeItem.nextSibling.dataset.js = 'activeChooseTextListItem'
}

function focusPreviousChooseListItem() {
  const $activeItem = el('activeChooseTextListItem')
  if ($activeItem.dataset.first) {
    return
  }
  $activeItem.className = ''
  delete $activeItem.dataset.js
  $activeItem.previousSibling.className = 'active'
  $activeItem.previousSibling.dataset.js = 'activeChooseTextListItem'
}
