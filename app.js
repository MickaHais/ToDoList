const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const port = 3000;

mongoose.connect('mongodb://localhost:27017/todolistDB');

const itemSchema = {
    name: String
};

const Item = mongoose.model('Item', itemSchema);

app.set('view engine', 'ejs');
app.set('views', __dirname + '/view'); 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', async (req, res) => {
    try {
        const foundItems = await Item.find({});
        res.render('index', { listTitle: "Today", newListItems: foundItems });
    } catch (err) {
        console.error(err);
        res.status(500).send("An error occurred while fetching items.");
    }
});

app.post('/', async (req, res) => {
    const itemName = req.body.newItem;

    const item = new Item({
        name: itemName
    });

    try {
        const savedItem = await item.save();
        res.status(201).json(savedItem);
    } catch (err) {
        console.error(err);
        res.status(500).send("An error occurred while saving the item.");
    }
});


app.post('/delete', async (req, res) => {
    const checkedItemId = req.body.checkbox;
    console.log("Received delete request for ID:", checkedItemId);

    if (!mongoose.Types.ObjectId.isValid(checkedItemId)) {
        console.log("Invalid ID received:", checkedItemId);
        return res.status(400).send("Invalid ID");
    }

    try {
        await Item.findByIdAndDelete(checkedItemId);
        console.log("Successfully deleted checked item.");
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.status(500).send("An error occurred while deleting the item.");
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
