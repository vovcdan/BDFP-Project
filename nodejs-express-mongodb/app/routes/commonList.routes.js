module.exports = (app) => {
    const commonList = require("../controllers/commonList.controller.js");
  
    var router = require("express").Router();

    router.post("/", commonList.create)

    router.post("/addUser/:uid/:titrelist", commonList.addUserToCommonList)

    router.post("/movies/:uid/:titrelist", commonList.addMovie)

    router.get("/", commonList.findAll)

    router.get("/:uid", commonList.findAllOfUser)

    router.get("/:uid/:titrelist", commonList.findOne)

    router.get("/:uid/:titrelist/:omdbID", commonList.findMovie)

    router.delete("/:uid/:titrelist", commonList.deleteListFromCommonList)

    router.delete("/:uid/:titrelist/:omdbID", commonList.deleteMovieFromCommonList)

    app.use("/api/commonList", router)

}