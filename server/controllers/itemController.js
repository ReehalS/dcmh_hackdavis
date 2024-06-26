const Item = require('../models/itemModel');

//create item
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

//get all items
const getItems = async (req, res) => {
    Item.find()
        .then((item) => res.json(item))
        .catch((err) => res.status(400).json("Error: " + err));
}

//get single item
const getItem = async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }
        res.json(item);
    } catch (err) {
        res.status(400).json({ message: 'Error fetching item', error: err.message });
    }
};



//update item by Admin
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
    futureAmount = parseInt(currentAmount) + parseInt(claimedAmount)
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

//delete
const deleteItem = async (req, res) => {
    Item.findByIdAndDelete(req.params.id)
        .then(() => res.status(204).json())
        .catch((err) => res.status(400).json("Error: " + err));
}

//user claim item
const claimItem = async (req, res) => {
  const { claimedAmount } = req.body;

  if (claimedAmount <= 0) {
      return res.status(400).json({ error: 'Please enter a valid claim amount' });
  }

  try {
      const item = await Item.findById(req.params.id);

      if (!item) {
          return res.status(404).json({ error: 'Item not found' });
      }
      // console.log(item.claimedAmount)
      // console.log(claimedAmount)

      // Calculate future amount after claiming
      const futureAmount = parseInt(item.currentAmount) + parseInt(claimedAmount) + parseInt(item.claimedAmount);

      if (futureAmount > item.maxAmount) {
          return res.status(400).json({ error: 'Claimed amount exceeds maximum amount' });
      }

      // Update claimedAmount
      const newClaimedAmount = parseInt(item.claimedAmount) + parseInt(claimedAmount);
      //console.log(newClaimedAmount)

      // Update item
      const updatedItem = await Item.findByIdAndUpdate(req.params.id, { claimedAmount: newClaimedAmount }, { new: true });

      res.status(200).json(updatedItem);
  } catch (error) {
      res.status(400).json({ error: error.message });
  }
};

const recordItem = async (req, res) => {
    const { recievedAmount } = req.body;
  
    if (recievedAmount <= 0) {
        return res.status(400).json({ error: 'Please enter a valid amount recieved' });
    }
  
    try {
        const item = await Item.findById(req.params.id);
  
        if (!item) {
            return res.status(404).json({ error: 'Item not found' });
        }
        
        // Calculate future amount after claiming
        const newCurrentAmount = parseInt(item.currentAmount) + parseInt(recievedAmount);
        if(newCurrentAmount > item.maxAmount){
            return res.status(400).json({ error: 'Recieved amount exceeds maximum amount' });
        }
        newClaimedAmount = parseInt(item.claimedAmount) - parseInt(recievedAmount);
        if(newClaimedAmount < 0){
            newClaimedAmount=0;
        }
        //console.log(newCurrentAmount)
        //console.log(newClaimedAmount)
        
        const updatedItem = await Item.findByIdAndUpdate(req.params.id, { currentAmount: newCurrentAmount, claimedAmount: newClaimedAmount }, { new: true });
  
        res.status(200).json(updatedItem);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
  };
  


module.exports = { createItem, getItems, getItem, updateItem, deleteItem, claimItem, recordItem};