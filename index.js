const express = require('express');
const cors = require('cors');
require('dotenv').config()

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

//  middleWere
app.use(cors())
app.use(express.json())




// mongodb code




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ma7e2wv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    const spotCollection = client.db('spotDB').collection('spot')
    const userCollection = client.db('spotDB').collection('user')
    const teamCollection = client.db('spotDB').collection('team')

    app.get('/addSpot', async (req, res) => {
      const cursor = spotCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    })

    app.post('/addSpot', async (req, res) => {
      const addSpot = req.body
      console.log(addSpot)
      const result = await spotCollection.insertOne(addSpot)
      res.send(result)
    })
    // country
    // app.post('/addSpot',async(req,res)=>{
    //     const country=req.body
    //     console.log(country)
    //     const result=await spotCollection.find()
    //     res.send(result)
    // })

    app.get('/myList/:email', async (req, res) => {
      // const email=req.body
      console.log(req.params.email)
      const result = await spotCollection.find({ userEmail: req.params.email }).toArray()
      res.send(result)
    })
    app.get('/countryDetails/:country', async (req, res) => {
      console.log(req.params.country)
      const result = await spotCollection.find({ country: req.params.country }).toArray()
      res.send(result)
    })

    app.get('/addSpot', async (req, res) => {
      const result = await spotCollection.find().sort({ average: 1 }).toArray()
      res.send(result)
    })
    app.get('/addSpot', async (req, res) => {
      const result = await spotCollection.find().sort({ average: -1 }).toArray()
      res.send(result)
    })

    // user collection 
    app.post('/user', async (req, res) => {
      const user = req.body
      console.log(user)
      const result = await userCollection.insertOne(user)
      res.send(result)
    })
    app.get('/addSpot/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await spotCollection.findOne(query);
      res.send(result);
    })

    app.put('/addSpot/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) }
      const options = { upsert: true };
      const updatedSpot = req.body;

      const spot = {
        $set: {
          image: updatedSpot.image,
          spotName: updatedSpot.spotName,
          country: updatedSpot.country,
          location: updatedSpot.location,
          short: updatedSpot.short,
          average: updatedSpot.average,
          total: updatedSpot.total,
          travel: updatedSpot.travel,
          season: updatedSpot.season,
        }
      }
      const result = await spotCollection.updateOne(filter, spot, options)
      res.send(result)
    })

    app.delete('/addSpot/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) }
      const result = await spotCollection.deleteOne(query)
      res.send(result)
    })

  // Get all team members
  app.get('/team', async (req, res) => {
    const cursor = teamCollection.find()
    const result = await cursor.toArray()
    res.send(result)
  });


    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('TOURISTS SPOT SERVER IS RUNNING')
})

app.listen(port, () => {
  console.log(`Tourists spot server port :${port}`)
})