const express = require('express');
const router = express.Router();

router.get('/test', 
    (request, response) => 
    response.json({ message: 'Posts route works' }));

module.exports = router;