import app from './app';
import { env } from "./config/config";

const port = process.env.PORT;

const server = app.listen(port, () => {
  console.log(`Server is running on port ${port} in ${env} mode...`);
  console.log('Press CTRL-C to stop\n');
});

export default server;
