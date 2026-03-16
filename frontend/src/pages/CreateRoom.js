import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function CreateRoom() {

  const [name, setName] = useState("");
  const [roomCode, setRoomCode] = useState("");

  const navigate = useNavigate();

  const createRoom = async () => {

    try {

      const res = await axios.post("http://localhost:5000/group/create", {
        host: name
      });

      setRoomCode(res.data.room_code);

    } catch (error) {

      console.log(error);

    }

  };

  return (

    <div style={{ padding: "30px" }}>

      <h1>Create Group Order Room</h1>

      <input
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <br /><br />

      <button onClick={createRoom}>
        Create Room
      </button>

      {roomCode && (
        <div>

          <h2>Room Code: {roomCode}</h2>

          <button
            onClick={() => navigate(`/group/${roomCode}`)}
          >
            Enter Room
          </button>

        </div>
      )}

    </div>

  );
}

export default CreateRoom;