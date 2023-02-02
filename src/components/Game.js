import React from "react";
import { useHistory } from "react-router-dom";
import Card from "./Card";
import Skipped from "./Skipped";

function Game({ deck, players }){
  const history = useHistory()

  const displayed = deck.map(card => {
    return (
      <Card key={`${card.value} ${card.suit}`} info={card}/>
    )
  })

  // If someone skips setting how many players are playing from the home screen
  if(players === 0) return <Skipped />

  // Game.js returns
  return(
    <>
      <h1>Testing the Game with {players === '1' ? "1 Player" : "2 Players"}!</h1>
      <button onClick={() => history.push("/")}>HOME</button>

      <div className="card-container">
        {displayed}
      </div>
    </>
  )
}

export default Game