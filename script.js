const mast = [0, 140, 280, 420]
const value = [0, 100, 200, 300, 400, 500, 600, 700, 800]
const cards = []

function init() {
  for (let i = 0; i < mast.length; ++i) {
    for (let j = 0; j < value.length; ++j) {
      cards.push({
        mast: mast[i],
        value: value[j]
      })
    }
  }

  showCards('.my', 6)
  showCards('.opponent', 6)
  showCards('.kozyr', 1)

  choiceStep()
}

function showCards(className, count) {
  for (let i = 0; i < count; ++i) {
    if (cards.length === 0) return

    const div = document.createElement('div')
    div.className = 'card'
    let index = parseInt(Math.random() * cards.length)
    div.style.backgroundPosition = cards[index].value + 'px ' + cards[index].mast + 'px'
    div.setAttribute('data-value', cards[index].value)
    div.setAttribute('data-mast', cards[index].mast)
    if (className === '.my') div.addEventListener('click', checkCards)
    cards.splice(index, 1)
    document.querySelector(className).appendChild(div)

    if (className === '.opponent') {
      div.className = 'card_unknown'
    }
  }
}

function createDuplicate (div) {
  const newDiv = document.createElement('div')
  newDiv.className = div.className
  newDiv.setAttribute('data-mast', div.getAttribute('data-mast'))
  newDiv.setAttribute('data-value', div.getAttribute('data-value'))
  newDiv.innerHTML = div.innerHTML
  newDiv.style.backgroundPosition = div.style.backgroundPosition
  return newDiv
}

function moreCards() {
  let mydivsCount = document.querySelectorAll('.my div').length
  let opponentdivsCount = document.querySelectorAll('.opponent div').length
  showCards('.my', 6 - mydivsCount)
  showCards('.opponent', 6 - opponentdivsCount)

  mydivsCount = document.querySelectorAll('.my div').length
  const kozyrdiv = document.querySelector('.kozyr div')
  let kozyrApplied = kozyrdiv.style.opacity === '0'

  if (! kozyrApplied && kozyrdiv && mydivsCount < 6) {
    kozyrdiv.style.opacity = '0'
    const newDiv = createDuplicate(kozyrdiv)
    document.querySelector('.my').appendChild(newDiv)
    newDiv.addEventListener('click', checkCards)
    kozyrApplied = true
  }

  opponentdivsCount = document.querySelectorAll('.opponent div').length

  if (! kozyrApplied && kozyrdiv && opponentdivsCount < 6) {
    kozyrdiv.style.opacity = '0'
    const newDiv = createDuplicate(kozyrdiv)
    document.querySelector('.opponent').appendChild(newDiv)
    newDiv.className = 'card_unknown'
  }

  checkWin()
}

function choiceStep() {
  const mydivs = document.querySelectorAll('.my div')
  const opponentdivs = document.querySelectorAll('.opponent div')
  const kozyrdiv = document.querySelector('.kozyr div')
  let minCard = {
    isMine: true,
    value: -1
  }

  for (let i = 0; i < 6; ++i) {
    if (mydivs[i].getAttribute('data-mast') === kozyrdiv.getAttribute('data-mast') && mydivs[i].getAttribute('data-value') > minCard.value) {
      minCard.isMine = true
      minCard.value = mydivs[i].getAttribute('data-value')
    }

    if (opponentdivs[i].getAttribute('data-mast') === kozyrdiv.getAttribute('data-mast') && opponentdivs[i].getAttribute('data-value') > minCard.value) {
      minCard.isMine = false
      minCard.value = opponentdivs[i].getAttribute('data-value')
    }
  }

  if (minCard.isMine === false) {
    checkCardsOpponent()    
  }
}  

function checkCards(event) {
  const fieldDivs = document.querySelectorAll('.field div')

  if (fieldDivs.length === 0) {
    myFirstMove(event)
  } else if (fieldDivs.length % 2 === 1) {
    myReply(event)
  } else if (fieldDivs.length % 2 === 0) {
    myContinue(event)
  }
}

function myFirstMove(event) {
  const div = event.target
  document.querySelector('.my').removeChild(div)
  document.querySelector('.field').appendChild(div)
  div.removeEventListener('click', checkCards)
  document.querySelector('.button_1').style.display = 'none'
  setTimeout(() => checkCardsOpponent(), 500)
}

function myReply(event) {
  const div = event.target
  const kozyrdiv = document.querySelector('.kozyr div')
  const cardToBeat = document.querySelectorAll('.field div')[document.querySelectorAll('.field div').length - 1]

  if (div.getAttribute('data-mast') === cardToBeat.getAttribute('data-mast')
      && div.getAttribute('data-value') < cardToBeat.getAttribute('data-value')) {
    document.querySelector('.my').removeChild(div)
    document.querySelector('.field').appendChild(div)
    div.removeEventListener('click', myReply)
    document.querySelector('.button').style.display = 'none'
    document.querySelector('.button_1').style.display = 'none'
    setTimeout(() => checkCardsOpponent(), 500)
  }

  if (cardToBeat.getAttribute('data-mast') !== kozyrdiv.getAttribute('data-mast')
      && div.getAttribute('data-mast') === kozyrdiv.getAttribute('data-mast')) {
    document.querySelector('.my').removeChild(div)
    document.querySelector('.field').appendChild(div)
    div.removeEventListener('click', myReply)
    document.querySelector('.button').style.display = 'none'
    document.querySelector('.button_1').style.display = 'none'
    setTimeout(() => checkCardsOpponent(), 500)
  } 
}

function myContinue(event) {
  const div = event.target
  const cardsInField = document.querySelectorAll('.field div')

  for (let i = 0; i < cardsInField.length; ++i) {
    if (div.getAttribute('data-value') === cardsInField[i].getAttribute('data-value')) {
      document.querySelector('.my').removeChild(div)
      document.querySelector('.field').appendChild(div)
      document.querySelector('.button').style.display = 'none'
      document.querySelector('.button_1').style.display = 'none'
      setTimeout(() => checkCardsOpponent(), 500)
    }
  }
}

function take() {
  const fieldDivs = document.querySelectorAll('.field div')
  const myDivs = document.querySelectorAll('.my div')

  for (let i = 0; i < fieldDivs.length; ++i) {
    document.querySelector('.field').removeChild(fieldDivs[i])
    document.querySelector('.my').appendChild(fieldDivs[i])
    fieldDivs[i].addEventListener('click', checkCards)
    document.querySelector('.button_1').style.display = 'none'
  }

  moreCards()
  setTimeout(() => checkCardsOpponent(), 500)
}

function takeCards() {
  const cardToBeat = document.querySelectorAll('.field div')[document.querySelectorAll('.field div').length - 1]
  const myDivs = document.querySelectorAll('.my div')
  const kozyrdiv = document.querySelector('.kozyr div')
  let canIBeat = false

  for (let i = 0; i < myDivs.length; ++i) {
    if (myDivs[i].getAttribute('data-mast') === cardToBeat.getAttribute('data-mast')
       && myDivs[i].getAttribute('data-value') < cardToBeat.getAttribute('data-value')) {
      canIBeat = true
      break
    }

    if (myDivs[i].getAttribute('data-mast') === kozyrdiv.getAttribute('data-mast')
        && cardToBeat.getAttribute('data-mast') !== kozyrdiv.getAttribute('data-mast')) {
      canIBeat = true
      break
    }
  }

  if (canIBeat === false) {
    take()
  }
}

function breakout() {
  const fieldDivs = document.querySelectorAll('.field div')

  for (let i = 0; i < fieldDivs.length; ++i) {
    document.querySelector('.field').removeChild(fieldDivs[i])
  }

  moreCards()
  setTimeout(() => checkCardsOpponent(), 500)
}

function flushCards() {
  const fieldDivs = document.querySelectorAll('.field div')
  const myDivs = document.querySelectorAll('.my div')
  let canIContinue = false

  for (let i = 0; i < myDivs.length; ++i) {
    for (let j = 0; j < fieldDivs.length; ++j) {
      if (myDivs[i].getAttribute('data-value') === fieldDivs[j].getAttribute('data-value')) {
        canIContinue = true
        break
      }
    }
  }

  if (canIContinue === false) {
    breakout()
  }
}

function checkCardsOpponent(event) {
  const fieldDivs = document.querySelectorAll('.field div')

  if (fieldDivs.length === 0) {
    opponentFirstMove()
  } else if (fieldDivs.length % 2 === 1) {
    opponentReply()
  } else if (fieldDivs.length % 2 === 0) {
    opponentContinue()
  }
}

function opponentFirstMove() {
  const divs = document.querySelectorAll('.opponent div')
  const kozyrdiv = document.querySelector('.kozyr div')
  let minCardDiv = divs[0]

  for (let i = 1; i < divs.length; ++i) {
    if (divs[i].getAttribute('data-mast') !== kozyrdiv.getAttribute('data-mast') && divs[i].getAttribute('data-value') > minCardDiv.getAttribute('data-value')) {
      minCardDiv = divs[i]
    }
  }

  document.querySelector('.opponent').removeChild(minCardDiv)
  document.querySelector('.field').appendChild(minCardDiv)
  minCardDiv.className = 'card'
  document.querySelector('.button').style.display = 'none'
  document.querySelector('.button_1').style.display = 'block'
  setTimeout(() => takeCards(), 500)
}

function opponentReply() {
  const divs = document.querySelectorAll('.opponent div')
  const kozyrdiv = document.querySelector('.kozyr div')
  const cardToBeat = document.querySelectorAll('.field div')[document.querySelectorAll('.field div').length - 1]
  let minCardDiv, minCardKozyrDiv

  for (let i = 0; i < divs.length; ++i) {
    if (divs[i].getAttribute('data-mast') === cardToBeat.getAttribute('data-mast')
        && divs[i].getAttribute('data-value') < cardToBeat.getAttribute('data-value')
        && (!minCardDiv || divs[i].getAttribute('data-value') > minCardDiv.getAttribute('data-value'))) {
      minCardDiv = divs[i]
    }

    if (cardToBeat.getAttribute('data-mast') !== kozyrdiv.getAttribute('data-mast')
        && divs[i].getAttribute('data-mast') === kozyrdiv.getAttribute('data-mast')
        && (!minCardKozyrDiv || divs[i].getAttribute('data-value') > minCardKozyrDiv.getAttribute('data-value'))) {
      minCardKozyrDiv = divs[i]
    }
  }

  const div = minCardDiv || minCardKozyrDiv

  if (div) {
    document.querySelector('.opponent').removeChild(div)
    document.querySelector('.field').appendChild(div)
    div.className = 'card'
    document.querySelector('.button').style.display = 'block'
    document.querySelector('.button_1').style.display = 'none'
    setTimeout(() => flushCards(), 500)
  } else {
    const fieldDivs = document.querySelectorAll('.field div')
    
    for (let i = 0; i < fieldDivs.length; ++i) {
      document.querySelector('.field').removeChild(fieldDivs[i])
      document.querySelector('.opponent').appendChild(fieldDivs[i])
      fieldDivs[i].className = 'card_unknown'
    }
    moreCards()
  }
}

function opponentContinue() {
  const divs = document.querySelectorAll('.opponent div')
  const kozyrdiv = document.querySelector('.kozyr div')
  const cardsInField = document.querySelectorAll('.field div')
  const myDivs = document.querySelectorAll('.my div')
  let minCardDiv, minCardKozyrDiv

  if (myDivs.length > 0) {
    for (let i = 0; i < divs.length; ++i) {
      for (let j = 0; j < cardsInField.length; ++j) {
        const cardToContinue = cardsInField[j]
        if (kozyrdiv.getAttribute('data-mast') !== divs[i].getAttribute('data-mast')
            && divs[i].getAttribute('data-value') === cardToContinue.getAttribute('data-value') 
            && (!minCardDiv || divs[i].getAttribute('data-value') > minCardDiv.getAttribute('data-value'))) {
          minCardDiv = divs[i]
        } else if (kozyrdiv.getAttribute('data-mast') === divs[i].getAttribute('data-mast')
            && divs[i].getAttribute('data-value') === cardToContinue.getAttribute('data-value') 
            && (!minCardKozyrDiv || divs[i].getAttribute('data-value') > minCardKozyrDiv.getAttribute('data-value'))) {
          minCardKozyrDiv = divs[i]
        }
      }
    }
  }

  const random = Math.random()
  const div = minCardDiv || (random > 0.5 ? minCardKozyrDiv : null)

  if (div) {
    document.querySelector('.opponent').removeChild(div)
    document.querySelector('.field').appendChild(div)
    div.className = 'card'
    document.querySelector('.button').style.display = 'none'
    document.querySelector('.button_1').style.display = 'block'
    setTimeout(() => takeCards(), 500)
  } else {
    const fieldDivs = document.querySelectorAll('.field div')
    
    for (let i = 0; i < fieldDivs.length; ++i) {
      document.querySelector('.field').removeChild(fieldDivs[i])
      document.querySelector('.button').style.display = 'none'
      document.querySelector('.button_1').style.display = 'none'
    }

    moreCards()
  }
}

function checkWin() {
  const mydivs = document.querySelectorAll('.my div')
  const opponentdivs = document.querySelectorAll('.opponent div')

  if (mydivs.length === 0 && cards.length === 0) {
    alert('Вы выиграли!')
    location.reload()  
  } else if (opponentdivs.length === 0 && cards.length === 0) {
    alert('Вы проиграли!')
    location.reload()
  }
}