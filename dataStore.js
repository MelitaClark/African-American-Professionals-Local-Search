const api_Config={
    api_key: 'wnGOZBUSDSSRT1LStfPciD8pwr-BEhWAId-SegMRQkYZ5TzH5R6oeqMeCpWgYj-nnJ3FnCZbH1b9laJFTWE8TqOjcTpsb11sZ1uOEXZaGlIyFJjyBGbrlPBBg_WfXHYx',
    client_id: '3n9Zq8YovnLQ0ZrRdtIiPQ',
    Authorization: 'Bearer <wnGOZBUSDSSRT1LStfPciD8pwr-BEhWAId-SegMRQkYZ5TzH5R6oeqMeCpWgYj-nnJ3FnCZbH1b9laJFTWE8TqOjcTpsb11sZ1uOEXZaGlIyFJjyBGbrlPBBg_WfXHYx>',
}
exports.DATABASE_URL = process.env.DATABASE_URL ||
                      'mongodb://localhost/referrals';
exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL ||
                      'mongodb://localhost/referrals';
exports.PORT = process.env.PORT || 8080;