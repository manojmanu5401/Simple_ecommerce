// require all necessary libs

const express=require('express');
const bodyparser=require('body-parser');
const mongoose = require('mongoose');


// run express
const app=express();
mongoose.connect('mongodb+srv://admin_1:admin123@cluster0.rotkp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority/products',{useNewUrlParser: true,useUnifiedTopology: true });
app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static('public'))
app.set("view engine",'ejs');

const item_schema=new mongoose.Schema({
    sku: String,
    itemname: String,
    price: Number,
    select: String,
    size: Number,
    weight: Number,
    height: Number,
    width:Number,
    length:Number,
    check: Boolean
});

const Item = mongoose.model("item", item_schema);







app.get('/', function(req,res){
    
    Item.find(function(err,data){
        if(err){
            console.log(err);
        }
        else{
            // console.log(data.length);
            // console.log(data);
            // console.log(data[0]['_id']);
            if(data.length==0){
                res.render('products',{data:data})
            }
            else{
                res.render("products",{data:data});
            }
        }
    });
})
app.post('/',function(req,res){
    var check=JSON.parse(JSON.stringify(req.body));
    var ids=Object.keys(check);
    console.log(Object.keys(check));
    if(ids.length==0){
        res.redirect('/');
    }
    else{
        ids.forEach(function(id){
            console.log(id)
            Item.deleteOne({_id:id}, function(err){
                if(err){
                    console.log(err)
                }
                else{
                    console.log("deleted")
                }
            });
        })
        res.redirect('/');
    }
    
});
app.get("/add",function(req,res){
    res.render("add_products");
})
app.post("/add",function(req,res){
    data=req.body;
    // console.log(JSON.parse(JSON.stringify(data)));
    // console.log(req.body['sku']);
    // console.log(Object.keys(JSON.parse(JSON.stringify(data))))
    const item= new Item(
        {
            sku: data['sku'],
            itemname: data['item_name'],
            price: data['price'],
            select: data['select'],
            size: data['size'],
            weight: data['weight'],
            height: data['height'],
            width: data['width'],
            length: data['length'],
        }
    );
    item.save();
    res.redirect("/");
})

app.listen(process.env.PORT||3000);