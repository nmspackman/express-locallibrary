let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let GenreSchema = new Schema(
  {
    name: {type: String, minlength: 3, maxlength: 100}
  }
);

GenreSchema
.virtual('url')
.get(() => {
  return `/genre/${this._id}`;
});

module.exports = mongoose.model('Genre', GenreSchema);