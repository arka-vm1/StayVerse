const mongoose = require('mongoose');
const initData = require('./data.js');
const Listing = require('../models/listing.js');

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/airbnb');
}

main().then((res) => console.log("Connected to DB"))
.catch(err => console.log(err));

const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => (
        {...obj, owner:"688ce286d353d8b5477ad30f"}
    ));
    await Listing.insertMany(initData.data);
    console.log("DB initialized");
}

initDB();