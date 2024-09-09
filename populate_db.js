const { MongoClient } = require('mongodb');

async function populateDatabase() {
  const uri = "mongodb+srv://Cluster45056:ZHV0dG9+Qkdc@cluster45056.vtq1n.mongodb.net/?retryWrites=true&w=majority&appName=Cluster45056";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db("FriendsOfFriends_Users");
    const users = database.collection("users");

    // Insert users
    const result = await users.insertMany([
      {
        name: "Sam",
        location: "Los Angeles",
        profilePhoto: "https://randomuser.me/api/portraits/men/1.jpg",
        age: 23,
        sex: "Male",
        preference: "Female",
        school: "Stanford",
        matches: []
      },
      {
        name: "Kate",
        location: "Florida",
        profilePhoto: "https://randomuser.me/api/portraits/women/1.jpg",
        age: 23,
        sex: "Female",
        preference: "Male",
        school: "Brown",
        matches: []
      }
    ]);

    console.log(`${result.insertedCount} documents were inserted`);

    // Get the IDs of Sam and Kate
    const sam = await users.findOne({ name: "Sam" });
    const kate = await users.findOne({ name: "Kate" });

    // Update Sam's matches to include Kate
    await users.updateOne(
      { _id: sam._id },
      { $push: { matches: kate._id } }
    );

    // Update Kate's matches to include Sam
    await users.updateOne(
      { _id: kate._id },
      { $push: { matches: sam._id } }
    );

    console.log("Matches updated successfully");

  } finally {
    await client.close();
  }
}

populateDatabase().catch(console.error);