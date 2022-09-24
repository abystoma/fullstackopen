const dummy = (blogs) => 1;
const totalLikes = (blogs) => {
  if (blogs.length === 0) {
    return 0;
  }
  return blogs.reduce((sum, b) => sum + b.likes, 0);
};
module.exports = {
  dummy,
  totalLikes,
};
