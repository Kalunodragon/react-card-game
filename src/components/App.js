import React, { useEffect, useState } from "react";

function App() {
  const [deck, setDeck] = useState([])
  const [newDeck, setNewDeck] = useState(0)

  useEffect(() => {
    const values = ["2","3","4","5","6","7","8","9","10","J","Q","K","A"];
    const suits = ["Hearts", "Diamonds", "Spades", "Clubs"];
    const cards = [];
    for (let s = 0; s < suits.length; s++) {
      for (let v = 0; v < values.length; v++) {
        const value = values[v];
        const suit = suits[s];
        cards.push(
          {
             "value": value,
             "suit": suit,
             "power": v + 1
          }
        );
      } 
    }
    setDeck([...cards].sort(()=> Math.random() > .5 ? 1 : -1))
  }, [newDeck])

  function updateDeck(){
    setNewDeck(v => v + 1)
  }

  const displayed = deck.map(card => {
    return (
      <div 
        key={`${card.value} ${card.suit}`}
        className="card">
        <h1>{card.value}</h1>
        <h3>{card.suit}</h3>
      </div>
    )
  })

  return (
    <div>
      <h1>Card Game</h1>
      <button onClick={updateDeck}>New Deck {newDeck}</button>
      <div className="card-container">
        {displayed}
      </div>
    </div>
  )
}

export default App;
