import { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { useNavigate } from "react-router";

const LandingPage = () => {
  const [mode, setMode] = useState(null); // 'create' or 'join'
  const [playerFirst, setPlayerFirst] = useState(null);
  const [playerSecond, setPlayerSecond] = useState(null);
  const [roomId, setRoomId] = useState(null);
  const navigation = useNavigate();

  const onhandleCreateRoom = async () => {
    try {
      const output = await axios.post(`https://real-time-tic-toe-game-3.onrender.com/api/roomCreate`, {
        playerFirst,
      });

      alert(output.data.data.roomId);
      localStorage.setItem("roomId",output.data.data.roomId)
      localStorage.setItem("firstplayer",output.data.data.firstPlayer)
      navigation(`/gamepage`)
      
    } catch (error) {
      alert("Something went wrong");
    }
  };

  const onhandleJoinRoom = async () => {
    try {
      const output = await axios.post(`https://real-time-tic-toe-game-3.onrender.com/api/joinRoom`, {
        playerSecond,
        roomId,
      });
      alert(output.data.msg);
      localStorage.setItem("secondPlayer",playerSecond)
      localStorage.setItem("roomId",roomId)
      navigation(`/gamepage`)
    } catch (error) {
      alert("something went wrong");
    }
  };

  return (
    <Container>
      <Card>
        <Title>Tic-Tac-Toe Online</Title>
        <ButtonContainer>
          <Button onClick={() => setMode("create")} active={mode === "create"}>
            Create Room
          </Button>
          <Button onClick={() => setMode("join")} active={mode === "join"}>
            Join Room
          </Button>
        </ButtonContainer>

        {mode === "create" && (
          <Form>
            <Input
              value={playerFirst}
              type="text"
              placeholder="Enter Your Name"
              onChange={(e) => setPlayerFirst(e.target.value)}
            />
            <SubmitButton onClick={onhandleCreateRoom}>
              Create Room
            </SubmitButton>
          </Form>
        )}

        {mode === "join" && (
          <Form>
            <Input
              type="text"
              value={playerSecond}
              placeholder="Enter Your Name"
              onChange={(e) => setPlayerSecond(e.target.value)}
            />
            <Input
              type="text"
              value={roomId}
              placeholder="Enter Room ID"
              onChange={(e) => setRoomId(e.target.value)}
            />
            <SubmitButton onClick={onhandleJoinRoom}>Join Room</SubmitButton>
          </Form>
        )}
      </Card>
    </Container>
  );
};

export default LandingPage;

// 🔹 Styled Components
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: #121212; /* Dark Background */
  color: white;
`;

const Card = styled.div`
  background: #1e1e1e; /* Dark Card */
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(255, 255, 255, 0.1);
  text-align: center;
  width: 90%;
  max-width: 400px;
`;

const Title = styled.h1`
  font-size: 24px;
  margin-bottom: 20px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
`;

const Button = styled.button`
  background: ${(props) => (props.active ? "#6200ea" : "#333")};
  color: white;
  padding: 10px 20px;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  transition: 0.3s ease;

  &:hover {
    background: #6200ea;
  }
`;

const Form = styled.div`
  margin-top: 15px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin: 8px 0;
  border: 1px solid #444;
  background: #222;
  color: white;
  border-radius: 5px;
`;

const SubmitButton = styled.button`
  background: #6200ea;
  color: white;
  padding: 10px;
  width: 100%;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  margin-top: 10px;
  transition: 0.3s ease;

  &:hover {
    background: #8e24aa;
  }
`;
