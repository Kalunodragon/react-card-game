import React from "react";
import Card from "./Card";

function Hand({ cards, onSelect, selectedIndex, faceUp = true, disabled = false }){

  return(
    <div className="hand-container">
      {cards.map((c, i) => (
        <Card
          key={`${c.value}-${c.suit}-${i}`}
          info={c}
          forceFaceUp={faceUp}
          forceFaceDown={!faceUp}
          isSelected={selectedIndex === i}
          onClick={() => { if(!disabled) onSelect(i) }}
        />
      ))}
    </div>
  )
}

export default Hand