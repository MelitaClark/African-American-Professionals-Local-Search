'use strict';
exports.DATABASE_URL = process.env.DATABASE_URL ||
'mongodb+srv://melita2:Loveyou2@cluster0-9rkqj.mongodb.net/createReferrals?retryWrites=true&w=majority';
exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL ||
                      'mongodb://localhost/referrals';
exports.PORT = process.env.PORT || 8080;