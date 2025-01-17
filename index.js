const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());

// console.log(process.env.DB_USER);
// console.log(process.env.DB_PASS);

const uri =
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_USER}@cluster0.7argw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
  console.log(uri);

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
      

        const userCunection = client.db('practiceDB').collection('practice');

        app.get('/users', async (req, res) => {
            const cursor = userCunection.find()
            // console.log(cursor);
            const result = await cursor.toArray();
            res.send(result)
        })

      app.post('/users', async(req, res) => {
          const newUser = req.body;
          console.log(newUser);
          const result = await userCunection.insertOne(newUser)
          res.send(result)
      })
        
        app.delete('/users/:id', async (req, res) => {
            console.log(req.params.id);
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await userCunection.deleteOne(query);
            res.send(result);
        })



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('server is running')
})



app.listen(port, () => {
    console.log('server is running on port');
})