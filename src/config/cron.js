const cron = require("cron")
const https = require("https")
const job = new cron.CronJob("5 * * * * *", () => {
    // console.log("CronJob initialized");
    https.get(process.env.ONLINE_URI, (res) => {
        console.log('Backend URI fetched successfully with a statusCode of:', res.statusCode);
        // console.log('headers:', res.headers);

    }).on('error', (e) => {
        console.error(e);
    });
})
module.exports = job;