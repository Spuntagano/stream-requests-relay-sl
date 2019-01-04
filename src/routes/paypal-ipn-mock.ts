var express = require('express');

var router = express.Router();

router.post('/', async (req, res) => {
    res.status(200).send(req.query.message);
});

module.exports = router;
