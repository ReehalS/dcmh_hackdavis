const express= require('express')

const {} = require('../controllers/itemController')

const router = express.Router()

router.post('/', createItem); 

router.get('/', getItems);

router.get('/:id', getItem);

router.patch('/:id', updateItem);

router.delete('/id', deleteItem);

module.exports = router;

