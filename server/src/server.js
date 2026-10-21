import app from './app.js';
import { connectDB } from './config/db.js';
import { ENV } from './config/env.js';

const startServer = async () => {
  await connectDB();

  const server = app.listen(ENV.PORT, () => {
    console.log(`====================================================`);
    console.log(`  ZASAS Luxury Editorial E-Commerce Server`);
    console.log(`  Market: Pakistan (PKR)`);
    console.log(`  Mode: ${ENV.NODE_ENV}`);
    console.log(`  URL: http://localhost:${ENV.PORT}`);
    console.log(`  Client: ${ENV.CLIENT_URL}`);
    console.log(`====================================================`);
  });

  const handleShutdown = async () => {
    console.log('\nGracefully shutting down ZASAS server...');
    server.close(() => {
      console.log('HTTP server closed.');
      process.exit(0);
    });
  };

  process.on('SIGINT', handleShutdown);
  process.on('SIGTERM', handleShutdown);
};

startServer();
