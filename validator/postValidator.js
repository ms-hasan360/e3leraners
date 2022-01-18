const { body } = require('express-validator')
const cheerio = require('cheerio')



module.exports = [
    body('title')
        .not().isEmpty().withMessage('Ttile can not be Empty')
        .isLength({min: 32, max: 100 }).withMessage('Title can not be less than 32 chars and more than 100 chars. :)')
        .trim()
    ,
    body('body')
        .not().isEmpty().withMessage('Body can not be Empty. :)')
        .custom(value => {
            let node = cheerio.load(value)
            let text = node.text()

            if (text.length > 10000) {
                throw new Error('Body can not be more than 5000 chars. :)')
            }else if(text.length < 120){
                throw new Error('Body can not be less than 120 chars. :)')
            }
            return true
        }),
    body('tags')
        .not().isEmpty().withMessage('Tags can not be Empty')
        .trim()
]