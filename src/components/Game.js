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
  const [currentPlayer, setCurrentPlayer] = useState(1) // 1 or 2 during select
  const [warActive, setWarActive] = useState(false)

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
    setCurrentPlayer(1)
    setWarActive(false)
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
    setMessage("Player 1: select a card")
    setPhase("select")
    setCurrentPlayer(1)
  }

  function handleSelect(player, index){
    if (phase !== "select") return
    // Only current player can select
    if (!isSinglePlayer && player !== currentPlayer) return

    if (player === 1) {
      setPlayerOneSelected(index)
      if (isSinglePlayer) {
        // Computer picks and then auto-play
        if (playerTwoHand.length > 0){
          const idx = Math.floor(Math.random() * playerTwoHand.length)
          setPlayerTwoSelected(idx)
          // allow state to settle then play
          setTimeout(() => handlePlay(), 0)
        }
      } else {
        // Two player: switch to player 2
        setCurrentPlayer(2)
        setMessage("Player 2: select a card")
      }
    } else if (player === 2) {
      // Prevent manual selection for computer in single player
      if (isSinglePlayer) return
      setPlayerTwoSelected(index)
      // After P2 selects, auto-play
      setTimeout(() => handlePlay(), 0)
    }
  }

  const bothSelected = useMemo(() => playerOneSelected !== null && playerTwoSelected !== null, [playerOneSelected, playerTwoSelected])

  function handlePlay(){
    if (!bothSelected) return
    // Move selected cards to table
    const p1Card = playerOneHand[playerOneSelected]
    const p2Card = playerTwoHand[playerTwoSelected]

    const newP1Hand = playerOneHand.filter((_, i) => i !== playerOneSelected)
    const newP2Hand = playerTwoHand.filter((_, i) => i !== playerTwoSelected)

    setTableCards(prev => [...prev, { owner: 1, card: p1Card }, { owner: 2, card: p2Card }])

    // Apply hand updates
    setPlayerOneHand(newP1Hand)
    setPlayerTwoHand(newP2Hand)
    setPlayerOneSelected(null)
    setPlayerTwoSelected(null)
    setPhase("resolve")

    // Resolve winner with war rules
    if (p1Card.power > p2Card.power){
      if (warActive){
        setMessage("Player 1 wins the war!")
        // winner takes entire table and both remaining hands
        setPlayerOneDeck(d => [...d, ...shuffleArray([...tableCards, { owner: 1, card: p1Card }, { owner: 2, card: p2Card }]).map(t => t.card), ...shuffleArray(playerOneHand).map(c=>c), ...shuffleArray(playerTwoHand).map(c=>c)])
        setPlayerOneHand([])
        setPlayerTwoHand([])
        setWarActive(false)
      } else {
        setMessage("Player 1 wins the battle")
        const winnings = shuffleArray([{ owner: 1, card: p1Card }, { owner: 2, card: p2Card }]).map(t => t.card)
        setPlayerOneDeck(d => [...d, ...winnings])
      }
    } else if (p2Card.power > p1Card.power){
      if (warActive){
        setMessage("Player 2 wins the war!")
        setPlayerTwoDeck(d => [...d, ...shuffleArray([...tableCards, { owner: 1, card: p1Card }, { owner: 2, card: p2Card }]).map(t => t.card), ...shuffleArray(playerOneHand).map(c=>c), ...shuffleArray(playerTwoHand).map(c=>c)])
        setPlayerOneHand([])
        setPlayerTwoHand([])
        setWarActive(false)
      } else {
        setMessage("Player 2 wins the battle")
        const winnings = shuffleArray([{ owner: 1, card: p1Card }, { owner: 2, card: p2Card }]).map(t => t.card)
        setPlayerTwoDeck(d => [...d, ...winnings])
      }
    } else {
      // Tie -> Simple War flow
      if (warActive){
        // repeated tie: return all in-play cards and both hands to original decks
        setMessage("Another tie! Returning cards to original decks.")
        const fullTable = [...tableCards, { owner: 1, card: p1Card }, { owner: 2, card: p2Card }]
        const p1Returns = shuffleArray([...fullTable.filter(t => t.owner === 1).map(t => t.card), ...newP1Hand])
        const p2Returns = shuffleArray([...fullTable.filter(t => t.owner === 2).map(t => t.card), ...newP2Hand])
        setPlayerOneDeck(d => [...d, ...p1Returns])
        setPlayerTwoDeck(d => [...d, ...p2Returns])
        setPlayerOneHand([])
        setPlayerTwoHand([])
        setWarActive(false)
      } else {
        setMessage("War! Each player select another card")
        setWarActive(true)
        setPhase("select")
        setCurrentPlayer(1)
        return
      }
    }

    // In single player, auto-deal next hand after 3 seconds
    if (isSinglePlayer && !warActive){
      setTimeout(() => {
        // Only auto-deal if still in resolve phase
        if (phase === "resolve") {
          handleDeal()
        }
      }, 3000)
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
          <Hand
            cards={playerOneHand}
            onSelect={(i) => handleSelect(1, i)}
            selectedIndex={playerOneSelected}
            faceUp={isSinglePlayer ? true : (phase === "select" && currentPlayer === 1)}
            disabled={!(phase === "select" && (isSinglePlayer || currentPlayer === 1))}
          />
        </div>

        <div>
          <Typography variant="subtitle1">{isSinglePlayer ? "Computer" : "Player 2"} Deck: {playerTwoDeck.length}</Typography>
          <Hand
            cards={playerTwoHand}
            onSelect={(i) => handleSelect(2, i)}
            selectedIndex={playerTwoSelected}
            faceUp={isSinglePlayer ? false : (phase === "select" && currentPlayer === 2)}
            disabled={isSinglePlayer ? true : !(phase === "select" && currentPlayer === 2)}
          />
        </div>
      </Stack>

      <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
        <Button variant="contained" onClick={handleDeal} disabled={phase !== "idle" && phase !== "resolve"}>Deal</Button>
        {/* Play button no longer needed for two-player; auto after second selection. Keep for debug if desired */}
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