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
  cors_url: process.env.CORS_URL,
  csrf_secret: process.env.CSRF_SECRET,
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
  },
  cloudinary: {
    name: process.env.CLOUD_NAME,
    key: process.env.API_KEY,
    secret: process.env.API_SECRET,
    url: process.env.CLOUDINARY_URL,
  },
  vnpay: {
    tmn_code: process.env.TMN_CODE,
    hash_secret: process.env.HASH_SECRET,
    url: process.env.URL,
    api: process.env.API,
    return_url: process.env.RETURN_URL,
  },
  momo: {
    partner_code: process.env.PARTNER_CODE,
    access_key: process.env.ACCESS_KEY,
    secret_key: process.env.SECRET_KEY,
    redirect_url: process.env.REDIRECT_URL,
    ipn_url: process.env.IPN_URL,
  },
  firebase: {
    project_id: process.env.FIREBASE_PROJECT_ID,
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    private_key: process.env.FIREBASE_PRIVATE_KEY,
  },
});
