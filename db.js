const mongoose = require('mongoose');


// mongoose.connect('mongodb://haydiiusr:Hyd1105pwd@15.184.202.217:27017/haydiidb', {
//   useNewUrlParser: true,
//   useFindAndModify: false,
//   useUnifiedTopology: true
// });


mongoose.connect('mongodb://localhost:27017/haydiidb', {
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true
});