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
      
      {/* written as physical play, will need rewording */}
      <div className="rules">
        <h1 className="gameRules">- Game Rules -</h1>
        <h3 className="gameRulesSub">- Objective -</h3>
        <p>The objective of this game is to have all of the cards in your possession at the end of the game.</p>
        <h3 className="gameRulesSub">- How the deck is prepared -</h3>
        <ul>
          <li>Using a standard deck of playing cards, shuffle them thoroughly</li>
          <li>Deal out the entire deck to the two players</li>
        </ul>
        <h3 className="gameRulesSub">- Playing the game -</h3>
        <ol>
          <li>Both players draw 5 cards from their deck to use as their hand.</li>
          <li>Both players then choose a card from their hand to play.</li>
          <li>Both players at the same time reveal their chosen card by showing it face up on the table.</li>
          <li>
            The player with the higher card wins this round. They collect both the cards and add them
            to the bottom of their deck in a random order. If the cards are the same value, this starts a war!
          </li>
          <li>In case of war! Both players choose another card to compare from whats left in their hand.</li>
          <li>
            In case of war! The player with the higher card wins! They then collect whats left in both hands
            and the cards on the table. In the event this is also a tie all current in play cards and rest of
            hands are put back at the bottom of original decks in a random order.
          </li>
          <li>At the start of each round players draw back to 5 cards in their hand.</li>
          <li>The game continues until one player has all the cards in their possession.</li>
          <li>Once a player collects all the cards they are considered the winner!</li>
        </ol>
        <h3 className="gameRulesSub">- Special Case -</h3>
        <ul>
          <li>
            In the event that war happens when players have less than 5 cards in their hand. The player with the
            lower ammount of cards forfeits the game making the other player the winner by default.
          </li>
          <li>
            In the event that a player has less then 5 cards in their hand but no deck. This player can not draw any
            more cards and will continue to play with what is left. On a round win all cards |up to 5 in hand| will
            be returned to the hand to keep playing.
          </li>      
        </ul>
      </div>
    </>
    
  )
}

export default Home