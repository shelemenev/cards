const mast = [0, 140, 280, 420]
const value = [0, 100, 200, 300, 400, 500, 600, 700, 800]
const cards = []

function init() {
  for (let i = 0; i < mast.length; ++i) {
    for (let j = 0; j < value.length; ++j) {
      cards.push({
        top: mast[i],
        left: value[j]
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
}

function showCards(className, count) {
  for (let i = 0; i < count; ++i) {
    const div = document.createElement('div')
    div.className = 'card'
    let index = parseInt(Math.random() * cards.length)
    div.style.backgroundPosition = cards[index].left + 'px ' + cards[index].top + 'px'
    cards.splice(index, 1)
    document.querySelector(className).appendChild(div)
  }
}  

function checkCards(event) {
  const div = event.target
  document.querySelector('.my').removeChild(div)
  document.querySelector('.field').appendChild(div)
  div.removeEventListener('click', checkCards)
}
