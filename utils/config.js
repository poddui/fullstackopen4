require('dotenv').config()

const PORT = 3003
const MONGODB_URI = 'mongodb+srv://bgx174:test1@cluster0.s38nz2n.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'

module.exports = {
  MONGODB_URI,
  PORT
}
