// packages and models that we'll need to create the Express.js API endpoints
const router = require('express').Router();
const { Post, User, Vote } = require('../../models');
// connection
const sequelize = require('../../config/connection');


// create a route that will retrieve all posts in the database
// get all users
// The created_at column is auto-generated at the time a post is created with the current date and time
router.get('/', (req, res) => {
    console.log('======================');
    Post.findAll({
        // Query configuration
        // configure the findAll method by customizing the attributes property
        // update the `.findAll()` method's attributes to look like this
        attributes: [
          'id',
          'post_url',
          'title',
          'created_at',
          [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
        ],
        // display the most recently added posts first.
        order: [['created_at', 'DESC']], 
        // JOIN to the user
        include: [
            {
                model: User,
                attributes: ['username']
            }
       ]
    })
    .then(dbPostData => res.json(dbPostData))
    .catch(err => {
    console.log(err);
    res.status(500).json(err);
    });
});

// get-one query that will used a request parameter
router.get('/:id', (req, res) => {
    Post.findOne({
      where: {
        id: req.params.id
      },
      // update the `.findAll()` method's attributes to look like this
      attributes: [
        'id',
        'post_url',
        'title',
        'created_at',
        [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
      ],
      include: [
        {
          model: User,
          attributes: ['username']
        }
      ]
    })
    .then(dbPostData => {
        if (!dbPostData) {
            res.status(404).json({ message: 'No post found with this id' });
            return;
        }
        res.json(dbPostData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});  

// create a post
router.post('/', (req, res) => {
    // expects {title: 'Taskmaster goes public!', post_url: 'https://taskmaster.com/press', user_id: 1}
    Post.create({
      title: req.body.title,
      post_url: req.body.post_url,
      user_id: req.body.user_id
    })
      .then(dbPostData => res.json(dbPostData))
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
});

// PUT /api/posts/upvote
router.put('/upvote', (req, res) => {
  // custom static method created in models/Post.js
  Post.upvote(req.body, { Vote })
    .then(updatedPostData => res.json(updatedPostData))
    .catch(err => {
      console.log(err);
      res.status(400).json(err);
    });
});


// Because we'll be updating an existing entry, the idea is to first retrieve the post instance by id, then alter the value of the title on this instance of a post
router.put('/:id', (req, res) => {
    Post.update(
      {
        title: req.body.title
      },
      {
        where: {
          id: req.params.id
        }
      }
    )
      .then(dbPostData => {
        if (!dbPostData) {
          res.status(404).json({ message: 'No post found with this id' });
          return;
        }
        res.json(dbPostData);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
});

// to delete an entry
router.delete('/:id', (req, res) => {
    Post.destroy({
      where: {
        id: req.params.id
      }
    })
      .then(dbPostData => {
        if (!dbPostData) {
          res.status(404).json({ message: 'No post found with this id' });
          return;
        }
        res.json(dbPostData);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
});

module.exports = router;