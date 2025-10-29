import React from "react";
import Card from "./Card";

function Hand({ cards, onSelect, selectedIndex }){

  return(
    <div className="hand-container">
      {cards.map((c, i) => (
        <Card
          key={`${c.value}-${c.suit}-${i}`}
          info={c}
          forceFaceUp={true}
          isSelected={selectedIndex === i}
          onClick={() => onSelect(i)}
        />
      ))}
    </div>
  )
}

export default Hand