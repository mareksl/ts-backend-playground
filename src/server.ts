import app from './app';

const port = process.env.PORT;

const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log('Press CTRL-C to stop\n');
});

export default server;
