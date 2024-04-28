import React, { useEffect, useState } from "react"
import "./styles.css"

const initialPieces = [
    { piece: ["white", "rook"], position: "11" },
    { piece: ["white", "knight"], position: "21" },
    { piece: ["white", "bishop"], position: "31" },
    { piece: ["white", "queen"], position: "41" },
    { piece: ["white", "king"], position: "51" },
    { piece: ["white", "bishop"], position: "61" },
    { piece: ["white", "knight"], position: "71" },
    { piece: ["white", "rook"], position: "81" },

    { piece: ["white", "pawn"], position: "12" },
    { piece: ["white", "pawn"], position: "22" },
    { piece: ["white", "pawn"], position: "32" },
    { piece: ["white", "pawn"], position: "42" },
    { piece: ["white", "pawn"], position: "52" },
    { piece: ["white", "pawn"], position: "62" },
    { piece: ["white", "pawn"], position: "72" },
    { piece: ["white", "pawn"], position: "82" },

    
    { piece: ["black", "rook"], position: "18" },
    { piece: ["black", "knight"], position: "28" },
    { piece: ["black", "bishop"], position: "38" },
    { piece: ["black", "queen"], position: "48" },
    { piece: ["black", "king"], position: "58" },
    { piece: ["black", "bishop"], position: "68" },
    { piece: ["black", "knight"], position: "78" },
    { piece: ["black", "rook"], position: "88" },
    
    { piece: ["black", "pawn"], position: "17" },
    { piece: ["black", "pawn"], position: "27" },
    { piece: ["black", "pawn"], position: "37" },
    { piece: ["black", "pawn"], position: "47" },
    { piece: ["black", "pawn"], position: "57" },
    { piece: ["black", "pawn"], position: "67" },
    { piece: ["black", "pawn"], position: "77" },
    { piece: ["black", "pawn"], position: "87" },
]

function calculatePossibleMoves(piece, x, y, pieces, coords) {
    const possibleMoves = []
    for (let i = x + 1; i <= 8; i++) {
        const pieceInCurrentSquare = pieces[coords.indexOf(`${i}${y}`)];

        if (pieceInCurrentSquare){
            if (pieceInCurrentSquare[0] !== piece[0]){
                possibleMoves.push(`${i}${y}`)
            }
            break
        }

        possibleMoves.push(`${i}${y}`)
    }
    for (let i = x - 1; i >= 1; i--) {
        const pieceInCurrentSquare = pieces[coords.indexOf(`${i}${y}`)];

        if (pieceInCurrentSquare){
            if (pieceInCurrentSquare[0] !== piece[0]){
                possibleMoves.push(`${i}${y}`)
            }
            break
        }

        possibleMoves.push(`${i}${y}`)
    }
    for (let i = y + 1; i <= 8; i++) {
        const pieceInCurrentSquare = pieces[coords.indexOf(`${x}${i}`)];

        if (pieceInCurrentSquare){
            if (pieceInCurrentSquare[0] !== piece[0]){
                possibleMoves.push(`${x}${i}`)
            }
            break
        }

        possibleMoves.push(`${x}${i}`)
    }
    for (let i = y - 1; i >= 1; i--) {
        const pieceInCurrentSquare = pieces[coords.indexOf(`${x}${i}`)];

        if (pieceInCurrentSquare){
            if (pieceInCurrentSquare[0] !== piece[0]){
                possibleMoves.push(`${x}${i}`)
            }
            break
        }

        possibleMoves.push(`${x}${i}`)
    }
    return possibleMoves
}

const board = () => {
    let provBoard = []

    for (let i = 8; i >= 1; i--) {
        for (let j = 1; j <= 8; j++) {
            provBoard.push(`${j}${i}`)
        }
    }
    return provBoard
}

const Square = ({ position, id, piece, squareClicked, isMarked }) => {
    const [x, y] = position.split("").map(n => parseInt(n))
    const color = (x % 2 === 0 ? y % 2 !== 0 : y % 2 === 0) ? "white" : "black"

    function handleClick() {
        squareClicked(id, piece, x, y)
    }
    return <div
        className={`square ${color} ${isMarked ? "marked" : ""}`}
        onClick={handleClick}
    >{
            piece && <div className={`piece ${piece[0]}_${piece[1]}`}></div>
        }</div>
}

const Board = ({ coords, pieces, squareClicked, markers }) => {
    return <div className="board">
        {coords.map((position, id) =>
            <Square position={position} id={id} piece={pieces[id]} squareClicked={squareClicked} isMarked={markers.includes(position)} key={position} />
        )}
    </div>
}

export function App() {

    const [pieces, setPieces] = useState(Array(8 * 8))
    const [selectedPiece, setSelectedPiece] = useState(undefined)
    const [possibleMoves, setPossibleMoves] = useState([])
    const [turn, setTurn] = useState("white")
    const coords = board()

    function switchTurn(){
        setTurn(turn === "white" ? "black" : "white")
    }

    useEffect(() => {
        setPieces(() => {
            const tempPieces = [...pieces]
            initialPieces.forEach((pieceInfo) => {
                tempPieces[coords.indexOf(pieceInfo.position)] = pieceInfo.piece
            })
            return tempPieces
        })
    }, [])

    function squareClicked(id, piece, x, y) {
        if (piece && !selectedPiece && piece[0] === turn) {
            setSelectedPiece({ piece, id, x, y })
            setPossibleMoves(calculatePossibleMoves(piece, x, y, pieces, coords))
        } else if (selectedPiece && possibleMoves.includes(`${x}${y}`)) {
            setPieces(() => {
                const newPieces = [...pieces]
                newPieces[id] = selectedPiece.piece
                newPieces[selectedPiece.id] = undefined
                
                return newPieces
            })
            setSelectedPiece(undefined)
            setPossibleMoves([])
            switchTurn()
        } else {
            setSelectedPiece(undefined)
            setPossibleMoves([])
        }
    }

    return <main>
        
        <h1>Chess (by Marty B.)</h1>

        <Board coords={coords} pieces={pieces} squareClicked={squareClicked} markers={possibleMoves} />
    </main>
}
