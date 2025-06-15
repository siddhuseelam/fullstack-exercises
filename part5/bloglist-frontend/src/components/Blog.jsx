import Togglable from "./Togglable"

import {useState} from 'react'

const Blog = ({ blog, handleLike, handleRemove, showRemoveButton }) => {
  const blogStyle = {
    padding: 10,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const [visible, setVisible] = useState(false)
  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }
    
  const toggleVisibility = () => {
    setVisible(!visible)
  }

  return(
    <div style={blogStyle} className="blog">
      <div className="blog-title-author">
        {blog.title} {blog.author}
        <button onClick={toggleVisibility}>{visible ? 'hide' : 'view'}</button>
      </div> 
      <div className="blog-details" data-testid="blog-details" style={showWhenVisible}>
        <p className="blog-url">{blog.url}</p>
        <p className="blog-user">added by {blog.user ? blog.user.name : 'unknown'}</p>
        <p className="blog-likes">{blog.likes} likes</p>
        <button onClick={() => handleLike(blog.id)}>like</button>
        {showRemoveButton && (
          <button onClick={() => handleRemove(blog.id)}>remove</button>
        )}
      </div>
    </div>
  )
}


export default Blog

