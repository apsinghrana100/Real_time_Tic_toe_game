import { useEffect, useState } from "react";
import styled from "styled-components";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000"); // Connect to backend

const GamePage = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXTurn, setIsXTurn] = useState(true);
  const [roomId,setRoomId] = useState(localStorage.getItem("roomId"))
  const [name, setName ]= useState({
    firstPlayer:localStorage.getItem("firstplayer") || "Player1", 
    secondPlayer:localStorage.getItem("secondPlayer") || "Player2",
  })


  const handleClick = (index) => {
    if (board[index] || checkWinner()) return; // Prevent clicking occupied squares

    const newBoard = [...board];
    newBoard[index] = isXTurn ? "X" : "O";
    setBoard(newBoard);
    setIsXTurn(!isXTurn);

    socket.emit("makeMove", { roomId, board: newBoard, isXTurn: !isXTurn });
  };

  const checkWinner = () => {
    const winPatterns = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8], // Rows
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8], // Columns
      [0, 4, 8],
      [2, 4, 6], // Diagonals
    ];

    for (const pattern of winPatterns) {
      const [a, b, c] = pattern;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a]; // Returns "X" or "O" if there's a winner
      }
    }
    return board.includes(null) ? null : "Draw"; // Return Draw if no spaces left
  };

  const winner = checkWinner();

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {

    socket.emit("joinroom",{roomId,firstPlayer:name.firstPlayer,secondPlayer:name.secondPlayer})
    socket.on("updateName",({firstPlayer,secondPlayer})=>{
      setName({
        firstPlayer:firstPlayer,
        secondPlayer:secondPlayer
      })
      localStorage.setItem("firstplayer",firstPlayer);
      console.log(firstPlayer,secondPlayer)
      localStorage.setItem("secondPlayer",secondPlayer)
    })
    socket.on("updateGame", ({ board, isXTurn }) => {
    
      setBoard(board);
      setIsXTurn(isXTurn);
    });

    return () => {
      socket.off("updateGame");
    };
  }, []);

  const sendMessage = (index) => {
    socket.emit("message", index);
    setMessage("");
  };

  const definedCount = board.filter((cell) => cell !== undefined).length;

  return (
    <Container>
      <Header>
        <PlayerName isActive={isXTurn}>{name.firstPlayer} (X)</PlayerName>
        <PlayerName isActive={!isXTurn}>{name.secondPlayer} (O)</PlayerName>
      </Header>

      <Board>
        {board.map((value, index) => (
          <Square
            key={index}
            onClick={() => {
              handleClick(index);
            }}
          >
            {value}
          </Square>
        ))}
      </Board>

      {winner && (
        <WinnerMessage>
          {winner === "Draw" ? "It's a Draw!" : `Winner: ${winner}`}
        </WinnerMessage>
      )}

      <ResetButton onClick={() =>{  socket.emit("resetgame",roomId);}}>
        Restart Game
      </ResetButton>
      {/* <button onClick={sendMessage} style={{padding:"10px"}}>click me</button> */}
    </Container>
  );
};

export default GamePage;

// 🔹 Styled Components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: #121212; /* Dark background */
  color: white;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  width: 80%;
  max-width: 400px;
  margin-bottom: 20px;
`;

const PlayerName = styled.h2`
  font-size: 18px;
  color: ${(props) =>
    props.isActive ? "#f39c12" : "#bbb"}; /* Highlight active player */
`;

const Board = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 100px);
  grid-template-rows: repeat(3, 100px);
  gap: 5px;
`;

const Square = styled.div`
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  font-weight: bold;
  color: white;
  background: #1e1e1e;
  border-radius: 10px;
  cursor: pointer;
  transition: 0.3s ease;

  &:hover {
    background: #333;
  }
`;

const WinnerMessage = styled.div`
  margin-top: 20px;
  font-size: 20px;
  color: #f39c12;
  font-weight: bold;
`;

const ResetButton = styled.button`
  margin-top: 20px;
  padding: 10px 20px;
  background: #e74c3c;
  border: none;
  color: white;
  font-size: 16px;
  cursor: pointer;
  border-radius: 5px;
  transition: 0.3s ease;

  &:hover {
    background: #c0392b;
  }
`;
