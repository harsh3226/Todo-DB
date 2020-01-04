//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
mongoose.connect('mongodb://localhost:27017/todolistDB', {useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true } );

const itemsSchema = {
  name: String,
};



const Item = mongoose.model("Item", itemsSchema);

const item1= new Item({
  name: "cook food"
});

const item2= new Item({
  name:"Fee Deposit"
});
const listSchema= {
  name: String,
  items: [itemsSchema]
};
const List=mongoose.model("List",listSchema);


// Item.insertMany([item1, item2],function(err)
// {
//   if(err)
//   console.log(error);
//   else {
//     console.log("Success");
//   }
// })

app.get("/", function(req, res) {
Item.find({}, function(err, foundItems){
  if(foundItems.length==0)
  {
    Item.insertMany([item1, item2],function(err)
    {
      if(err)
      console.log(error);
      else {
        console.log("Success");
      }
    })

  }
  else {
    res.render("list", {listTitle: "Today", newListItems: foundItems});
  }
  //console.log(foundItems);



})
});


app.get("/:customname",function(req,res)
{
  const yedt= req.params.customname;
  List.findOne({name: yedt}, function(err, foundList){
    if(!err)
    {
      if(!foundList){
        //console.log("Does not Exist");
        const list=new List({
          name: yedt,
          items: [item1, item2 ]
        })


        list.save();
        res.redirect("/"+ yedt);
      }
      else {
        //console.log("Exist");
res.render("list", {listTitle: foundList.name ,newListItems:foundList.items });
      }
    }
  });

})

app.post("/", function(req, res){

  const itemName = req.body.newItem;
   const item5= new Item({
     name: itemName
   });

   item5.save();

  res.redirect("/");
});

app.post("/delete", function(req, res)
{
  const checkeditemid = req.body.checkbox  ;
  Item.findByIdAndRemove(checkeditemid,function(err)
{
  if(!err)
  console.log("Successfully deleted");
  res.redirect("/");
})
})

app.get("/work", function(req,res){
  res.render("list", {listTitle: "Work List", newListItems: workItems});
});

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
