import db from '../models';
import jwt from '../utils/jwt';

const loggedInUser = async (socket) => {
  try {
    const { token } = socket.handshake.query;
    const userData = await jwt.decodeToken(token);

    const user = await db.user.findOne({
      where: {
        id: userData.userId
      }
    });

    return user;
  } catch (error) {
    socket.emit('authentication_error', 'please login again');
  }
};

const getPriorMessages = async (socket) => {
  const messages = await db.conversation.findAll({
    include: [{
      model: db.user,
      attributes: ['firstName', 'lastName']
    }]
  });

  socket.emit('getting', { messages });
};

const createNewMessage = async (io, socket, data, user) => {
  try {
    const message = await db.conversation.create({
      message: data.message,
      userId: user.id
    });
    io.sockets.emit('new_message', { id: message.id, message: data.message, userId: user.id, username: socket.username, timestamp: message.createdAt });
  } catch (error) {
    socket.emit('custom_error', 'Try to resend your message again');
  }
};

const chat = async (io) => {
  io.on('connection', async (socket) => {
    const user = await loggedInUser(socket);
    socket.emit('connection');


    if (user) {
      socket.username = `${user.firstName}`;
      socket.emit('connected_user', socket.username);

      socket.on('get_messages', async () => {
        await getPriorMessages(socket);
      });

      socket.on('new_message', async (data) => {
        await createNewMessage(io, socket, data, user);
      });
    } else {
      socket.emit('authentication_error', 'please login again');
    }
  });
};

export default chat;
