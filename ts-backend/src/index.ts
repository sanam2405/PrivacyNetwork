require('dotenv').config()
import express, { Request, Response } from 'express'
import http from 'http'
import userRouter from './routes/user'
import authRouter from './routes/auth'
const app = express()
import cors from 'cors'
import { Server } from 'socket.io'

const PORT: string | number = process.env.PORT || 5051

import mongoDB from './db'

app.use(cors())
app.use(express.json())

app.get('/', (req: Request, res: Response) => {
	res.send('<h1>Hello World</h1>')
})

app.use('/api', authRouter)
app.use('/api', userRouter)

const server = http.createServer(app)

// const io = new Server(server, {
// 	cors: {
// 		origin: 'http://localhost:1234',
// 		methods: ['GET', 'POST', 'PUT'],
// 	},
// })

// io.on('connection', socket => {
// 	console.log(`User Connected: ${socket.id}`)

// 	// socket.on("join_room", (data) => {
// 	//   socket.join(data);
// 	// });

// 	socket.on('send-location', data => {
// 		console.log('backend send.....')
// 		console.log(data)
// 		socket.broadcast.emit('receive-location', data)
// 	})
// })

// app.get("*", (req, res) => {
//   res.sendFile(
//     path.join(__dirname, "./frontend/build/index.html"),
//     function (err) {
//       res.status(500).send(err)
//     }
//   )
// })

// app.listen(PORT, () => {
//   console.log("Server is listening at port no", PORT);
// });

mongoDB().then(() => {
	app.listen(PORT, () => {
		console.log('Server is listening at port no', PORT)
	})
})
