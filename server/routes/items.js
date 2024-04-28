const express= require('express')

const {createItem, getItem, getItems, updateItem, deleteItem} = require('../controllers/itemController')

const router = express.Router()

router.post('/', createItem); 

router.get('/', getItems);

router.get('/:id', getItem);

router.patch('/:id', updateItem);

router.delete('/id', deleteItem);

module.exports = router;

