import React, { useEffect, useState } from "react"
import "./App.css"
import Board from "./components/Board"

function App() {
  const [word, setWord] = useState("")
  const [key, setKey] = useState(0) // To force remount Board

  const fetchWord = async () => {
    try {
      const response = await fetch("https://random-word-api.herokuapp.com/word?length=5")
      const data = await response.json()
      setWord(data[0].toUpperCase())
    } catch (error) {
      console.error("Error fetching word:", error)
    }
  }

  useEffect(() => {
    fetchWord()
  }, [])

  const handleNewGame = async () => {
    await fetchWord()
    setKey(prev => prev + 1) // force Board remount to reset state
  }

  if (!word) return <p>Loading...</p>

  return (
    <div className="app">
      <h1 className="heading">Wordle App</h1>
      <Board key={key} targetWord={word} />
      <button className="new-game-button" onClick={handleNewGame}>
        New Game
      </button>
    </div>
  )
}

export default App
