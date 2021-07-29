const nodemailer = require("nodemailer");
const { Pool } = require("pg");
const request = require("request-promise-native");

const Q = async function (uri, method = "GET", body = {}) {
  var option = new Object();
  option.headers = {
    Accept: "application/vnd.heroku+json; version=3",
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env["HEROKU_KEY"]}`,
  };
  option.json = true;
  option.uri = uri;
  option.method = method;
  option.body = JSON.stringify(body);
  return await request(option);
};

const dyno_list = async function () {
  let uri = `https://api.heroku.com/apps/${process.env.APP_NAME}/dynos`;
  return await Q(uri);
};

const get_conn = async function () {
  const pool = new Pool({
    user: "grinch",
    host: "localhost",
    database: "heroku_logs",
    port: 5432,
    password: "1",
  });
  return pool.connect();
};

const getDiffernce = function (arr1, arr2) {
  const sortedArrs = function (arr1, arr2) {
    if (arr1.length > arr2.length) {
      return [arr1, arr2];
    } else {
      return [arr2, arr1];
    }
  };
  let BIG = sortedArrs(arr1, arr2)[0];
  let SMALL = sortedArrs(arr1, arr2)[0];

  let diff = [];
  for (let i of BIG) {
    if (!SMALL.includes(i)) {
      diff.push(i);
    }
  }
  return diff;
};

const getCurrentTime = function () {
  const today = new Date();
  const date =
    today.getFullYear() +
    "-0" +
    (today.getMonth() + 1) +
    "-0" +
    today.getDate();
  const time =
    today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  return date + " " + time;
};

const logger = async function (iterationInterval) {
  setTimeout(async () => {
    let dynos = await dyno_list();
    let dateTime = getCurrentTime();
    let current_name_state = {};
    dynos.forEach((d) => {
      let modified_name = d.name.replace(".", "_");
      current_name_state[modified_name] = d.state;
    });
    let client = await get_conn();

    let old_name_state = (
      await client.query("SELECT * FROM logs", [])
    ).rows.map((d) => {
      return d.dyno;
    });

    let diff = getDiffernce(old_name_state, Object.keys(current_name_state));
    // three cases might happen:
    // 1: a new dyno in the current state
    // 2: a missing dyno in the current state
    // 3: dynos in both are the same, ie; diff is []

    // case #1:
    // we add the new dyno to the database
    if (Object.keys(current_name_state).includes(diff)) {
      for (item of diff) {
        await client.query("INSERT INTO logs(status,dyno) VALUES($1,$2);", [
          current_name_state[item],
          item,
        ]);
      }
    }
    // case #2:
    // a dyno is dead and didn't retrieve in the request, but it's present in the database
    // we must notify the user:
    if (old_name_state.includes(diff)) {
      // secretary(diff);
      console.log("email sent");
    } // => to case 3 (updating the rest)

    // case #3:
    // there is no difference in the dataset:
    // update dynos in the database
    for (let key in current_name_state) {
      let modified_name = key.replace(".", "_");
      await client.query(
        "UPDATE logs SET status = $1, time = $2 WHERE dyno = $3;",
        [current_name_state[key], dateTime, modified_name]
      );
    }
    client.release();
    if (iterationInterval !== 0) {
      setTimeout(logger, iterationInterval * 1000 * 60);
    }
  }, 1);
};

const detector = async function (iterationInterval) {
  setTimeout(async () => {
    let client = await get_conn();
    let getQ = (await client.query("SELECT * FROM logs;", [])).rows;
    client.release();
    let alert_arr = getQ.map((r) => {
      if (r.status !== "up") {
        return r;
      }
    });
    if (
      alert_arr.filter((i) => {
        i !== undefined;
      }).length > 0
    ) {
      // secretary(alert_arr);
      console.log("email sent", alert_arr);
    }
    setTimeout(detector, iterationInterval * 1000 * 60);
  }, 1);
};

const secretary = async function (arr) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const textGen = function (arr) {
    let txt = "Changes in your App detected: /n ";
    for (let item in arr) {
      txt =
        txt +
        item.dyno +
        "'s status has changed to " +
        item.status +
        "at " +
        item.time;
    }
    return txt;
  };

  const mailOptions = {
    from: "heroku.secretary@gmail.com",
    to: process.env.RECIPIENT_EMAIL,
    subject: `Heroku ${process.env.APP_NAME} Alert!`,
    text: textGen(arr),
    html: "<h1>ALERT!</h1>",
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

module.exports = { logger, detector };
