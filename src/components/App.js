import React, { useEffect, useState } from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./Home";
import Game from "./Game";


function App() {
  const [deck, setDeck] = useState([])
  const [newDeck, setNewDeck] = useState(0)
  const [players, setPlayers] = useState(0)

  useEffect(() => {
    const values = ["2","3","4","5","6","7","8","9","10","J","Q","K","A"];
    const suits = ["♥", "♦", "♠", "♣"];
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
    console.log(cards)
    setDeck([...cards].sort(()=> Math.random() > .5 ? 1 : -1))
  }, [newDeck])

  function updateDeck(){
    setNewDeck(v => v + 1)
  }

  function playerUpdate(playerNumer){
    setPlayers(playerNumer)
  }

  return (
    <div>
      <h1>5 In The Hand: War!</h1>
      <p>A card game designed and coded by Andrew Onulak</p>
      <button onClick={updateDeck}>New Deck {newDeck}</button>
      <Switch>
        <Route exact path="/">
          <Home onHandleClick={playerUpdate} players={players}/>
        </Route>
        <Route exact path="/Game">
          <Game deck={deck}/>
        </Route>
      </Switch>
    </div>
  )
}

export default App;
