
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/users', userRoutes);

const path = require('path');

// Добавь после всех app.use и маршрутов
app.use(express.static(path.join(__dirname, '../frontend/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

const onlineUsers = new Map();

io.on('connection', socket => {
  socket.on('login', userId => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on('call', ({ to, from }) => {
    const target = onlineUsers.get(to);
    if(target) io.to(target).emit('incomingCall', { from });
  });

  socket.on('acceptCall', ({ to, from, signal }) => {
    const target = onlineUsers.get(to);
    if(target) io.to(target).emit('callAccepted', { signal, from });
  });

  socket.on('signal', ({ to, signal }) => {
    const target = onlineUsers.get(to);
    if(target) io.to(target).emit('signal', signal);
  });

  socket.on('disconnect', () => {
    for(const [key, value] of onlineUsers.entries()){
      if(value === socket.id) onlineUsers.delete(key);
    }
  });
});

server.listen(5000, () => console.log('Server running on port 5000'));
