import * as Sentry from '@sentry/node';
import { server } from './server';

let Keys = process.env || require('./Config/Credintials/Keys');
const Port = process.env.Port || 8000;
Sentry.init({ dsn: Keys.sentryKey });



server.start({ port: Port, tracing: true }, () => {
  console.log(`Server Starting on port ${Port}`)
})