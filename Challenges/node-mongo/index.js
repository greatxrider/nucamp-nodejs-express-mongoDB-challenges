// Import necessary modules: MongoDB client and assertion module.
// This line imports the MongoClient class from the 'mongodb-legacy' package.
const { MongoClient } = require('mongodb-legacy');
// This line imports the assertion module for error handling.
const assert = require('assert');

// Define MongoDB connection URL and database name.
// This line specifies the URL where the MongoDB server is running.
const url = 'mongodb://localhost:27017/';
// This line specifies the name of the database to connect to.
const dbName = 'nucampsite';

// Connect to MongoDB server.
// This line establishes a connection to the MongoDB server specified by the URL.
//empty object implies that you are using the default options provided by the MongoDB Node.JS server
MongoClient.connect(url, {}, (err, client) => {
    // Check if there's no error during the connection process.
    // If there's no error, continue with the connection process.
    assert.strictEqual(err, undefined);

    // Print a success message indicating the connection to the server was successful.
    console.log('Connected correctly to server');

    // Access the specified database using the client object.
    const db = client.db(dbName);

    // Drop the "campsites" collection from the database.
    // This line drops the "campsites" collection. If successful, continue with the operation.
    db.dropCollection('campsites', (err, result) => {
        // Check if there's no error while dropping the collection.
        assert.strictEqual(err, undefined);

        // Print a message indicating the collection was dropped successfully.
        console.log('Dropped Collection', result);

        // Access the "campsites" collection in the database.
        const collection = db.collection('campsites');

        // Insert a new document into the "campsites" collection.
        // This line inserts a new document with specified fields into the collection.
        collection.insertOne(
            { name: 'Breadcrumb Trail Campground', description: 'Test' },
            (err, result) => {
                // Check if there's no error during the insertion process.
                assert.strictEqual(err, undefined);

                // Print a message indicating the document was inserted successfully, along with its inserted ID.
                console.log('Insert Document:', result.insertedId);

                // Query and retrieve all documents from the "campsites" collection.
                // This line retrieves all documents from the collection and converts the result to an array.
                collection.find().toArray((err, docs) => {
                    // Check if there's no error while querying for documents.
                    assert.strictEqual(err, undefined);

                    // Print all retrieved documents.
                    console.log('Found Documents:', docs);

                    // Close the MongoDB client connection
                    client.close();
                });
            },
        );
    });
});
