const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');
const app=express();
const port=process.env.PORT || 5000;

//  middleWere
app.use(cors())
app.use(express.json())




// mongodb code




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ma7e2wv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
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
    const spotCollection=client.db('spotDB').collection('spot')
    const userCollection=client.db('userDB').collection('user')

    app.get('/addSpot', async(req,res)=>{
        const cursor=spotCollection.find().limit(6)
        const result=await cursor.toArray()
        res.send(result)
    })

    app.post('/addSpot',async(req,res)=>{
        const addSpot=req.body
        console.log(addSpot)
        const result=await spotCollection.insertOne(addSpot)
        res.send(result)
    })


    // user collection 
    app.post('/user',async(req,res)=>{
      const user=req.body
      console.log(user)
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req,res)=>{
    res.send('TOURISTS SPOT SERVER IS RUNNING')
})

app.listen(port,()=>{
    console.log(`Tourists spot server port :${port}`)
})