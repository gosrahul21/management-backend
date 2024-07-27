export function getMongoUrl() {
  const env = process.env.NODE_ENV;
  console.log(process.env.MONGODB_URL_DEV);
  if (env === 'dev') {
    return process.env.MONGODB_URL_DEV;
  } else if (env === 'test') {
    return process.env.MONGODB_URL_TEST;
  } else {
    return process.env.MONGODB_URL_PROD;
  }
}
