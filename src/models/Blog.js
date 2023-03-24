const mongooose = require('mongoose');
const {Schema} = mongooose;
const blogSchema = new mongooose.Schema({
    // Your code goes here
 topic: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
      posted_at: {
        type: Date,
        default: Date.now,
      },
      posted_by: {
        type: String,
        required: true,
      },
  });
blogSchema.method("toJSON", function(){
    const {__v, _id, ...object}=this.toObject();
    object.id=_id;
    return object;
});
 

const Blog = mongooose.model('blogs', blogSchema);

module.exports = Blog;
