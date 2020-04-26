const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const workItems = [];

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/todolistDB', {
  useNewUrlParser: true
});

const itemsSchema = new mongoose.Schema({
  name: String
});

const Item = mongoose.model('Item', itemsSchema);

const listSchema = new mongoose.Schema({
  name: String,
  items: [itemsSchema]
});

const List = mongoose.model('List', listSchema);

const item1 = new Item({
  name: "Welcome to your todolist!"
});
const item2 = new Item({
  name: "Hit + button to add a new entry."
});
const item3 = new Item({
  name: "Hit check button to delete an existing entry."
});

const defaultItems = [item1, item2, item3];

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static('public'));

app.get("/", function(req, res) {
  Item.find({}, function(err, foundItems) {
    if (foundItems.length === 0) {
      Item.insertMany(defaultItems, function(err) {
        if (err) {
          console.log(err);
        } else {
          console.log("Successfully saved default items into DB.");
        }
      });
      res.redirect("/");
    } else {
      res.render('lists', {
        listTitle: "Today",
        newItems: foundItems
      });
    }
  })
});

app.get('/:customerListName', function(req, res) {
  const customerListName = req.params.customerListName;
  List.findOne({
    name: customerListName
  }, function(err, result) {
    if (!err) {
      if (!result) {
        const list = new List({
          name: customerListName,
          items: defaultItems
        });
        list.save();
        res.redirect("/" + customerListName);
      } else {console.log(result);
        res.render("lists", {

          listTitle: result.name,
          newItems: result.items
        });
      }
    }
  });

});

app.post("/", function(req, res) {
  const itemName = req.body.newListEntry;
  const listName = req.body.list;

  const newItem = new Item({
    name: itemName
  });

  if (listName === "Today") {
    newItem.save();
    res.redirect("/");
  } else {
    List.findOne({
      name: listName
    }, function(err, foundList) {
      foundList.items.push(newItem);
      foundList.save();
      res.redirect("/" + listName);
    });
  }
});

app.post("/delete", function(req, res) {
  const checkedItemID = req.body.checkbox;
  const listName = req.body.listName;
console.log(listName);
console.log(checkedItemID);
    if (listName === "Today") {
  Item.findByIdAndRemove(checkedItemID, function(err) {
    if (!err)  {
      console.log("Successfully deleted item");
      res.redirect("/");
    }
  });
}else{
  List.findOneAndUpdate({name: listName},{ $pull:{items:{_id:checkedItemID}}},function(err,foundList){
    if(!err){
      res.redirect("/"+listName);
    }
  })
}
})


app.listen('3000', function() {
  console.log('server is running on port 3000');
});
