import React, { useEffect, useState } from "react";
import { Route, Switch, useHistory } from "react-router-dom";
import Home from "./Home";
import Game from "./Game";

function App() {
  const [deck, setDeck] = useState([])
  const [newDeck, setNewDeck] = useState(0)
  const [players, setPlayers] = useState(0)
  const history = useHistory()

  // This useEffect() is used to created the deck of cards for the game
  useEffect(() => {
    const values = ["2","3","4","5","6","7","8","9","10","J","Q","K","A"];
    const suits = ["♥", "♦", "♠", "♣"];
    const cards = [];
    for (let s = 0; s < suits.length; s++) {
      for (let v = 0; v < values.length; v++) {
        const value = values[v];
        const suit = suits[s];
        // cards are pushed individually here, they also have a power level for easy comparing later
        cards.push(
          {
             "value": value,
             "suit": suit,
             "power": v + 1
          }
        );
      } 
    }
    // deck is logged before being shuffled
    console.log(cards)
    // deck is set to a cloned, shuffled version of the whole deck
    setDeck([...cards].sort(()=> Math.random() > .5 ? 1 : -1))
    // Variable that is watched here is for when a new shuffled deck is needed
  }, [newDeck])

  function updateDeck(){
    setNewDeck(v => v + 1)
  }
  
  function playerUpdate(playerNumer){
    setPlayers(playerNumer)
    history.push("/Game")
  }

  return (
    <div>
      <h1>5 In The Hand: War!</h1>
      <p>A card game designed and coded by Andrew Onulak, Andrew Smit, and Joshua Doud</p>
      <button onClick={updateDeck}>New Deck {newDeck}</button>
      <Switch>
        <Route exact path="/">
          <Home onHandleClick={playerUpdate} players={players}/>
        </Route>
        <Route exact path="/Game">
          <Game deck={deck} players={players}/>
        </Route>
      </Switch>
    </div>
  )
}

export default App;
