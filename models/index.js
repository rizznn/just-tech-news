// import all models
const User = require('./User');
const Post = require('./Post');
const Vote = require('./Vote');
const Comment = require('./Comment');

// create associations
User.hasMany(Post, {
    foreignKey: 'user_id'
});

// reverse association - relationship of Post model to the User
Post.belongsTo(User, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE'
});

// associate User and Post to one another sowhen we query:
// Post - we can see a total of how many votes a user creates
// User - we can see all the posts they've voted on
User.belongsToMany(Post, {
    through: Vote,
    as: 'voted_posts',
    foreignKey: 'user_id',
    onDelete: 'CASCADE'
});
  
Post.belongsToMany(User, {
    through: Vote,
    as: 'voted_posts',
    foreignKey: 'post_id',
    onDelete: 'CASCADE'
});

// we'll connect User to Vote directly
Vote.belongsTo(User, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE'
});

Vote.belongsTo(Post, {
    foreignKey: 'post_id',
    onDelete: 'CASCADE'
});

User.hasMany(Vote, {
    foreignKey: 'user_id'
});

Post.hasMany(Vote, {
    foreignKey: 'post_id'
});

// model associations for comment
Comment.belongsTo(User, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE'
});

Comment.belongsTo(Post, {
    foreignKey: 'post_id',
    onDelete: 'CASCADE'
});

User.hasMany(Comment, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE'
});

Post.hasMany(Comment, {
    foreignKey: 'post_id',
});

module.exports = { User, Post, Vote, Comment };