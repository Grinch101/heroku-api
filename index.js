const express = require("express");
const app = express();
const dynoRouter = require("./routes/dyno_handlers");
const { detector, logger } = require("./alertSys");

console.log(process.env.HEROKU_KEY);
console.log(process.env.APP_NAME);
console.log(process.env.RECIPIENT_EMAIL);
console.log(process.env.EMAIL_USER);

logger(30);
detector(31);

app.use(express.json());
app.use("/D", dynoRouter);

app.listen(3000);
