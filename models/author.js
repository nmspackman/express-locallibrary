let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let AuthorSchema = new Schema(
  {
    first: {type: String, require: true, max: 100},
    family_name: {type: String, required: true, max: 100},
    date_of_birth: {type: Date},
    date_of_death: {type: Date},
  }
);

AuthorSchema
.virtual('name')
.get(() => {
  return `${this.family_name}, ${this.first_name}`;
});

AuthorSchema
.virtual('lifespan')
.get(() => {
  return (this.date_of_death.getYear() - this.date_of_birth.getYear()).toString();
});

AuthorSchema
.virtual('url')
.get(() => {
  return `/catalog/author/${this._id}`;
})

module.exports = mongoose.model('Author', AuthorSchema);