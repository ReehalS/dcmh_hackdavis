const express= require('express')

const { createItem, getItems, getItem, updateItem, deleteItem , claimItem} = require('../controllers/itemController')

const router = express.Router()

router.post('/', createItem); 

router.get('/', getItems);

router.get('/:id', getItem);

router.patch('/:id', updateItem);

router.delete('/id', deleteItem);

router.patch('/claim/:id', claimItem);

module.exports = router;

