const { Q } = require("../utils");

Dynos = new Object();

const app_id_or_name = process.env.APP_NAME;

// https://devcenter.heroku.com/articles/platform-api-reference#formation-list
Dynos.formation_list = async function () {
  let uri = `https://api.heroku.com/apps/${app_id_or_name}/formation`;
  return await Q(uri);
};

//  https://devcenter.heroku.com/articles/platform-api-reference#formation-info
Dynos.formation_info = async function (formation_id) {
  let uri = `https://api.heroku.com/apps/${app_id_or_name}/formation/${formation_id}`;
  return await Q(uri);
};

//https://devcenter.heroku.com/articles/platform-api-reference#formation-batch-update
Dynos.formation_batch_update = async function (body) {
  let uri = `https://api.heroku.com/apps/${app_id_or_name}/formation/`;
  return await Q(uri, "PATCH", body);
};

//https://devcenter.heroku.com/articles/platform-api-reference#formation-update
Dynos.formation_update = async function (formation_id, body) {
  let uri = `https://api.heroku.com/apps/${app_id_or_name}/formation/${formation_id}`;
  return await Q(uri, "PATCH", body);
};

// https://devcenter.heroku.com/articles/platform-api-reference#dyno-list
Dynos.dyno_list = async function () {
  let uri = `https://api.heroku.com/apps/${app_id_or_name}/dynos`;
  return await Q(uri);
};

// https://devcenter.heroku.com/articles/platform-api-reference#dyno-create
Dynos.create_dyno = async function (body) {
  let uri = `https://api.heroku.com/apps/${app_id_or_name}/dynos`;
  return await Q(uri, "POST", body);
};

// https://devcenter.heroku.com/articles/platform-api-reference#dyno-restart
Dynos.restart = async function (id) {
  let uri = `https://api.heroku.com/apps/${app_id_or_name}/dynos/${id}`;
  return await Q(uri, "DELETE");
};

// https://devcenter.heroku.com/articles/platform-api-reference#dyno-restart-all
Dynos.restart_all = async function () {
  let uri = `https://api.heroku.com/apps/${app_id_or_name}/dynos`;
  return await Q(uri, "DELETE");
};

// https://devcenter.heroku.com/articles/platform-api-reference#dyno-stop
Dynos.stop = async function (id) {
  let uri = `https://api.heroku.com/apps/${app_id_or_name}/dynos/${id}/actions/stop`;
  return await Q(uri, "POST");
};

// https://devcenter.heroku.com/articles/platform-api-reference#dyno-info
Dynos.info = async function (id) {
  let uri = `https://api.heroku.com/apps/${app_id_or_name}/dynos/${id}`;
  return await Q(uri);
};

// https://devcenter.heroku.com/articles/platform-api-reference#dyno-size-list
Dynos.dyno_sizes = async function () {
  let uri = "https://api.heroku.com/dyno-sizes";
  return await Q(uri);
};

// https://devcenter.heroku.com/articles/platform-api-reference#dyno-size-info
Dynos.dyno_size_info = async function (id) {
  let uri = `https://api.heroku.com/dyno-sizes/${id}`;
  return await Q(uri);
};

// https://devcenter.heroku.com/articles/platform-api-reference#invoice-list
Dynos.invoice_list = async function () {
  let uri = "https://api.heroku.com/account/invoices";
  return await Q(uri);
};

// https://devcenter.heroku.com/articles/platform-api-reference#key-list
Dynos.key_list = async function () {
  let uri = "https://api.heroku.com/account/keys";
  return await Q(uri);
};

// https://devcenter.heroku.com/articles/platform-api-reference#enterprise-account
Dynos.enterprise_accounts = async function () {
  let uri = "https://api.heroku.com/enterprise-accounts";
  return await Q(uri);
};

module.exports = Dynos;
