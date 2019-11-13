
const express = require('express');
const db = require('./userDb.js')
const postDB = require('../posts/postDb.js')
const router = express.Router();

// TODO DONE
// * POST new user
router.post('/', validateUser, (req, res) => {
     const newUser = req.body
     db.insert(newUser)
     .then(user => {
          res.status(200).json(user)
     })
     .catch(error => {
          res.status(500).json({message: "New user failed to post"})
     })
});

// TODO DONE
// * POST new post according to user ID
router.post('/:id/posts', validatePost, (req, res) => {
     const id = req.params.id
     const newPost = {...req.body, user_id:id}

     db.getById(id)
     .then(user => {
          if(user){
               postDB.insert(newPost)
               .then(newPost => {
                    res.status(200).json(newPost)
               })
               .catch(error => res.status(500).json({message: "New post failed to post"}))
          } else {
               res.status(404).json({message: "User with id was not found"})
          }
     })
     .catch(error => {
          res.status(500).json({message: "New post failed to post"})
     })
});




router.get('/', (req, res) => {
    const query = req.query
    db.get(query)
    .then(users => {
        res.status(200).json(users)
    })
    .catch(error => {
        res.status(500).json({message: "Users could not be retrieved"})
    })
});



router.get('/:id', validateUserId, (req, res) => {    
    db.getById(req.params.id)
    .then(user => {
        res.status(200).json(user)
    })
    .catch(error => {
        res.status(500).json({message: "User could not be retrieved"})
    })
});



router.get('/:id/posts', validateUserId, (req, res) => {
    db.getUserPosts(req.params.id)
    .then(posts => {
        res.status(200).json(posts)
    })
    .catch(error => {
        res.status(500).json({message: "Posts from user could not be retrieved"})
    })
});



router.delete('/:id', validateUserId, (req, res) => {
    const id = req.params.id 
    db.remove(id)
    .then(user => {
        res.status(200).json(user)
    })
    .catch(error => {
        res.status(500).json({message: "User was unsuccessfully deleted"})
    })
});




router.put('/:id', validateUserId, (req, res) => {
    const id = req.params.id
    const updateInfo = req.body

    db.update(id, updateInfo)
    .then(user => {
        res.status(200).json(user)
    })
    .catch(error => {
        res.status(500).json({message: "User was unsuccessfully updated"})
    })
});









//custom middleware

function validateUserId(req, res, next) {
    const id = req.params.id
    db.getById(id)
    .then(user => {
        if(user){
            req.user = id;
            next();
        } else {
            res.status(404).json({message: "User ID does not exist"})
        }
    })
    .catch(error => {
        res.status(400).json({message: "Invalid user ID"})
    })
};


function validateUser(req, res, next) {
    const newUser = req.body

    if (newUser) {
        if (!newUser.name) {
            res.status(401).json({ message: "missing required name field" })
        } else {
            next();
        }
    } else {
        res.status(400).json({ message: "missing post data" })
    }
};

function validatePost(req, res, next) {
    const newPost = req.body

    if (newPost) {
        if (newPost.text) {
            next();
        } else {
            res.status(400).json({ message: "missing required text field" })
        }
    } else {
        res.status(400).json({ message: "missing post data" })
    }
};

module.exports = router;