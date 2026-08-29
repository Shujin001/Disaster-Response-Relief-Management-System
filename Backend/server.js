import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import connectDB from './config/db.js'
import { notFound, errorHandler } from './middleware/errorHandler.js'

import authRoutes from './routes/authRoutes.js'
import incidentRoutes from './routes/incidentRoutes.js'
import alertRoutes from './routes/alertRoutes.js'
import shelterRoutes from './routes/shelterRoutes.js'
import resourceRoutes from './routes/resourceRoutes.js'
import volunteerTaskRoutes from './routes/volunteerTaskRoutes.js'
import dashboardRoutes from './routes/dashboardRoutes.js'

await connectDB()

const app = express()

const allowedOrigins = (process.env.CLIENT_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())

app.use(cors({ origin: allowedOrigins, credentials: true }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'))
}

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'API is running', timestamp: new Date().toISOString() })
})

app.use('/api/auth', authRoutes)
app.use('/api/incidents', incidentRoutes)
app.use('/api/alerts', alertRoutes)
app.use('/api/shelters', shelterRoutes)
app.use('/api/resources', resourceRoutes)
app.use('/api/volunteer-tasks', volunteerTaskRoutes)
app.use('/api/dashboard', dashboardRoutes)

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`)
})
