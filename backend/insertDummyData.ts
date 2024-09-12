const { MongoClient, ObjectId } = require('mongodb');

// Connection URL and Database Name
const url = "mongodb+srv://Cluster45056:ZHV0dG9+Qkdc@cluster45056.vtq1n.mongodb.net/?retryWrites=true&w=majority&appName=Cluster45056"; // Replace with your MongoDB connection string
const dbName = 'test'

// Dummy user data
const users = [
  {
    phoneNumber: '+13108712726',
    firstName: 'Victoria',
    location: 'Los Angeles',
    profilePhoto: 'https://example.com/victoria.jpg',
    additionalPhotos: ['https://example.com/victoria_2.jpg', 'https://example.com/victoria_3.jpg'],
    birthday: new Date('1998-05-15'),
    age: 25,
    gender: 'woman',
    desiredGender: 'man',
    college: 'UCLA',
    job: 'Software Engineer',
    promptAnswers: { 'My ideal date': 'A picnic in the park followed by stargazing' },
    closestContacts: [
      { name: 'Kate Bell', phoneNumber: '(555) 564-8583', _id: new ObjectId('66e0d41d2948e18efc2b6a9a') },
      { name: 'Daniel Higgins Jr.', phoneNumber: '555-478-7672', _id: new ObjectId('66e0d41d2948e18efc2b6a9b') },
      { name: 'John Appleseed', phoneNumber: '888-555-5512', _id: new ObjectId('66e0d41d2948e18efc2b6a9c') },
      { name: 'Anna Haro', phoneNumber: '555-522-8243', _id: new ObjectId('66e0d41d2948e18efc2b6a9d') },
      { name: 'Hank M. Zakroff', phoneNumber: '(555) 766-4823', _id: new ObjectId('66e0d41d2948e18efc2b6a9e') },
      { name: 'David Taylor', phoneNumber: '555-610-6679', _id: new ObjectId('66e0d41d2948e18efc2b6a9f') }
    ],
    excludedContacts: [],
    matches: [],
    _id: new ObjectId(),
    __v: 0
  },
  {
    phoneNumber: '+14155551234',
    firstName: 'Alex',
    location: 'San Francisco',
    profilePhoto: 'https://example.com/alex.jpg',
    additionalPhotos: ['https://example.com/alex_2.jpg'],
    birthday: new Date('1995-09-22'),
    age: 28,
    gender: 'man',
    desiredGender: 'woman',
    college: 'Stanford University',
    job: 'Product Manager',
    promptAnswers: { 'My hidden talent': 'I can solve a Rubik\'s cube in under a minute' },
    closestContacts: [],
    excludedContacts: [],
    matches: [],
    _id: new ObjectId(),
    __v: 0
  },
  {
    phoneNumber: '+12125557890',
    firstName: 'Emma',
    location: 'New York City',
    profilePhoto: 'https://example.com/emma.jpg',
    additionalPhotos: ['https://example.com/emma_2.jpg', 'https://example.com/emma_3.jpg', 'https://example.com/emma_4.jpg'],
    birthday: new Date('1997-12-03'),
    age: 26,
    gender: 'woman',
    desiredGender: 'man',
    college: 'NYU',
    job: 'Marketing Specialist',
    promptAnswers: { 'My go-to karaoke song': 'Don\'t Stop Believin\' by Journey' },
    closestContacts: [
      { name: 'Kate Bell', phoneNumber: '(555) 564-8583', _id: new ObjectId('66e0d41d2948e18efc2b6a9a') },
      { name: 'Daniel Higgins Jr.', phoneNumber: '555-478-7672', _id: new ObjectId('66e0d41d2948e18efc2b6a9b') }
    ],
    excludedContacts: [],
    matches: [],
    _id: new ObjectId(),
    __v: 0
  },
  {
    phoneNumber: '+16175559876',
    firstName: 'Michael',
    location: 'Boston',
    profilePhoto: 'https://example.com/michael.jpg',
    additionalPhotos: [],
    birthday: new Date('1994-07-18'),
    age: 29,
    gender: 'man',
    desiredGender: 'woman',
    college: 'MIT',
    job: 'Data Scientist',
    promptAnswers: { 'My favorite travel story': 'Getting lost in Tokyo and stumbling upon the best ramen shop' },
    closestContacts: [
      { name: 'John Appleseed', phoneNumber: '888-555-5512', _id: new ObjectId('66e0d41d2948e18efc2b6a9c') },
      { name: 'Anna Haro', phoneNumber: '555-522-8243', _id: new ObjectId('66e0d41d2948e18efc2b6a9d') },
      { name: 'Hank M. Zakroff', phoneNumber: '(555) 766-4823', _id: new ObjectId('66e0d41d2948e18efc2b6a9e') }
    ],
    excludedContacts: [],
    matches: [],
    _id: new ObjectId(),
    __v: 0
  },
  {
    phoneNumber: '+17735551111',
    firstName: 'Sophia',
    location: 'Chicago',
    profilePhoto: 'https://example.com/sophia.jpg',
    additionalPhotos: ['https://example.com/sophia_2.jpg', 'https://example.com/sophia_3.jpg'],
    birthday: new Date('1999-02-28'),
    age: 24,
    gender: 'woman',
    desiredGender: 'man',
    college: 'University of Chicago',
    job: 'Graphic Designer',
    promptAnswers: { 'My most controversial opinion': 'Pineapple belongs on pizza' },
    closestContacts: [
      { name: 'Kate Bell', phoneNumber: '(555) 564-8583', _id: new ObjectId('66e0d41d2948e18efc2b6a9a') },
      { name: 'Daniel Higgins Jr.', phoneNumber: '555-478-7672', _id: new ObjectId('66e0d41d2948e18efc2b6a9b') },
      { name: 'John Appleseed', phoneNumber: '888-555-5512', _id: new ObjectId('66e0d41d2948e18efc2b6a9c') },
      { name: 'Anna Haro', phoneNumber: '555-522-8243', _id: new ObjectId('66e0d41d2948e18efc2b6a9d') },
      { name: 'Hank M. Zakroff', phoneNumber: '(555) 766-4823', _id: new ObjectId('66e0d41d2948e18efc2b6a9e') }
    ],
    excludedContacts: [],
    matches: [],
    _id: new ObjectId(),
    __v: 0
  }
];

async function insertDummyData() {
  const client = new MongoClient(url, { useUnifiedTopology: true });

  try {
    await client.connect();
    console.log('Connected to the database');

    const db = client.db(dbName);
    const collection = db.collection('users');

    // Insert the dummy data
    const result = await collection.insertMany(users);
    console.log(`${result.insertedCount} documents were inserted`);
  } catch (err) {
    console.error('An error occurred:', err);
  } finally {
    await client.close();
    console.log('Disconnected from the database');
  }
}

insertDummyData();