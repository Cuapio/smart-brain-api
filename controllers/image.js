const Clarifai = require('clarifai');

const app = new Clarifai.App({
    apiKey: '05b87fd9a1df446c9b5cef1396305545'
});

const handleApiCall = () => (req, res) => {
    app.models.predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
    .then(boxLocation => {
        res.json(boxLocation)
    })
    .catch(err => res.status(400).json('unable to work API'))
}
   
const handleImage = db => (req, res) => {
    const { id } = req.body;
    db('users').where({id})
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
        if(entries.length) {
            res.json(entries[0])
        } else {
            res.json('not found');
        }
    })
    .catch(err => {
        res.status(400).json('unable to get entries')
    })
}

module.exports = {
    handleImage,
    handleApiCall
}