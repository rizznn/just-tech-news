// packages and models that we'll need to create the Express.js API endpoints
const router = require('express').Router();
const { Post, User } = require('../../models');

// create a route that will retrieve all posts in the database
// get all users
// The created_at column is auto-generated at the time a post is created with the current date and time
router.get('/', (req, res) => {
    console.log('======================');
    Post.findAll({
      // Query configuration
      // configure the findAll method by customizing the attributes property
      attributes: ['id', 'post_url', 'title', 'created_at'],
      // JOIN to the user
      include: [
        {
            model: User,
            attributes: ['username']
        }
        ]
    })
  
});