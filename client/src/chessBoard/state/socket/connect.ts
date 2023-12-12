import io from "socket.io-client";

export const getRoom = () => {
  const url = new URL(window.location.href);
  const hasRoom = url.pathname.includes("room");
  let room = "";
  url.pathname.split("/").forEach((part, index, array) => {
    if (part === "room") {
      room = array[index + 1];
    }
  });
  return room;
};

export const connect = () => {
  const room = getRoom();

  const SERVER_URL =
    process.env.NODE_ENV === "development"
      ? `ws://localhost:1337/room`
      : `/room`;

  const socket = io(SERVER_URL, {
    autoConnect: false,
    query: {
      room,
    },
  });

  return {
    socket,
    room,
  };
};
