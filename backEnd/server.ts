import app from "./app";
import { PORT  } from "./config/config";
import { sequelize } from "./config/sequelizeConfig";
import "./queues"
import "./models"


export async function main() {
  try {

    await sequelize.authenticate().then(() => console.log('🐘 PostgreSQL successfully connected!')).catch(e => console.log(e))
    await sequelize.sync().then(() => {
      console.log(`Tables have been synchronized.`);
    });
      
    app.listen(PORT, () =>
      console.log(`📡 Server up and running on port ${PORT} !`)
    );

  
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
}
main();

