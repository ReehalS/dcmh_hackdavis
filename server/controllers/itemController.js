const Item = require('../models/itemModel');


const createItem = async (req, res) => {
    const {title, description, category, currentAmount, maxAmount, claimedAmount} = req.body

    let emptyFields = []
  
    if(!title){
      emptyFields.push('Item Title')
    }
    if(!description){
      emptyFields.push('Description')
    }
    if(!category){
      emptyFields.push('Category')
    }
    if(!maxAmount){
        emptyFields.push('Maximum Amount')
    }
    
    if(emptyFields.length > 0){
      return res.status(400).json({error: `Please provide a value for the following fields : `, emptyFields})
    }
    try {
      const item = await Item.create({ title, description, category, currentAmount, maxAmount, claimedAmount })
      res.status(200).json(item)
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
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
    const { title, description, category, currentAmount, maxAmount, claimedAmount } = req.body;

    let emptyFields = [];

    if (!title) {
        emptyFields.push('Item Title');
    }
    if (!description) {
        emptyFields.push('Description');
    }
    if (!category) {
        emptyFields.push('Category');
    }
    if (!maxAmount) {
        emptyFields.push('Maximum Amount');
    }
    if (emptyFields.length > 0) {
        return res.status(400).json({ error: `Please provide a value for the following fields: `, emptyFields });
    }
    futureAmount = currentAmount + claimedAmount;
    if (maxAmount < futureAmount) {
        return res.status(400).json({ error: "Maximum Amount should be greater than or equal to Current Amount + Claimed Amount" });
    }

    try {
        const item = await Item.findByIdAndUpdate(req.params.id, { title, description, category, currentAmount, maxAmount, claimedAmount }, { new: true });
        res.status(200).json(item);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


const deleteItem = async (req, res) => {
    Item.findByIdAndDelete(req.params.id)
        .then(() => res.status(204).json())
        .catch((err) => res.status(400).json("Error: " + err));
}

module.exports = { createItem, getItems, getItem, updateItem, deleteItem };