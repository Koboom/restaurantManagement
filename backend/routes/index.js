const router = require('express').Router();

router.get('/', (req, res) => {
    //pug ile index sayfasını render etme
    res.render("index")
     // direkt localhost:3000/ adresine gidilebilir.
    // res.send('Hello World!');
})

module.exports = router
