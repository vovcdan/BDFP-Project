const db = require("../models");
const allListDB = db.allLists;

/**
 * Crée un utilisateur depuis angular et l'ajoute dans la BD
 * @param req donne accès à tous les paramètres
 * @param res revoie le status des requêtes
 */
exports.create = (req, res) => {
  if (!req.body) {
    res.status(400).send({ message: "Le contenu ne peut pas être vide" });
    return;
  }

  allListDB
    .create({
      uid: req.body.uid,
      titrelist: req.body.titrelist,
      shared: false,
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

/**
 * Crée un utilisateur depuis angular et l'ajoute dans la BD
 * @param req donne accès à tous les paramètres
 * @param res revoie le status des requêtes
 */
exports.createShare = (req, res) => {
  if (!req.body) {
    res.status(400).send({ message: "Le contenu ne peut pas être vide" });
    return;
  }

  allListDB
    .create({
      uid: req.body.uid,
      titrelist: req.body.titrelist,
      shared: true,
      movies: req.body.movies,
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

/**
 * Récupère un utilisateur en fonction de l'id fournit en paramètre depuis la BD
 * @param req donne accès à tous les paramètres
 * @param res revoie le status des requêtes
 */
exports.findByIdAndTitle = (req, res) => {
  const uid = req.params.uid;
  const titrelist = req.params.titrelist;

  var condition = uid && titrelist ? { uid: uid, titrelist: titrelist } : {};

  allListDB
    .find(condition)
    .then((data) => {
      if (!data)
        res.status(404).send({ message: "Liste de films non trouvée " + uid });
      else res.send(data);
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Erreur pendant la récupération de la liste " + uid });
    });
};

/**
 * Récupère un utilisateur en fonction de l'id fournit en paramètre depuis la BD
 * @param req donne accès à tous les paramètres
 * @param res revoie le status des requêtes
 */
exports.isSharedList = (req, res) => {
  const uid = req.params.uid;
  const titrelist = req.params.titrelist;

  var condition = uid && titrelist ? { uid: uid, titrelist: titrelist } : {};

  allListDB
    .find(condition)
    .then((data) => {
      if (!data)
        res.status(404).send({ message: "Liste de films non trouvée " + uid });
      else res.send(data[0].shared);
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Erreur pendant la récupération de la liste " + uid });
    });
};

/**
 * Récupère un utilisateur en fonction de l'id fournit en paramètre depuis la BD
 * @param req donne accès à tous les paramètres
 * @param res revoie le status des requêtes
 */
exports.findMovieFromOneList = (req, res) => {
  const uid = req.params.uid;
  const titrelist = req.params.titrelist;
  const omdbID = req.params.omdbID;

  var condition =
    uid && titrelist
      ? {
          uid: uid,
          titrelist: titrelist,
          movies: { $elemMatch: { omdbID: omdbID } },
        }
      : {};

  allListDB
    .find(condition)
    .then((data) => {
      if (!data)
        res.status(404).send({ message: "Liste de films non trouvée " + uid });
      else {
        const movie = data[0].movies.find((m) => m.omdbID === omdbID);
        res.send(movie);
      }
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Erreur pendant la récupération de la liste " + uid });
    });
};

/**
 * Récupère un utilisateur en fonction de l'id fournit en paramètre depuis la BD
 * @param req donne accès à tous les paramètres
 * @param res revoie le status des requêtes
 */
exports.findById = (req, res) => {
  const uid = req.params.uid;

  var condition = uid
    ? { uid: { $regex: new RegExp(uid), $options: "i" } }
    : {};

  allListDB
    .find(condition)
    .then((data) => {
      if (!data)
        res.status(404).send({ message: "Liste de films non trouvée " + uid });
      else res.send(data);
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Erreur pendant la récupération de la liste " + uid });
    });
};

/**
 * Permet de mettre à jour la base de données avec les informations fournit en paramètres
 * @param req donne accès à tous les paramètres
 * @param res revoie le status des requêtes
 */
exports.update = (req, res) => {
  const uid = req.params.uid;
  const omdbID = req.params.omdbID;

  allListDB.collection
    .updateMany(
      { uid: uid, shared: false },
      {
        $set: {
          "movies.$[elem].note": req.body.note,
          "movies.$[elem].accompagnateurs": req.body.accompagnateurs,
          "movies.$[elem].cinema": req.body.cinema,
          "movies.$[elem].avis": req.body.avis,
          "movies.$[elem].dateVision": req.body.dateVision,
        },
      },
      { arrayFilters: [{ "elem.omdbID": omdbID }] }
    )
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Impossible de modifier, il n'existe peut être pas`,
        });
      } else {
        res.send({
          message: "film modifié",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: `erreur`,
      });
    });
};

/**
 * Récupère toutes les listes de films depuis la BD
 * @param req donne accès à tous les paramètres
 * @param res revoie le status des requêtes
 */
exports.findAll = (req, res) => {
  const uid = req.params.uid;

  var condition = uid
    ? { uid: { $regex: new RegExp(uid), $options: "i" } }
    : {};

  allListDB
    .find(condition)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Erreur pendant la récupération des données.",
      });
    });
};

exports.deleteOne = (req, res) => {
  const idListe = req.params.idListe;

  allListDB
    .findByIdAndRemove(idListe)
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Impossible de supprimer la liste ${idListe}. Elle n'existe peut être pas`,
        });
      } else {
        res.send({
          message: "La liste a été supprimée",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: `La liste ${idListe} n'a pas pu être supprimée`,
      });
    });
};

exports.addFilmToAList = (req, res) => {
  const uid = req.params.uid;
  const titrelist = req.params.titrelist;

  allListDB.collection
    .updateOne(
      { uid: uid, titrelist: titrelist },
      { $push: { movies: req.body.movies } }
    )
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Impossible d'ajouter le film à la liste ${titrelist}. Elle n'existe peut être pas`,
        });
      } else {
        res.send({
          message: "le film a été ajouté",
          titrelist: titrelist,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: `le film n'a pas pu être ajouté`,
      });
    });
};

exports.deleteMovieFromList = (req, res) => {
  const uid = req.params.uid;
  const titrelist = req.params.titrelist;
  const omdbID = req.params.omdbID;

  allListDB.collection
    .updateOne(
      { uid: uid, titrelist: titrelist },
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
          titrelist: titrelist,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: `Le film ${omdbID} n'a pas pu être supprimé`,
      });
    });
};

exports.deleteMovieFromAllLists = (req, res) => {
  const uid = req.params.uid;
  const omdbID = req.params.omdbID;

  allListDB.collection
    .updateMany(
      { uid: uid, shared: false },
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

exports.deleteAll = (req, res) => {
  allListDB
    .deleteMany({})
    .then((data) => {
      res.send({
        message: `${data.deletedCount} listes ont été supprimés`,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Erreur pendant la suppression de toutes les listes",
      });
    });
};
