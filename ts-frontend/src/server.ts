import express, { Request, Response } from 'express'
import path from 'path'
import cors from 'cors'
import http from 'http'

const app = express()
const PORT: number = parseInt(process.env.PORT || '4000')
const server = http.createServer(app)
import socketIO from 'socket.io'

app.use(cors())
app.use(express.static(path.join(__dirname, '../public')))

app.get('/', (_req: Request, res: Response) => {
	res.sendFile(path.join(__dirname, '../public/index.html'))
})

server.listen(PORT, () => {
	console.log(`Server listening on ${PORT}`)
})

const io = new socketIO.Server(server, {
	cors: {
		origin: 'http://localhost:3000',
	},
})

// Add this before the app.get() block
io.on('connection', (socket: socketIO.Socket) => {
	console.log(`⚡: ${socket.id} user just connected!`)
	socket.on('disconnect', () => {
		console.log('🔥: A user disconnected')
	})
})
