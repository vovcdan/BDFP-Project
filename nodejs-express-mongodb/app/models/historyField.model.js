module.exports = (mongoose) => {
    const historyField = mongoose.model(
      "historyField",
      mongoose.Schema({
        uid: String,
        cinema: [String],
        accompagnateurs: [String],
      })
    );
  
    return historyField;
  };