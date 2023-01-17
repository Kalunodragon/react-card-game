import React from "react";

function Card({ info }){

  return (
    <div className={`card ${info.suit}`}>
      <span className="card-value-suit top">{info.value}{info.suit}</span>
      <span className="card-suit">{info.suit}</span>
      <span className="card-value-suit bot">{info.value}{info.suit}</span>
    </div>
  )
}

export default Card