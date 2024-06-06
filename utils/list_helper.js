const dummy = (blogs) => {
    return 1;
}

const totalLikes = (blogs) => {
    return blogs.reduce((sum, blog) => sum + blog.likes, 0);
}

const favoriteBlog = (blogs) => {
    const maxLikesBlog = blogs.reduce((prev, current) => {
      return (prev.likes > current.likes) ? prev : current;
    });
  
    return {
      title: maxLikesBlog.title,
      author: maxLikesBlog.author,
      likes: maxLikesBlog.likes
    };
  }
  
  module.exports = {
    dummy,
    totalLikes,
    favoriteBlog
  }