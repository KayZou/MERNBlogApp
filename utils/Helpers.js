const truncatePost = (post) => {
  // console.log("post", post);
  if (post.length > 80) {
    const truncatedPost = post.substring(0, 80) + "...";
    // console.log("truncatedPost", truncatedPost);
    return truncatedPost;
  } else {
    console.log("post not truncated");
    return post;
  }
};

module.exports = { truncatePost };
