import React from "react";

function Home({ onHandleClick, players }){

  function handleStartClick(e){
    onHandleClick(e.target.name)
  }

  return(
    <>
      <h1>How many people are playing?</h1>
      {players === 0 ? null : <h1>Seems like someone already started a {players === '1' ? "One Player" : "Two Player"} game!</h1>}
      <button onClick={handleStartClick} name="1">ONE PLAYER!</button>
      <button onClick={handleStartClick} name="2">TWO PLAYERS!</button>
    </>
    
  )
}

export default Home