
exports.DATABASE_URL = process.env.DATABASE_URL ||
'mongodb+srv://melita2:Loveyou2@cluster0-9rkqj.mongodb.net/test?retryWrites=true&w=majority';
exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL ||
                      'mongodb://localhost/referrals';
exports.PORT = process.env.PORT || 8080;
exports.JWT_SECRET = process.env.JWT_SECRET;
exports.JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';