import mongoose from 'mongoose';


const bookSchema = new mongoose.Schema({
  title: {type:String, required:true},
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'Author' },
  genre: {type:String,required:true},
  publicationYear: {type:Number},
  copiesAvailable: { type: Number, default: 1 },
  
  ISBN: {
    type: String,
    unique: false, 
    required:false 
  },
});
const Book = mongoose.model('Book', bookSchema);

export default Book;
