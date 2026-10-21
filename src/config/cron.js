const cron = require("cron")
const https = require("https")
const job = new cron.CronJob("5 * * * * *", () => {
    // console.log("CronJob initialized");
    https.get(process.env.ONLINE_URL, (res) => {
        console.log('Backend URL fetched successfully with a statusCode of:', res.statusCode);
        // console.log('headers:', res.headers);

    }).on('error', (e) => {
        console.error(e);
    });
})
module.exports = job;