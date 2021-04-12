import {
  addUser,
  getUser,
  getUsersInRoom,
  removeUser,
} from "./controllers/user.ctr";
import { createId } from "./utils/createId";
import { decrypt } from "./utils/decrypt";

const sockets = (socket, io) => {
  socket.on("join", ({ name, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, name, room });

    if (error) return callback(error);

    socket.emit("message", {
      id: createId(),
      user: "admin",
      text: `${user.name}, welcome to room ${user.room}`,
    });

    socket.broadcast
      .to(user.room)
      .emit("message", { user: "admin", text: `${user.name} has join!` });

    socket.join(user.room);

    io.to(user.room).emit("roomData", {
      room: user.room,
      users: getUsersInRoom({ room: user.room }),
    });

    callback();
  });

  socket.on("sendMessage", (message) => {
    const user = getUser({ id: socket.id });

    if (!user) return;

    const decryptedMessage = decrypt(message, user.room.trim());

    setTimeout(() => {
      io.to(user.room).emit("message", {
        user: user.name,
        text: decryptedMessage,
      });
    }, 250);

    io.to(user.room).emit("roomData", {
      room: user.room,
      users: getUsersInRoom({ room: user.room }),
    });
  });

  socket.on("disconnect", () => {
    const user = removeUser({ id: socket.id });

    if (user) {
      io.to(user.room).emit("message", {
        user: "admin",
        text: `${user.name} has left.`,
      });
    }
  });
};

export default sockets;
