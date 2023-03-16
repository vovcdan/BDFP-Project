const db = require("../models");
const historyFieldDB = db.historyField;

exports.create = (req, res) => {
    if (!req.body) {
      res.status(400).send({ message: "Le contenu ne peut pas être vide" });
      return;
    }
  
    historyFieldDB.create({
      uid: req.body.uid,
      cinema: [],
      accompagnateurs: [],
    })
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || "Erreur pendant la creation de l'historique",
        });
      });
};

exports.findByCinemaField = (req, res) => {
    const uid = req.params.uid;
  
    var condition = uid
    ? { uid: { $regex: new RegExp(uid), $options: "i" } }
    : {};

  historyFieldDB.findOne(condition)
    .then((data) => {
      if (!data)
        res.status(404).send({
          message: "Historique de cinemas non trouvée pour l'utilisateur " + uid,
        });
      else res.send(JSON.stringify(data.cinema));
    })
    .catch((err) => {
      res.status(500).send({
        message:
          "Erreur pendant la récupération de l'historique de l'utilisateur " + uid,
      });
    });
};

exports.findByAccompagnateursField = (req, res) => {
    const uid = req.params.uid;
  
    var condition = uid
    ? { uid: { $regex: new RegExp(uid), $options: "i" } }
    : {};

  historyFieldDB.findOne(condition)
    .then((data) => {
      if (!data)
        res.status(404).send({
          message: "Historique d'accompagnateurs non trouvée pour l'utilisateur " + uid,
        });
      else res.send(JSON.stringify(data.accompagnateurs));
    })
    .catch((err) => {
      res.status(500).send({
        message:
          "Erreur pendant la récupération de l'historique de l'utilisateur " + uid,
      });
    });
};

exports.addToCinemaField = (req, res) => {
    const uid = req.params.uid;
  
    historyFieldDB.collection
      .updateOne({ uid: uid }, { $addToSet: { cinema: req.body.cinema } })
      .then((data) => {
        if (!data)
          res.status(404).send({ message: "Aucun utilisateur avec l'ID: " + uid });
        else res.send(JSON.stringify(data.cinema));
      })
      .catch((err) => {
        res.status(500).send({
          message: "Erreur pendant l'ajout de l'historique cinema pour l'utilisateur avec l'ID: " + uid,
        });
      });
};

exports.addToAccompagnateursField = (req, res) => {
    const uid = req.params.uid;
  
    historyFieldDB.collection
      .updateOne({ uid: uid }, { $addToSet: { accompagnateurs: req.body.accompagnateurs } })
      .then((data) => {
        if (!data)
          res.status(404).send({ message: "Aucun utilisateur avec l'ID: " + uid });
        else res.send(JSON.stringify(data.accompagnateurs));
      })
      .catch((err) => {
        res.status(500).send({
          message: "Erreur pendant l'ajout de l'historique cinema pour l'utilisateur avec l'ID: " + uid,
        });
      });
};

exports.deleteFromAccompagnateursField = (req, res) => {
    const uid = req.params.uid;
  
    historyFieldDB.collection
      .updateOne({ uid: uid }, { $pull: { accompagnateurs: req.body.accompagnateurs } })
      .then(async (data) => {
        if (!data) {
          res.status(404).send({ message: "Aucun utilisateur avec l'ID: " + uid });
        } else {
            const updatedHistoryField = await historyFieldDB.collection.findOne({ uid: uid });
            res.send(JSON.stringify(updatedHistoryField.accompagnateurs));
        }
      })
      .catch((err) => {
        res.status(500).send({
          message: "Erreur pendant l'ajout de l'historique cinema pour l'utilisateur avec l'ID: " + uid,
        });
      });
};

exports.deleteFromCinemaField = (req, res) => {
    const uid = req.params.uid;
  
    historyFieldDB.collection
      .updateOne({ uid: uid }, { $pull: { cinema: req.body.cinema } })
      .then(async (data) => {
        if (!data) {
          res.status(404).send({ message: "Aucun utilisateur avec l'ID: " + uid });
        } else {
            const updatedHistoryField = await historyFieldDB.collection.findOne({ uid: uid });
            res.send(JSON.stringify(updatedHistoryField.cinema));
        }
      })
      .catch((err) => {
        res.status(500).send({
          message: "Erreur pendant l'ajout de l'historique cinema pour l'utilisateur avec l'ID: " + uid,
        });
      });
};