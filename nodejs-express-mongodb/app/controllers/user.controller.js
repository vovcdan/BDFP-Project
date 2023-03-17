const db = require("../models");
const UserDB = db.user;

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

  UserDB.create({
    email: req.body.email,
    mdp: req.body.mdp,
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Erreur pendant la creation de l'utilisateur",
      });
    });
};

/**
 * Récupère tous les utilisateurs depuis la BD
 * @param req donne accès à tous les paramètres
 * @param res revoie le status des requêtes
 */
exports.findAll = (req, res) => {
  const email = req.query.email;
  var condition = email
    ? { email: { $regex: new RegExp(email), $options: "i" } }
    : {};

  UserDB.find(condition)
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

/**
 * Récupère un utilisateur en fonction de l'id fournit en paramètre depuis la BD
 * @param req donne accès à tous les paramètres
 * @param res revoie le status des requêtes
 */
exports.findOne = (req, res) => {
  const id = req.params.id;

  UserDB.findById(id)
    .then((data) => {
      if (!data) {
        res
          .status(404)
          .send({ message: "Utilisateur non trouvé avec l'id " + id });
      } else {
        res.send(data);
      }
    })
    .catch((err) => {
      res.status(500).send({
        message:
          "Erreur pendant la récupération de l'utilisateur avec l'id " + id,
      });
    });
};

exports.findByMail = (req, res) => {
  const userMail = req.params.userMail;

  var condition = userMail
    ? { email: userMail }
    : {};

  UserDB.find(condition)
    .then((data) => {
      if (!data)
        res.status(404).send({ message: "Liste de films non trouvée " + userMail });
      else res.send(data);
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Erreur pendant la récupération de la liste " + userMail });
    });
};

exports.findByMailAndPassword = (req, res) => {
  const userMail = req.params.userMail;
  const password = req.params.password;

  var condition = userMail && password
    ? { email: userMail, mdp: password }
    : {};

  UserDB.find(condition)
    .then((data) => {
      if (!data)
        res.status(404).send({ message: `Aucun utilisateur trouvé avec les informations ${userMail} ${password}` });
      else res.send(data);
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Erreur pendant la récupération de l'utilisateur " + userMail });
    });
};

exports.findMembersNames = (req, res) => {
  const uid = req.params.uid;

  UserDB.findOne({
    _id: uid
  }).then((data) => {
    if (!data || data.length === 0) {
      res.status(404).send({ message: `Aucun utilisateur trouvé avec les informations` });
    } else {
      res.send(JSON.stringify(data.email));
    }
  })
  .catch((err) => {
    res.status(500).send({ message: "Erreur pendant la récupération de l'utilisateur " });
  });
}

/**
 * Met à jour un utilisateur dans la BD en fonction d'un id passé en paramètres
 * @param req donne accès à tous les paramètres
 * @param res revoie le status des requêtes
 */
exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Les données ne peut pas être vide",
    });
  }

  const id = req.params.id;

  UserDB.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Impossible de mettre à jour l'utilisateur ${id}. Il n'existe peut être pas.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Erreur pendant la mise à jour de l'utilisateur " + id,
      });
    });
};

/**
 * Supprime un utilisateur dans la BD en fonction d'un id passé en paramètres
 * @param req donne accès à tous les paramètres
 * @param res revoie le status des requêtes
 */
exports.delete = (req, res) => {
  const id = req.params.id;

  UserDB.findByIdAndRemove(id)
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Impossible de supprimer l'utilisateur ${id}. Il n'existe peut être pas`,
        });
      } else {
        res.send({
          message: "L'utilisateur a été supprimé",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: `L'utilisateur ${id} n'a pas pu être supprimé`,
      });
    });
};

/**
 * Supprime tous les utilisateurs dans la BD en fonction d'un id passé en paramètres
 * @param req donne accès à tous les paramètres
 * @param res revoie le status des requêtes
 */
exports.deleteAll = (req, res) => {
  UserDB.deleteMany({})
    .then((data) => {
      res.send({
        message: `${data.deletedCount} utilisateurs ont été supprimés`,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Erreur pendant la suppression de tous les utilisateurs",
      });
    });
};

exports.modifyMail = (req, res) => {
  const id = req.params.id;
  const email = req.body.email;

  UserDB.collection.updateOne(
    { _id : id }, 
    {$set: {email : email}},
    
  );
};
