import express from 'express'
import { printRoutes } from './utils/colorConsole'
import { config } from 'dotenv'
import corsSetup from 'cors'
config()
const app = express()
app.use(express.json())
app.use(corsSetup())

import auth from './router/auth'
import user from './router/user'
import me from './router/me'
import kriteria from './router/kriteria';
import subKriteria from './router/subKriteria';
import perhitungan from './router/perhitungan';
import profil from './router/profil'
import jenis from './router/Jenis'

app.use('/auth', auth)
app.use('/user', user)
app.use('/me', me)
app.use('/kriteria', kriteria)
app.use('/subkriteria', subKriteria)
app.use('/perhitungan', perhitungan)
app.use('/profil', profil)
app.use('/jenis', jenis)

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
  printRoutes(app, PORT as number);
})