import React, { useRef, useState, useEffect } from "react"
import "./Board.css"

export default function Board({ targetWord }) {
  const [board, setBoard] = useState(Array.from({ length: 6 }, () =>
    Array.from({ length: 5 }, () => ({ letter: "", status: "" }))
  ))
  const [currentRow, setCurrentRow] = useState(0)
  const inputRefs = useRef(
    Array.from({ length: 6 }, () => Array.from({ length: 5 }, () => React.createRef()))
  )

  useEffect(() => {
    inputRefs.current[currentRow][0]?.current?.focus()
  }, [currentRow])

  const handleChange = (row, col, value) => {
    if (!/^[a-zA-Z]?$/.test(value)) return
    const newBoard = board.map(r => r.map(c => ({ ...c })))
    newBoard[row][col].letter = value.toUpperCase()
    setBoard(newBoard)
    if (value && col < 4) inputRefs.current[row][col + 1].current.focus()
  }

  const handleKeyDown = (row, col, e) => {
    if (e.key === "Backspace" && !board[row][col].letter && col > 0)
      inputRefs.current[row][col - 1].current.focus()
    if (e.key === "Enter") submitGuess()
  }

  const submitGuess = () => {
    const guess = board[currentRow].map(c => c.letter).join("")
    if (guess.length < 5) {
      alert("Please fill all 5 letters!")
      return
    }
    const newBoard = board.map(r => r.map(c => ({ ...c })))
    const targetArr = targetWord.split("")
    const guessArr = guess.split("")

    guessArr.forEach((ch, i) => {
      if (ch === targetArr[i]) {
        newBoard[currentRow][i].status = "correct"
        targetArr[i] = null
        guessArr[i] = null
      }
    })

    guessArr.forEach((ch, i) => {
      if (ch && targetArr.includes(ch)) {
        newBoard[currentRow][i].status = "present"
        targetArr[targetArr.indexOf(ch)] = null
      } else if (ch) {
        newBoard[currentRow][i].status = "absent"
      }
    })

    setBoard(newBoard)

    if (guess === targetWord) {
      setTimeout(() => alert("🎉 You guessed it right!"), 300)
      return
    }

    if (currentRow === 5) {
      setTimeout(() => alert(`💥 Game over! The word was: ${targetWord}`), 300)
      return
    }

    setCurrentRow(prev => prev + 1)
  }

  return (
    <div className="grid">
      {board.map((row, rowIdx) => (
        <div key={rowIdx} className="row">
          {row.map((cell, colIdx) => (
            <input
              key={colIdx}
              ref={inputRefs.current[rowIdx][colIdx]}
              type="text"
              maxLength={1}
              value={cell.letter}
              onChange={e => handleChange(rowIdx, colIdx, e.target.value)}
              onKeyDown={e => handleKeyDown(rowIdx, colIdx, e)}
              className={`box ${cell.status}`}
              disabled={rowIdx !== currentRow}
            />
          ))}
        </div>
      ))}
    </div>
  )
}
