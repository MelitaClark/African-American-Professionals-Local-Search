
exports.DATABASE_URL = process.env.DATABASE_URL ||
                      'mongodb://localhost/referrals';
exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL ||
                      'mongodb://localhost/referrals';
exports.PORT = process.env.PORT || 8080;