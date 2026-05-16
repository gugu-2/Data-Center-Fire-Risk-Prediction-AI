import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { SimulationEngine } from './SimulationEngine';

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const engine = new SimulationEngine(100);

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Send initial data
  socket.emit('rackData', engine.getRacks());

  socket.on('action', (data: { rackId: string, action: 'cooling' | 'shutdown' }) => {
    console.log(`Action received for ${data.rackId}: ${data.action}`);
    engine.handleAction(data.rackId, data.action);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

engine.on('tick', (racks) => {
  io.emit('rackData', racks);
});

engine.start();

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
