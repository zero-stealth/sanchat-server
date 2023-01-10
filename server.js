import cors from 'cors';
import chalk from "chalk";
import express from "express";
import { Server } from 'socket.io';
const port = process.env.PORT || 3000;
const app = express();

const url = "http://localhost:5174/";

const corsOptions = {
        "origin": url,
        "header": "X-Requested-With, content-type , Access-Control-Requested, Accept, Origin",
        "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
        "preflightContinue": false,
        "optionsSuccessStatus": 204
}

app.use(cors(corsOptions));

app.get("/", (req, res, next) => {
  res.send("dummy, this is chat server");
});

const server = app.listen(port, () => {
  console.log(`${chalk.cyan("[+] server listening on port ")} ${chalk.magenta(port)}`);
});


const io = new Server(server);

io.on('connection', (socket) => {
  //send msg to all connected clients
  const msg = "HO!HO!HO!HO! Tell santa your secret🎄" 
  socket.emit('send-msg', msg)

  // receive a msg
  socket.on('recieve-msg', (msg) => {
    socket.broadcast.emit('recieve-msg', msg);
    console.log('recieved', msg)
    })

  // notify of disconnected clients
    socket.on('disconnect', () =>{
      const msg = "Bye hO!hO!hO!hO!" 
      socket.broadcast.emit('disconnect', msg);
    })
});


