module.exports = (app) => {
    const historyField = require("../controllers/historyField.controller.js");
  
    var router = require("express").Router();
  
    router.post("/", historyField.create);

    router.put("/add/cinema/:uid", historyField.addToCinemaField)

    router.put("/add/accompagnateurs/:uid", historyField.addToAccompagnateursField)

    router.get("/get/cinema/:uid", historyField.findByCinemaField)

    router.get("/get/accompagnateurs/:uid", historyField.findByAccompagnateursField)

    router.delete("/delete/cinema/:uid", historyField.deleteFromCinemaField)

    router.delete("/delete/accompagnateurs/:uid", historyField.deleteFromAccompagnateursField)
  
    app.use("/api/historyField", router);
  };