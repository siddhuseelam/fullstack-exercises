
const dummy = dummy =>{
    return 1;
}


const totalLikes = blogs => {
    if (blogs.length === 0) {
        return 0;
    }
    if (blogs.length === 1) {
        return blogs[0].likes;
    }
    return blogs.reduce((sum, blog) => sum + blog.likes, 0);
}

const favoriteBlog = blogs => {
    if (blogs.length === 0) {
        return null;
    }
    return blogs.reduce((max, blog) => (blog.likes > max.likes ? blog : max), blogs[0]);
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog
}

