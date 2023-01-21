import React from "react";

function Home({ onHandleClick, players }){

  function handleStartClick(e){
    onHandleClick(e.target.name)
  }

  return(
    <>
      <h1>Start the game with how many players?</h1>
      {players === 0 ? null : <h1>{players}</h1>}
      <button onClick={handleStartClick} name="1">START ONE PLAYER!</button>
      <button onClick={handleStartClick} name="2">START TWO PLAYER</button>
    </>
    
  )
}

export default Home