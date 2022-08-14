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

  const divs = document.querySelectorAll('.my div')

  for (let i = 0; i < divs.length; ++i) {
    divs[i].addEventListener('click', checkCards)
  }

  choiceStep()
}

function showCards(className, count) {
  for (let i = 0; i < count; ++i) {
    const div = document.createElement('div')
    div.className = 'card'
    let index = parseInt(Math.random() * cards.length)
    div.style.backgroundPosition = cards[index].value + 'px ' + cards[index].mast + 'px'
    div.setAttribute('data-value', cards[index].value)
    div.setAttribute('data-mast', cards[index].mast)
    cards.splice(index, 1)
    document.querySelector(className).appendChild(div)

    if (className === '.opponent') {
      //div.className = 'card_unknown'
    }
  }
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
  setTimeout(() => checkCardsOpponent(), 500)
}

function myReply(event) {
  const div = event.target
}

function myContinue(event) {
  const div = event.target
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
  let minCard = -1
  let minCardDiv = null

  for (let i = 0; i < divs.length; ++i) {
    if (divs[i].getAttribute('data-mast') !== kozyrdiv.getAttribute('data-mast') && divs[i].getAttribute('data-value') > minCard) {
      minCard = divs[i].getAttribute('data-value')
      minCardDiv = divs[i]
    }
  }

  document.querySelector('.opponent').removeChild(minCardDiv)
  document.querySelector('.field').appendChild(minCardDiv)
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
  } else {
    const fieldDivs = document.querySelectorAll('.field div')
    
    for (let i = 0; i < fieldDivs.length; ++i) {
      document.querySelector('.field').removeChild(fieldDivs[i])
      document.querySelector('.opponent').appendChild(fieldDivs[i])
    }   
  }
}

function opponentContinue() {
  const divs = document.querySelectorAll('.opponent div')
  const kozyrdiv = document.querySelector('.kozyr div')
  const cardsInField = document.querySelectorAll('.field div')
  let minCardDiv, minCardKozyrDiv

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

  const random = Math.random()
  const div = minCardDiv || (random > 0.5 ? minCardKozyrDiv : null)

  if (div) {
    document.querySelector('.opponent').removeChild(div)
    document.querySelector('.field').appendChild(div)
  } else {
    const fieldDivs = document.querySelectorAll('.field div')
    
    for (let i = 0; i < fieldDivs.length; ++i) {
      document.querySelector('.field').removeChild(fieldDivs[i])
    }   
  } 
}

function checkStep() {
  const divs = document.querySelectorAll('.field div')
  const opponentValue = divs[divs.length - 1].getAttribute('data-value')
  const myValue = divs[divs.length - 2].getAttribute('data-value')


}

function checkWin() {
  const mydivs = document.querySelectorAll('.my div')
  const opponentdivs = document.querySelectorAll('.opponent div')

  if (mydivs.length === 0) {
    alert('Вы выиграли!')
    location.reload()  
  } else if (opponentdivs.length === 0) {
    alert('Вы проиграли!')
    location.reload()
  }
}