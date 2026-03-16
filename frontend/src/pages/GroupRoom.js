import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

function GroupRoom() {

  const { roomCode } = useParams();

  const [room, setRoom] = useState(null);
  const [itemName, setItemName] = useState("");
  const [price, setPrice] = useState("");

  const fetchRoom = async () => {

    const res = await axios.get(
      `http://localhost:5000/group/${roomCode}`
    );

    setRoom(res.data);

  };

  useEffect(() => {

    fetchRoom();

    socket.emit("join_room", { room_code: roomCode });

    socket.on("new_item", (item) => {

      setRoom((prev) => ({
        ...prev,
        items: [...prev.items, item]
      }));

    });

  }, [roomCode]);

  const addItem = () => {

    const item = {
      name: itemName,
      price: Number(price),
      user: "student"
    };

    socket.emit("add_item", {
      room_code: roomCode,
      item: item
    });

    setItemName("");
    setPrice("");

  };

  if (!room) return <h2>Loading...</h2>;

  return (

    <div style={{ padding: "30px" }}>

      <h1>Group Order Room</h1>

      <h3>Room Code: {room.room_code}</h3>

      <h2>Members</h2>

      {room.members.map((m, i) => (
        <p key={i}>{m}</p>
      ))}

      <h2>Food Orders</h2>

      {room.items.map((item, i) => (
        <p key={i}>
          {item.user} ordered {item.name} ₹{item.price}
        </p>
      ))}

      <h2>Add Food</h2>

      <input
        placeholder="Food name"
        value={itemName}
        onChange={(e) => setItemName(e.target.value)}
      />

      <br /><br />

      <input
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />

      <br /><br />

      <button onClick={addItem}>
        Add Item
      </button> 

    </div>
  );
}

export default GroupRoom;