const express = require('express')
const cors = require('cors')

const firebase = require('firebase/app')
require('firebase/firestore')

firebase.initializeApp({
  apiKey: 'AIzaSyD4jflY1oe2KLDz43IIq90UGuggBkkaDdE',
  authDomain: 'todo-81657.firebaseapp.com',
  projectId: 'todo-81657',
  storageBucket: 'todo-81657.appspot.com',
  messagingSenderId: '150929684776',
  appId: '1:150929684776:web:c3a70c48e6d86c3b46781d',
})

/////////////////////////////

const app = express()
app.use(cors())
app.use(express.json())

/////////////////////////////

app.get('/items/', async function (_, res) {
  const hrstart = process.hrtime()
  // ---
  const collection = await firebase.firestore().collection('items').get()
  const items = collection.docs.map(document => document.data())
  // ---
  const hrend = process.hrtime(hrstart)
  console.info('Execution time (hr): %ds %dms', hrend[0], hrend[1] / 1000000)
  try {
    return res.status(200).json(items)
  } catch (error) {
    return res.status(500).json(error)
  }
})

app.get('/items/:id/', async function (req, res) {
  const hrstart = process.hrtime()
  // ---
  try {
    const itemCollection = await firebase.firestore().collection('items').doc(req.params.id).get()
    const item = itemCollection.data()
    // ---
    const hrend = process.hrtime(hrstart)
    console.info('Execution time (hr): %ds %dms', hrend[0], hrend[1] / 1000000)
    if (!item) return res.status(404).json({ detail: 'Not found' })
    return res.status(200).json(item)
  } catch (error) {
    return res.status(500).json(error)
  }
})

app.post('/items/', async function (req, res) {
  const hrstart = process.hrtime()
  // ---
  try {
    const itemRef = await firebase.firestore().collection('items').add({ done: false, ...req.body })
    const itemCollection = await firebase.firestore().collection('items').doc(itemRef.id).get()
    const item = itemCollection.data()
    // ---
    const hrend = process.hrtime(hrstart)
    console.info('Execution time (hr): %ds %dms', hrend[0], hrend[1] / 1000000)
    return res.status(200).json(item)
  } catch (error) {
    return res.status(500).json(error)
  }
})

app.patch('/items/:id/', async function (req, res) {
  const hrstart = process.hrtime()
  // ---
  try {
    const itemRef = await firebase.firestore().collection('items').doc(req.params.id)
    await itemRef.update(req.body)
    const itemCollection = await itemRef.get()
    const item = itemCollection.data()
    // ---
    const hrend = process.hrtime(hrstart)
    console.info('Execution time (hr): %ds %dms', hrend[0], hrend[1] / 1000000)
    return res.status(200).json(item)
  } catch (error) {
    if (error?.code === 'not-found') return res.status(404).json({ detail: 'Not found' })
    return res.status(500).json(error)
  }
})

app.delete('/items/:id/', async function (req, res) {
  const hrstart = process.hrtime()
  // ---
  try {
    await firebase.firestore().collection('items').doc(req.params.id).delete()
    // ---
    const hrend = process.hrtime(hrstart)
    console.info('Execution time (hr): %ds %dms', hrend[0], hrend[1] / 1000000)
    return res.status(200).json()
  } catch (error) {
    return res.status(500).json(error)
  }
})

/////////////////////////////

app.listen(3000, () => {
  console.log(`Example app listening at http://localhost:3000`)
})
