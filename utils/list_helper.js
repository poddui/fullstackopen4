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

  const mostBlogs = (blogs) => {
    const blogCounts = {};
    blogs.forEach((blog) => {
      if (blog.author in blogCounts) {
        blogCounts[blog.author]++;
      } else {
        blogCounts[blog.author] = 1;
      }
    });
    let maxBlogsAuthor = '';
    let maxBlogsCount = 0;
    for (const author in blogCounts) {
      if (blogCounts[author] > maxBlogsCount) {
        maxBlogsAuthor = author;
        maxBlogsCount = blogCounts[author];
      }
    }
    return {
      author: maxBlogsAuthor,
      blogs: maxBlogsCount
    };
  }

  const mostLikes = (blogs) => {
    const likesByAuthor = {};
    blogs.forEach((blog) => {
      if (blog.author in likesByAuthor) {
        likesByAuthor[blog.author] += blog.likes;
      } else {
        likesByAuthor[blog.author] = blog.likes;
      }
    });
    let maxLikesAuthor = '';
    let maxLikesCount = 0;
    for (const author in likesByAuthor) {
      if (likesByAuthor[author] > maxLikesCount) {
        maxLikesAuthor = author;
        maxLikesCount = likesByAuthor[author];
      }
    }
    return {
      author: maxLikesAuthor,
      likes: maxLikesCount
    };
  }
  
  module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
  }