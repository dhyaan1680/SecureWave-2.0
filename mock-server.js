const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());
const PORT = 5000;

let sensors = [
  {id:1, alarm:false, tamper:false},
  {id:2, alarm:false, tamper:false},
  {id:3, alarm:false, tamper:false}
];

app.get('/api/sensors', (req,res)=>{
  res.json(sensors);
});

// simple toggle endpoint
app.post('/api/toggle/:id', (req,res)=>{
  const id = Number(req.params.id);
  const s = sensors.find(x=>x.id===id);
  if(s){ s.alarm = !s.alarm; res.json(s); } else res.status(404).send('not found');
});

// SSE endpoint
app.get('/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();
  const sendAll = () => {
    sensors.forEach(s=>{
      // random change
      if(Math.random() < 0.2){ s.alarm = !s.alarm; s.tamper = Math.random() < 0.1; }
      res.write(`data: ${JSON.stringify(s)}\n\n`);
    });
  };
  const interval = setInterval(sendAll, 2500);
  req.on('close', ()=>{ clearInterval(interval); });
});

app.listen(PORT, ()=>console.log('Mock server running on', PORT));