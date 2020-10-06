module.exports = {
    PORT: process.env.PORT || 8000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    DATABASE_URL: process.env.DATABASE_URL || 'postgresql://beer@localhost/beer_critic_test',
    TEST_DATABASE_URL="postgresql://beer@localhost/beer_critic_test"
    JWT_SECRET: process.env.JWT_SECRET || 'super-secret'
}