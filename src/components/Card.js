import React, { useState } from "react";
import CardBack from "../FreeStockCardImage.jpg"

function Card({ info, forceFaceUp = false, isSelected = false, onClick }){
  const [clicked, setClicked] = useState(true)

  const faceUp = forceFaceUp ? true : clicked
  const shown = faceUp === false ? `card hidden${isSelected ? " selected" : ""}` : `card ${info.suit}${isSelected ? " selected" : ""}`

  function handleClicked(){
    if (onClick){
      onClick()
      return
    }
    setClicked(state => !state)
  }

  const cardInfo = faceUp === false ?
    <img src={CardBack} alt="Back of the card"/> :
    <>
      <span className="card-value-suit top">{info.value}{info.suit}</span>
      <span className="card-suit">{info.suit}</span>
      <span className="card-value-suit bot">{info.value}{info.suit}</span>
    </>

  return (
    <div className={shown} onClick={handleClicked}>
      {cardInfo}
    </div>
  )
}

export default Card