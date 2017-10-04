import Comment from '../models/Comment';

//
// const commentSchema = new mongoose.Schema({
//   idImdb: String,
//   idUser: String,
//   date: { type: Date, default: Date.now },
//   text: String,
//   userPhoto: String,
//   userFirstName: String,
//   userLastName: String,
// });

export const addComment = async (req, res, next) => {
  const { payload } = req.body;
  const idImdb = req.params;
  console.log('id', idImdb);
  console.log('payload', payload);
  return res.send({ error: 'ok' });
};
  // req.checkBody('text', 'Comments can\'t be more than 40 letters long').len({ max: 40 });
  // const validationObj = await req.getValidationResult();
  // const error = validationObj.array();
  // if (error.length) {
  //     return res.send({ error });
  //   }
  //   const comment = new Comment({
  //
  //   });
  // Comment.save((err) => {
  //   if (err) { return next(err);
  //     return res.send({ error: '', user });
  //       });
  //     });
  //     break;
  //   }
