const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static('public'));

let items = ["Buy food", "Cook food", "Eat food"];
let workItems = [];
app.get("/", function(req, res) {

  let options = {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  };

  let day = new Date().toLocaleDateString("en-US", options);

  res.render('lists', {
    listTitle: day,
    newItems: items
  });

});

app.get('/work', function(req, res) {
  res.render('lists', {
    listTitle: 'Work',
    newItems: workItems
  });
})

app.post("/", function(req, res) {
  if (req.body.list === 'Work') {
    workItems.push(req.body.newListEntry);
    res.redirect("/work");
  } else {
    items.push(req.body.newListEntry);
    res.redirect("/");
  }


});

app.listen('3000', function() {
  console.log('server is running on port 3000');
});
