/**
 * Controlleur du modele movie
 * Permet de faire des actions avec un objet movie
 */

const db = require("../models/");
const MovieDB = db.movie;

/**
 * La fonction create permet de recupérer un objet movie depuis angular et de sauvegarder dans la base de données mongoDB
 * @param req donne accès à tous les paramètres
 * @param res revoie le status des requêtes
 */
exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({ message: "Le contenu ne peut pas être vide!" });
    return;
  }

  // Ajoute l'objet movie dans la BD
  MovieDB.create({
    movies: req.body.movies,
    uid: req.body.uid,
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Une erreur est intervenue durant le processus d'ajout d'un film.",
      });
    });
};

/**
 * Récupère tous les films depuis la BD
 * @param req donne accès à tous les paramètres
 * @param res revoie le status des requêtes
 */
exports.findAll = (req, res) => {
  const title = req.query.title;
  var condition = title
    ? { title: { $regex: new RegExp(title), $options: "i" } }
    : {};

  MovieDB.find(condition)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Erreur pendant la récupération des films",
      });
    });
};

exports.getListOfUser = (req, res) => {
  const uid = req.params.uid;

  var condition = uid
    ? { uid: { $regex: new RegExp(uid), $options: "i" } }
    : {};

  MovieDB.find(condition)
    .then((data) => {
      if (!data)
        res.status(404).send({
          message: "Liste de films non trouvée pour l'utilisateur " + uid,
        });
      else res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          "Erreur pendant la récupération de la liste de l'utilisateur " + uid,
      });
    });
};

/**
 * Récupère un film en fonction de l'id fournit en paramètre depuis la BD
 * @param req donne accès à tous les paramètres
 * @param res revoie le status des requêtes
 */
exports.findOne = (req, res) => {
  const uid = req.params.uid;
  const omdbID = req.params.omdbID;

  var condition =
    uid && omdbID
      ? { uid: uid, movies: { $elemMatch: { omdbID: omdbID } } }
      : {};

  MovieDB.findOne(condition)
    .then((data) => {
      if (data) {
        const movie = data.movies.find((m) => m.omdbID === omdbID);
        res.send(JSON.stringify(movie));
      } else res.status(404).send("Aucun film trouvé avec l'id: " + omdbID);
    })
    .catch((err) => {
      if (err.status === 500)
        res.status(500).send({
          message: "Erreur pendant la récupération du film avec l'id " + err,
        });
      else res.status(404).send("Aucun film trouvé avec l'id: ");
    });
};

exports.addFilmToList = (req, res) => {
  const uid = req.params.uid;

  MovieDB.collection
    .updateOne({ uid: uid }, { $push: { movies: req.body.movies } })
    .then((data) => {
      if (!data)
        res.status(404).send({ message: "film trouvé avec l'id: " + uid });
      else res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: "Erreur pendant la récupération du film avec l'id" + uid,
      });
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

  MovieDB.collection
    .findOneAndUpdate(
      { uid: uid },
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
 * supprime un film de la BD en fonction de l'id fournit en paramètres
 * @param req donne accès à tous les paramètres
 * @param res revoie le status des requêtes
 */
exports.deleteMovieById = (req, res) => {
  const uid = req.params.uid;
  const omdbID = req.params.omdbID;

  MovieDB.collection
    .updateOne({ uid: uid }, { $pull: { movies: { omdbID: omdbID } } })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Impossible de supprimer le film ${omdbID}. il n'existe peut être pas`,
        });
      } else {
        res.send({
          message: "le film a été supprimé",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: `le film ${omdbID} n'a pas pu être supprimé`,
      });
    });

  // db.temp.update(
  //   { _id : "777" },
  //   {$pull : {"someArray.0.someNestedArray" : {"name":"delete me"}}}
  // )
};

/**
 * Supprime tous les movies dans la BD en fonction d'un id passé en paramètres
 * @param req donne accès à tous les paramètres
 * @param res revoie le status des requêtes
 */
exports.deleteAll = (req, res) => {
  MovieDB.deleteMany({})
    .then((data) => {
      res.send({
        message: `${data.deletedCount} movies ont été supprimés`,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Erreur pendant la suppression de tous les movies",
      });
    });
};

exports.findByDateVision = (req, res) => {
  const uid = req.params.uid;
  const dateVision = req.params.dateVision;

  MovieDB.aggregate([
    { $match: { uid: uid } },
    { $unwind: "$movies" },
    { $match: { "movies.dateVision": dateVision } },
  ])
    .then((data) => {
      if (!data || data.length === 0) {
        res.status(404).send({
          message: "Aucun film vu en " + dateVision,
        });
      } else {
        const movies = data.map((d) => d.movies);
        res.send(JSON.stringify(movies));
      }
    })
    .catch((err) => {
      res.status(500).send({
        message:
          "Erreur pendant la récupération des films vus en " + dateVision,
      });
    });
};

exports.findByLocation = (req, res) => {
  const uid = req.params.uid;
  const cinema = req.params.cinema;

  MovieDB.aggregate([
    { $match: { uid: uid } },
    { $unwind: "$movies" },
    { $match: { "movies.cinema": cinema } },
  ])
    .then((data) => {
      if (!data || data.length === 0) {
        res.status(404).send({
          message: "Aucun film vu au cinema " + cinema,
        });
      } else {
        const movies = data.map((d) => d.movies);
        res.send(JSON.stringify(movies));
      }
    })
    .catch((err) => {
      res.status(500).send({
        message:
          "Erreur pendant la récupération des films vus au cinema " + cinema,
      });
    });
};

exports.findByAccompagnateurs = (req, res) => {
  const uid = req.params.uid;
  const accompagnateurs = req.params.accompagnateurs;

  MovieDB.aggregate([
    { $match: { uid: uid } },
    { $unwind: "$movies" },
    {
      $match: {
        "movies.accompagnateurs": {
          $in: [new RegExp(`.*${accompagnateurs}.*`, "i")],
        },
      },
    },
  ])
    .then((data) => {
      if (!data || data.length === 0) {
        res.status(404).send({
          message: "Aucun film vu avec " + accompagnateurs,
        });
      } else {
        const movies = data.map((d) => d.movies);
        res.send(JSON.stringify(movies));
      }
    })
    .catch((err) => {
      res.status(500).send({
        message:
          "Erreur pendant la récupération des films vus avec " +
          accompagnateurs,
      });
    });
};

exports.findByNote = (req, res) => {
  const uid = req.params.uid;
  const note = req.params.note;

  MovieDB.aggregate([
    { $match: { uid: uid } },
    { $unwind: "$movies" },
    { $match: { "movies.note": note } },
  ])
    .then((data) => {
      if (!data || data.length === 0) {
        res.status(404).send({
          message: "Aucun film avec la note " + note,
        });
      } else {
        const movies = data.map((d) => d.movies);
        res.send(JSON.stringify(movies));
      }
    })
    .catch((err) => {
      res.status(500).send({
        message:
          "Erreur pendant la récupération des films vus avec la note " + note,
      });
    });
};

exports.findByAvis = (req, res) => {
  const uid = req.params.uid;
  const avis = req.params.avis;

  MovieDB.aggregate([
    { $match: { uid: uid } },
    { $unwind: "$movies" },
    { $match: { "movies.avis": { $in: [new RegExp(`.*${avis}.*`, "i")] } } },
  ])
    .then((data) => {
      if (!data || data.length === 0) {
        res.status(404).send({
          message: "Aucun film avec l'avis " + avis,
        });
      } else {
        const movies = data.map((d) => d.movies);
        res.send(JSON.stringify(movies));
      }
    })
    .catch((err) => {
      res.status(500).send({
        message:
          "Erreur pendant la récupération des films vus avec l'avis " + avis,
      });
    });
};
