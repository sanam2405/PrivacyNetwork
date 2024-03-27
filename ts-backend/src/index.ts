require('dotenv').config()
import express, { Request, Response } from 'express'
import http from 'http'
import userRouter from './routes/user'
import authRouter from './routes/auth'
import cors from 'cors'
import { Server } from 'socket.io'
import mongoDB from './db'
import globalCatch from './middlewares/globalCatch'

const app = express()
const PORT: string | number = process.env.PORT || 5050

app.use(cors())
app.use(express.json())

app.get('/', (req: Request, res: Response) => {
	res.send(`<pre> <i> A Privacy-Preserving Efficient Location-Sharing Scheme for Mobile Online Social Network Applications </i> 🛜 </pre>
	<pre> ~ Built with &#x1F499 by sanam </pre>`)
})

app.use('/api', authRouter)
app.use('/api', userRouter)

app.use(globalCatch)

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
