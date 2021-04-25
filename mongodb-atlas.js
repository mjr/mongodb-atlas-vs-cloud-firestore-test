const express = require('express')
const cors = require('cors')

const mongoose = require('mongoose')

const data = require('./fixtures/10000-records.json')

mongoose.connect(
  'mongodb+srv://emerald:pM2LwW96knq5Hoy6@cluster0.vpnba.mongodb.net/todo',
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  },
)

/////////////////////////////

const Item = mongoose.model(
  'Item',
  new mongoose.Schema({
    description: {
      type: String,
      required: true,
      trim: true,
    },
    done: {
      type: Boolean,
      default: false,
    },
  }),
)

/////////////////////////////

const app = express()
app.use(cors())
app.use(express.json())

/////////////////////////////

app.get('/items/', async function (_, res) {
  const hrstart = process.hrtime()
  // ---
  const items = await Item.find()
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
    const item = await Item.findById(req.params.id)
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
  const item = new Item(req.body)
  try {
    await item.save()
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
    const item = await Item.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    })
    // ---
    const hrend = process.hrtime(hrstart)
    console.info('Execution time (hr): %ds %dms', hrend[0], hrend[1] / 1000000)
    if (!item) return res.status(404).json({ detail: 'Not found' })
    return res.status(200).json(item)
  } catch (error) {
    return res.status(500).json(error)
  }
})

app.delete('/items/:id/', async function (req, res) {
  const hrstart = process.hrtime()
  // ---
  try {
    const item = await Item.findByIdAndDelete(req.params.id)
    // ---
    const hrend = process.hrtime(hrstart)
    console.info('Execution time (hr): %ds %dms', hrend[0], hrend[1] / 1000000)
    if (!item) return res.status(404).json({ detail: 'Not found' })
    return res.status(200).json()
  } catch (error) {
    return res.status(500).json(error)
  }
})

app.post('/items-many/', async function (_, res) {
  const hrstart = process.hrtime()
  // ---
  try {
    // slow
    // await Item.create(JSON.parse(data));

    await Item.insertMany(JSON.parse(data))
    // ---
    const hrend = process.hrtime(hrstart)
    console.info('Execution time (hr): %ds %dms', hrend[0], hrend[1] / 1000000)
    return res.status(200).json()
  } catch (error) {
    return res.status(500).json(error)
  }
})

app.delete('/items-many/', async function (_, res) {
  const hrstart = process.hrtime()
  // ---
  try {
    await Item.deleteMany()
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
