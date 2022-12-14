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


// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.4qifqp4.mongodb.net/?retryWrites=true&w=majority`;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.vn3rehj.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const servicesCollection = client.db("review_server").collection("services");
        const reviewsCollection = client.db("review_server").collection("reviews");
        const blogsCollection = client.db("review_server").collection("blogs");

        app.get('/services', async (req, res) => {
            const query = {};

            const cursor = servicesCollection.find(query);

            const result = await cursor.toArray();

            res.send(result);
        })

        app.get('/services-in-home', async (req, res) => {
            const query = {};

            const cursor = servicesCollection.find(query);

            const result = await cursor.limit(3).toArray();

            res.send(result);
        })

        app.get('/service/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const reviewsQuery = { service_id: id }

            const service = await servicesCollection.findOne(query);
            const reviews = await reviewsCollection.find(reviewsQuery).toArray();

            res.send({ service, reviews });
        })

        app.get('/reviews', async (req, res) => {
            const query = {};

            const reviews = await reviewsCollection.find(query).toArray();

            res.send(reviews);
        })

        app.post('/review', async (req, res) => {
            const review = req.body;

            const result = await reviewsCollection.insertOne(review);

            res.send(result);
        })

        app.get('/blogs', async (req, res) => {
            const query = {};
            const blogs = await blogsCollection.find(query).toArray();

            res.send(blogs);
        })
    }
    finally {

    }
}

run().catch(error => console.error(error));

app.listen(port, () => {
    console.log(`Eye specialist app listening on port ${port} with nodemon`)
})