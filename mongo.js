const mongoose= require('mongoose');
const dotenv = require('dotenv-defaults');

dotenv.config();

module.exports = {
  connect: () => {
    dotenv.config();
    if (!process.env.MONGO_URI) {
      console.error("Missing MONGO_URL!!!");
      process.exit(1);
    }
    mongoose
    .connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((res) => console.log("mongo db connection created"));
    mongoose.connection.on('error',
      console.error.bind(console, 'connection error:'));
  }
}