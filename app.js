const express = require('express');
const bodyParser = require('body-parser');
const day = require(__dirname + "/date.js");
const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static('public'));

const items = ["Buy food", "Cook food", "Eat food"];
const workItems = [];

app.get("/", function(req, res) {
  res.render('lists', {
    listTitle: day.getDate(),
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
