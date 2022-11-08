const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const port = process.env.PORT || 5000;

// using middlewares
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello from eye specialist server');
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.4qifqp4.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const servicesCollection = client.db("review_server").collection("services");

        app.get('/services', async (req, res) => {
            const query = {};

            const cursor = servicesCollection.find(query);

            const result = await cursor.toArray();

            res.send(result);
        })

        app.get('/service/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };

            const service = await servicesCollection.findOne(query);

            res.send(service);
        })
    }
    finally {

    }
}

run().catch(error => console.error(error));

app.listen(port, () => {
    console.log(`Eye specialist app listening on port ${port} with nodemon`)
})