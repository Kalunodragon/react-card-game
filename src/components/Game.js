import React from "react";
import { useHistory } from "react-router-dom";
import Card from "./Card";

function Game({ deck, players }){
  const history = useHistory()

  const displayed = deck.map(card => {
    return (
      <Card key={`${card.value} ${card.suit}`} info={card}/>
    )
  })

  if(players === 0){
    return (
      <>
        <h1>PLEASE START THE GAME FROM THE HOME SCREEN!</h1>
        <button onClick={() => history.push("/")}>HOME</button>
      </>
    )
  }

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