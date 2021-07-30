const User = require('./User');

const Post = require('./Post');
// create associations
User.hasMany(Post, {
    foreignKey: 'user_id'
});

// reverse association - relationship of Post model to the User
Post.belongsTo(User, {
    foreignKey: 'user_id',
});

module.exports = { User, Post };