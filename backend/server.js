const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const tutorRoutes = require('./routes/tutorRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const messageRoutes = require('./routes/messageRoutes');
const Message = require('./models/Message');

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date() });
});

app.use('/api/auth', authRoutes);
app.use('/api/tutors', tutorRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/messages', messageRoutes);

// Wrap Express in a raw HTTP server so Socket.io can attach to it
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*', // in production, restrict this to your actual frontend URL
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Client joins a "room" specific to one booking's conversation
  socket.on('join_room', (bookingId) => {
    socket.join(bookingId);
  });

  // Client sends a message
  socket.on('send_message', async (data) => {
    const { bookingId, senderId, text } = data;

    // Save to database
    const message = await Message.create({ bookingId, senderId, text });

    // Broadcast to everyone in that booking's room (including sender, for confirmation)
    io.to(bookingId).emit('receive_message', message);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});