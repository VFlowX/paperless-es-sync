import { logger } from '@services/logger';
import { ConnectOptions, MongoClient } from 'mongodb';

const _client = new MongoClient(process.env.MONGODB_URI || '', {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  connectTimeoutMS: 10000,
} as ConnectOptions);
// const _clientGridFS = new MongoClient(process.env.MONGODBFS_URI || '', {
//   useUnifiedTopology: true,
//   useNewUrlParser: true,
//   connectTimeoutMS: 10000,
// } as ConnectOptions)
// _clientGridFS.connect();
_client.connect();
_client.on("connectionReady", (e) => {
  logger('Mongo').info(`connectionReady ${e.connectionId}`,)
})
// export { _client, _clientGridFS }
export { _client }