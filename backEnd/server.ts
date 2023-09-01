import mongoose from "mongoose";
import app from "./app";
import { DB_URI, PORT, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY  } from "./config/config";
import AWS from "aws-sdk"

export async function main() {
  try {
    if(DB_URI)
    await mongoose
      .connect(DB_URI)
      .then(() => console.log("🍃 MongoDB successfully connected!") )
      .catch((err) => console.log(err));

      
    app.listen(PORT, () =>
      console.log(`📡 Server up and running on port ${PORT} !`)
    );

    AWS.config.update({
      region: 'eu-west-2',
      accessKeyId: AWS_ACCESS_KEY_ID,
      secretAccessKey: AWS_SECRET_ACCESS_KEY
  });
  
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
}
main();

require('./models/interest.model')
require('./models/questions.model')
require('./models/user.model')
require('./models/gender.model')
require('./models/instagram.model')
require('./models/spotify.model')
require('./models/interestCategories.model')
require('./models/premium.model')
require('./models/languages.model')
require('./models/pictures.model')