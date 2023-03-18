const db = require("../models");
const commonListDB = db.commonList;

exports.create = (req, res) => {
  if (!req.body) {
    res.status(400).send({ message: "Le contenu ne peut pas être vide" });
    return;
  }

  commonListDB
    .create({
      uids: [req.body.uid],
      titrelist: req.body.titrelist,
      common: true,
      movies: [],
    })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Erreur pendant la creation de la liste",
      });
    });
};

exports.findAll = (req, res) => {
  commonListDB
    .find({})
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Erreur pendant la récupération des utilisateurs",
      });
    });
};

exports.findAllOfUser = (req, res) => {
  const uid = req.params.uid;

  commonListDB
    .find({ uids: { $in: [uid] } })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Erreur pendant la récupération des données.",
      });
    });
};

exports.findOne = (req, res) => {
  const uid = req.params.uid;
  const titrelist = req.params.titrelist;

  commonListDB
    .find({ uids: { $in: [uid] }, titrelist: titrelist })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Erreur pendant la récupération des données.",
      });
    });
};

exports.findMovie = (req, res) => {
    const uid = req.params.uid;
    const titrelist = req.params.titrelist;
    const omdbID = req.params.omdbID;

    commonListDB.findOne(
        { uids: { $in: [uid] }, titrelist: titrelist, movies: { $elemMatch: { omdbID: omdbID } } }
    ).then((data) => {
        res.send(data.movies);
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || "Erreur pendant la récupération des données.",
        });
      });
}

exports.addUserToCommonList = (req, res) => {
  const uid = req.params.uid;
  const titrelist = req.params.titrelist;
  const newUserId = req.body.newUserId;

  commonListDB
    .updateOne(
      { uids: { $in: [uid] }, titrelist: titrelist },
      { $push: { uids: newUserId } }
    )
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Impossible d'ajouter la personne à la liste ${titrelist}.`,
        });
      } else {
        res.send({
          message: "Nouvelle personne ajoutée",
          titrelist: titrelist,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: `La nouvelle personne n'a pas pu être ajoutée`,
      });
    });
};

exports.addMovie = (req, res) => {
  const uid = req.params.uid;
  const titrelist = req.params.titrelist;
  const movie = req.body.movie;

  commonListDB
    .updateOne(
      { uids: { $in: [uid] }, titrelist: titrelist },
      { $push: { movies: movie } }
    )
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Impossible d'ajouter la personne à la liste ${titrelist}.`,
        });
      } else {
        res.send({
          message: "Nouvelle personne ajoutée",
          titrelist: titrelist,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: `La nouvelle personne n'a pas pu être ajoutée`,
      });
    });
};

exports.deleteMovieFromCommonList = (req, res) => {
  const uid = req.params.uid;
  const titrelist = req.params.titrelist;
  const omdbID = req.params.omdbID;

  commonListDB.collection
    .updateOne(
      { uids: { $in: [uid] }, titrelist: titrelist },
      { $pull: { movies: { omdbID: omdbID } } }
    )
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Impossible de supprimer le film ${omdbID}. il n'existe peut être pas`,
        });
      } else {
        res.send({
          message: "Le film a été supprimé",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: `Le film ${omdbID} n'a pas pu être supprimé`,
      });
    });
};

exports.deleteListFromCommonList = (req, res) => {
    const uid = req.params.uid
    const titrelist = req.params.titrelist

  commonListDB.collection
    .deleteOne({ uids: { $in: [uid] }, titrelist: titrelist })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Impossible de supprimer le film ${omdbID}. il n'existe peut être pas`,
        });
      } else {
        res.send({
          message: "Le film a été supprimé",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: `Le film ${omdbID} n'a pas pu être supprimé`,
      });
    });
};
