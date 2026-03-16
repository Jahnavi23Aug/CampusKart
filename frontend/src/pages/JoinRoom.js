import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function JoinRoom() {

  const [roomCode, setRoomCode] = useState("");
  const [name, setName] = useState("");

  const navigate = useNavigate();

  const joinRoom = async () => {

    try {

      await axios.post("http://localhost:5000/group/join", {
        room_code: roomCode,
        user: name
      });

      navigate(`/group/${roomCode}`);

    } catch (error) {

      console.log(error);

    }

  };

  return (

    <div style={{ padding: "30px" }}>

      <h1>Join Group Order</h1>

      <input
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <br /><br />

      <input
        placeholder="Enter room code"
        value={roomCode}
        onChange={(e) => setRoomCode(e.target.value)}
      />

      <br /><br />

      <button onClick={joinRoom}>
        Join Room
      </button>

    </div>

  );
}

export default JoinRoom;