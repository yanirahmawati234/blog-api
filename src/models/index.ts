import User from './user.models';
import Post from './post.models';

User.hasMany(Post, {
  foreignKey: 'authorId',
  as: 'posts',
});

Post.belongsTo(User, {
  foreignKey: 'authorId',
  as: 'author',
});

export { User, Post };
