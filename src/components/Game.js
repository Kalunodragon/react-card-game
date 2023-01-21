import React from "react";
import Card from "./Card";

function Game({ deck }){
  debugger
  const displayed = deck.map(card => {
    return (
      <Card key={`${card.value} ${card.suit}`} info={card}/>
    )
  })

  return(
    <>
      <h1>Game Test</h1>
      <div className="card-container">
        {displayed}
      </div>
    </>
  )
}

export default Game