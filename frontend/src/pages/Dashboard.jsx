import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";

const socket = io("https://skycallpro.onrender.com");

export default function Call() {
  const { id } = useParams(); // ID пользователя, которому звоним
  const myVideoRef = useRef();
  const remoteVideoRef = useRef();
  const [stream, setStream] = useState(null);
  const [callAccepted, setCallAccepted] = useState(false);

  useEffect(() => {
    // Получаем доступ к микрофону и камере
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(currentStream => {
        setStream(currentStream);
        myVideoRef.current.srcObject = currentStream;
      });

    // Обработка входящих сигналов WebRTC
    socket.on("signal", signal => {
      // Тут можно подключить peer.js или SimplePeer
      console.log("Получен сигнал:", signal);
    });

    // Обработка принятого звонка
    socket.on("callAccepted", ({ from, signal }) => {
      setCallAccepted(true);
      console.log("Звонок принят:", from, signal);
    });

    return () => socket.disconnect();
  }, []);

  const callUser = () => {
    socket.emit("call", { to: id, from: "me" });
  };

  const acceptCall = () => {
    socket.emit("acceptCall", { to: id, from: "me", signal: {} });
    setCallAccepted(true);
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Video Call</h2>
      <div className="flex gap-4 mb-4">
        <video ref={myVideoRef} autoPlay playsInline muted className="w-1/2 border" />
        <video ref={remoteVideoRef} autoPlay playsInline className="w-1/2 border" />
      </div>
      <div className="flex gap-2">
        <button onClick={callUser} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Call
        </button>
        <button onClick={acceptCall} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
          Accept
        </button>
      </div>
    </div>
  );
}
