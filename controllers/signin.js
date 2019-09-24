const handleSignin = (db, bcrypt) =>  (req, res) => {
    // bcrypt.compare(password, data[0].hash, (err, res) => {
    //     console.log('first guess', res);
    // });    
    const { email, password } = req.body;

    if(!email || !password) {
        return  res.status(400).json('incorrect form submission')
    }

    db('login').where('email', email)
        .returning(['email', 'hash'])
        .then(auth => {
            if(auth.length) {
                const isMatched = bcrypt.compareSync(password, auth[0].hash);
                if(isMatched) {
                    return db('users').where('email', email)
                        .then(user => {
                            res.json(user[0])
                        })
                        .catch(err => res.status(400).json('unable to get user'))
                } else {
                    res.status(400).json('Wrong Credentials');
                }
            } else {
                res.status(400).json('Wrong Credentials');
            }
        })
        .catch(err => res.json('error trying to signin'))
}

module.exports = {handleSignin}