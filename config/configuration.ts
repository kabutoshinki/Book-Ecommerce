export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  secret: process.env.SECRET,
  database: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    name: process.env.DB_NAME,
  },
  client_id: process.env.CLIENT_ID,
  client_secret: process.env.CLIENT_SECRET,
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    secret: process.env.REDIS_SECRET,
    uri: process.env.REDIS_URI,
  },
});
