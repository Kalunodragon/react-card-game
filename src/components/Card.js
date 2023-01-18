import React, { useState } from "react";
import CardBack from "../FreeStockCardImage.jpg"

function Card({ info }){
  const [clicked, setClicked] = useState(false)

  const shown = clicked === false ? "card hidden" : `card ${info.suit}`

  function handleClicked(){
    setClicked(state => !state)
  }

  const cardInfo = clicked === false ?
    <img src={CardBack}/> :
    <>
      <span className="card-value-suit top">{info.value}{info.suit}</span>
      <span className="card-suit">{info.suit}</span>
      <span className="card-value-suit bot">{info.value}{info.suit}</span>
    </>

  return (
    <div className={shown} onClick={handleClicked}>
      {cardInfo}
      {/* <span className="card-value-suit top">{info.value}{info.suit}</span>
      <span className="card-suit">{info.suit}</span>
      <span className="card-value-suit bot">{info.value}{info.suit}</span> */}
    </div>
  )
}

export default Card