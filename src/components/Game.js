import React, { useEffect, useMemo, useState } from "react";
import { useHistory } from "react-router-dom";
import Card from "./Card";
import Skipped from "./Skipped";
import Hand from "./Hand";
import { Button, Container, Stack, Typography } from "@mui/material";

function Game({ deck, players }){
  const history = useHistory()
  const isSinglePlayer = players === '1'

  // Split shuffled deck into two player decks when deck changes
  const [playerOneDeck, setPlayerOneDeck] = useState([])
  const [playerTwoDeck, setPlayerTwoDeck] = useState([])

  // Hands and selections
  const [playerOneHand, setPlayerOneHand] = useState([])
  const [playerTwoHand, setPlayerTwoHand] = useState([])
  const [playerOneSelected, setPlayerOneSelected] = useState(null) // index in hand
  const [playerTwoSelected, setPlayerTwoSelected] = useState(null)

  // Table and simple phase control
  const [tableCards, setTableCards] = useState([]) // array of {owner: 1|2, card}
  const [message, setMessage] = useState("Click Deal to start the round")
  const [phase, setPhase] = useState("idle") // idle | deal | select | reveal | resolve

  useEffect(() => {
    if (!deck || deck.length === 0) return
    const half = Math.floor(deck.length / 2)
    setPlayerOneDeck(deck.slice(0, half))
    setPlayerTwoDeck(deck.slice(half))
    // reset any in-round state
    resetRoundState()
  }, [deck])

  function resetRoundState(){
    setPlayerOneHand([])
    setPlayerTwoHand([])
    setPlayerOneSelected(null)
    setPlayerTwoSelected(null)
    setTableCards([])
    setMessage("Click Deal to start the round")
    setPhase("idle")
  }

  // Deal up to 5 cards to each hand
  function handleDeal(){
    setPlayerOneSelected(null)
    setPlayerTwoSelected(null)

    setPlayerOneDeck(prev => {
      const drawCount = Math.min(5 - playerOneHand.length, prev.length)
      const drawn = prev.slice(0, drawCount)
      setPlayerOneHand(h => [...h, ...drawn])
      return prev.slice(drawCount)
    })

    setPlayerTwoDeck(prev => {
      const drawCount = Math.min(5 - playerTwoHand.length, prev.length)
      const drawn = prev.slice(0, drawCount)
      setPlayerTwoHand(h => [...h, ...drawn])
      return prev.slice(drawCount)
    })

    setTableCards([])
    setMessage("Select a card from each hand")
    setPhase("select")
  }

  function handleSelect(player, index){
    if (phase !== "select") return
    if (player === 1) setPlayerOneSelected(index)
    if (player === 2) {
      // Prevent manual selection for computer in single player
      if (isSinglePlayer) return
      setPlayerTwoSelected(index)
    }
  }

  const bothSelected = useMemo(() => playerOneSelected !== null && playerTwoSelected !== null, [playerOneSelected, playerTwoSelected])

  function handlePlay(){
    if (!bothSelected) return
    // Move selected cards to table
    const p1Card = playerOneHand[playerOneSelected]
    const p2Card = playerTwoHand[playerTwoSelected]
    setTableCards([{ owner: 1, card: p1Card }, { owner: 2, card: p2Card }])

    // Remove selected cards from hands
    setPlayerOneHand(h => h.filter((_, i) => i !== playerOneSelected))
    setPlayerTwoHand(h => h.filter((_, i) => i !== playerTwoSelected))
    setPlayerOneSelected(null)
    setPlayerTwoSelected(null)
    setPhase("resolve")

    // Resolve winner (no war yet; tie treated as war placeholder)
    if (p1Card.power > p2Card.power){
      setMessage("Player 1 wins the battle")
      // winner gets table cards to bottom in random order
      const winnings = shuffleArray([{ owner: 1, card: p1Card }, { owner: 2, card: p2Card }]).map(t => t.card)
      setPlayerOneDeck(d => [...d, ...winnings])
    } else if (p2Card.power > p1Card.power){
      setMessage("Player 2 wins the battle")
      const winnings = shuffleArray([{ owner: 1, card: p1Card }, { owner: 2, card: p2Card }]).map(t => t.card)
      setPlayerTwoDeck(d => [...d, ...winnings])
    } else {
      setMessage("Tie! (War handling coming next)")
      // For now: put cards back to bottoms randomly split between players
      const winnings = shuffleArray([{ owner: 1, card: p1Card }, { owner: 2, card: p2Card }]).map(t => t.card)
      // simple placeholder split
      setPlayerOneDeck(d => [...d, winnings[0]])
      if (winnings[1]) setPlayerTwoDeck(d => [...d, winnings[1]])
    }
  }

  function shuffleArray(arr){
    return [...arr].sort(() => Math.random() > .5 ? 1 : -1)
  }

  // Computer auto-select in one player mode, then auto-play
  useEffect(() => {
    if (!isSinglePlayer) return
    if (phase !== "select") return
    if (playerOneSelected === null) return
    if (playerTwoSelected !== null) return
    if (playerTwoHand.length === 0) return
    // simple AI: random pick
    const idx = Math.floor(Math.random() * playerTwoHand.length)
    setPlayerTwoSelected(idx)
  }, [isSinglePlayer, phase, playerOneSelected, playerTwoSelected, playerTwoHand])

  useEffect(() => {
    if (!isSinglePlayer) return
    if (phase !== "select") return
    if (!bothSelected) return
    handlePlay()
  }, [isSinglePlayer, phase, bothSelected])

  // If someone skips setting how many players are playing from the home screen
  if(players === 0) return <Skipped />

  return(
    <Container maxWidth="md" style={{ paddingTop: 8, paddingBottom: 16 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
        <Typography variant="h6">Testing the Game with {players === '1' ? "1 Player" : "2 Players"}!</Typography>
        <Button onClick={() => history.push("/")}>HOME</Button>
      </Stack>

      <Typography variant="body1" sx={{ mb: 1 }}>{message}</Typography>

      <Stack direction="row" spacing={3} alignItems="flex-start" flexWrap="wrap">
        <div>
          <Typography variant="subtitle1">Player 1 Deck: {playerOneDeck.length}</Typography>
          <Hand cards={playerOneHand} onSelect={(i) => handleSelect(1, i)} selectedIndex={playerOneSelected} />
        </div>

        <div>
          <Typography variant="subtitle1">{isSinglePlayer ? "Computer" : "Player 2"} Deck: {playerTwoDeck.length}</Typography>
          <Hand cards={playerTwoHand} onSelect={(i) => handleSelect(2, i)} selectedIndex={playerTwoSelected} />
        </div>
      </Stack>

      <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
        <Button variant="contained" onClick={handleDeal} disabled={phase !== "idle" && phase !== "resolve"}>Deal</Button>
        <Button variant="outlined" onClick={handlePlay} disabled={!bothSelected}>Play Selected</Button>
      </Stack>

      <div style={{ marginTop: 10 }}>
        <Typography variant="subtitle1">Table</Typography>
        <div className="card-container">
          {tableCards.map((t, idx) => (
            <Card key={idx} info={t.card} forceFaceUp={true} />
          ))}
        </div>
      </div>
    </Container>
  )
}

export default Game