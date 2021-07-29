const express = require("express");
const dynoRouter = express.Router();
const Dynos = require("../models/Dyno");

dynoRouter.get("/formation/list", async function (req, res) {
  let herokuResponse = await Dynos.formation_list();
  res.send(herokuResponse).end();
});

dynoRouter.get("/formation/:formation_id", async function (req, res) {
  let { formation_id } = req.params;
  let herokuResponse = await Dynos.formation_info(formation_id);
  res.send(herokuResponse).end();
});

dynoRouter.patch("/formation", async function (req, res){
  let { updates } = req.body;
  let herokuResponse = await Dynos.formation_batch_update(updates);
  res.send(herokuResponse).end();
  await manual_logger();
})

dynoRouter.patch("/formation/:formation_id", async function (req, res){
  let { formation_id } = req.params;
  let { updates } = req.body;
  let herokuResponse = await Dynos.formation_update(formation_id, updates);
  res.send(herokuResponse).end();
  await manual_logger();
})



dynoRouter.get("/dynos/names", async function (req, res) {
  let herokuResponse = await Dynos.formation_list();
  let names = herokuResponse.map(function (dyno) {
    let tempObj = {};
    tempObj[dyno.type] = dyno.id;
    return tempObj;
  });
  res.send(names).end();
});

dynoRouter.get("/dynos/list", async function (req, res) {
  let herokuResponse = await Dynos.dyno_list();
  res.send(herokuResponse).end();
});

dynoRouter.post("/dynos/create", async function (req, res) {
  let Props = {
    // default parameters
    attach: true,
    env: {
      COLUMNS: "80",
      LINES: "24",
    },
    force_no_tty: null,
    size: "hobby",
    type: "run",
    time_to_live: 1800,
  };
  Props.command = req.body.command || "bash";

  let herokuResponse = await Dynos.create_dyno(Props);
  res.send(herokuResponse).end();
  await manual_logger();

});

dynoRouter.delete("/dynos/restart/:id", async function (req, res) {
  let { id } = req.params;
  let herokuResponse = await Dynos.restart(id);
  res.send(herokuResponse).end();
  await manual_logger();

});

dynoRouter.delete("/dynos/restart/all", async function (req, res) {
  let herokuResponse = await Dynos.restart_all();
  res.send(herokuResponse).end();
  await manual_logger();
});

dynoRouter.post("", async function (req, res) {
  let { id } = req.params;
  let herokuResponse = await Dynos.stop(id);
  res.send(herokuResponse).end();
  await manual_logger();
});

dynoRouter.get("/dynos/:id", async function (req, res) {
  let { id } = req.params;
  let herokuResponse = await Dynos.info(id);
  res.send(herokuResponse).end();
});

dynoRouter.get("/dyno-sizes", async function (req, res) {
  let herokuResponse = await Dynos.get_dyno_sizes();
  res.send(herokuResponse);
});

dynoRouter.get("/accounts", async function (req, res) {
  let herokuResponse = await Dynos.enterprise_accounts();
  res.send(herokuResponse);
});

dynoRouter.get("/accounts/keys", async function (req, res) {
  let herokuResponse = await Dynos.key_list();
  res.send(herokuResponse);
});

dynoRouter.get("/accounts/invoices", async function (req, res) {
  let herokuResponse = await Dynos.invoice_list();
  res.send(herokuResponse);
});

module.exports = dynoRouter;
