const Item = require('../models/itemModel');


const createItem = async (req, res) => {
    const item = new Item({
        name: req.body.name,
        description: req.body.description,
        category: req.body.categry,
        currentAmount: req.body.currentAmount,
        maxAmount: req.body.maxAmount
    });

    item
        .save()
        .then((item) => res.status(201).json(item))
        .catch((err) => res.status(400).json("Error: " + err));

}

const getItems = async (req, res) => {
    Item.find()
        .then((item) => res.json(item))
        .catch((err) => res.status(400).json("Error: " + err));
}

const getItem = async (req, res) => {
    Item.findbyId(req.params.id)
        .then((item) => res.json(item))
        .catch((err) => res.status(400).json("Error: ") +err); 
}

const updateItem = async (req, res) => {
    Item.findByIdAndUpdate(req.params.id, req.body)
        .then((item) => {
            res.status(200).json(item);
        })
        .catch((err) => res.status(400).json("Error: " + err));
}

const deleteItem = async (req, res) => {
    Item.findByIdAndDelete(req.params.id)
        .then(() => res.status(204).json())
        .catch((err) => res.status(400).json("Error: " + err));
}

module.exports = { createItem, getItems, getItem, updateItem, deleteItem };