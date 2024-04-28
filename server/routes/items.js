const express= require('express')

const { createItem, getItems, getItem, updateItem, deleteItem , claimItem, recordItem} = require('../controllers/itemController')

const router = express.Router()

router.post('/', createItem); 

router.get('/', getItems);

router.get('/:id', getItem);

router.patch('/:id', updateItem);

router.delete('/id', deleteItem);

router.patch('/claim/:id', claimItem);

router.patch('/recieve/:id', recordItem);

module.exports = router;

