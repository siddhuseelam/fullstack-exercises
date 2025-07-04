import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import Login from './components/Login'
import CreateBlog from './components/CreateBlog'
import Togglable from './components/Togglable'





const errorMessage = (message) => {
  const errorStyle = {
    color: 'red',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
  }
  return (
    <div style={errorStyle}>
      {message}
    </div>
  )
}

const successMessage = (message) => {
  const successStyle = {
    color: 'green',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
  }
  return (
    <div style={successStyle}>
      {message}
    </div>
  )
}




const App = () => {

  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [blogs, setBlogs] = useState([])

  useEffect(() => {
    blogService.getAll().then(blogs =>{
      setBlogs( blogs )
      console.log('Blogs fetched:', blogs)
    })
  }, [])

  const [user,setUser] = useState(null)


  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      console.log('Logged in user object:', user)  // Add this line
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])
  const handleLike = async (id) =>{
    try{
      const blogToLike = blogs.find(blog => blog.id === id)
      const updatedBlog = {
        title: blogToLike.title,
        author: blogToLike.author,
        url: blogToLike.url,
        likes: blogToLike.likes + 1,
        user: blogToLike.user ? blogToLike.user.id : null  // Send only the user ID, not the whole user object
      }
      const response = await blogService.update(id, updatedBlog)
      setBlogs(blogs.map(blog => blog.id !== id ? blog : response))

    }
    catch(exception){
      console.error('Error liking blog:', exception)
      setError('Failed to like the blog')
      setTimeout(() => {
        setError(null)
      }, 1000)
    }
  }

  const handleLogin = async (credentials) => {
    try {
      const response  = await blogService.login(credentials)
      if (response.token) {
        console.log('Login successful, full response:', response)
        console.log('User ID from response:', response._id)
        window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(response))
        setUser(response)
        blogService.setToken(response.token)
        setSuccess('sucessfully logged in ')
        setTimeout(() => {
        setSuccess(null)
      }, 1000)
      }
    } catch (error) {
      console.error('Login failed:', error)
      setError('Wrong credentials')
      setTimeout(() => {
        setError(null)
      }, 1000)
    }
  }

  const createBlog = async (blogObject) => {
    try{

      const response  = await blogService.create(blogObject)
      setBlogs(blogs.concat(response))
      console.log('Blog created:', response)
      
      setSuccess('blog created sucessfully')
      setTimeout(()=>{
        setSuccess(null)
      }, 1000
    )

    }
    catch(exception){
      console.error('Error creating blog:', exception)
      setError('Failed to create a blog')
      setTimeout(() => {
        setError(null)
      }, 1000)
    }
  }

  const handleRemove = async (id) => {
    try{

      await blogService.remove(id)
      setBlogs(blogs.filter(blog => blog.id !== id))
      setSuccess('Blog removed successfully')
      setTimeout(() => {
        setSuccess(null)
      }, 1000)


    }
    catch(exception){
      console.error('Error removing blog:', exception)
      setError('Failed to remove the blog')
      setTimeout(() => {
        setError(null)
      }, 1000)
    }
  }

  return (
    <>
    {error && errorMessage(error)}
    {success && successMessage(success)}
    
    {user ? <h1>Blogs</h1> : <h1>Please log in to see blogs</h1>}
    {!user && 
      <Login handleLogin={handleLogin} />}
    {user && <p>{user.name} logged in <button onClick={()=>{window.localStorage.removeItem('loggedBlogAppUser'); setUser(null); blogService.setToken(null);}}>Logout</button></p>}

    {user &&
    <>

    <h3>Create Blog</h3>
    <Togglable buttonLabel="new blog">
      <CreateBlog createBlog={createBlog} />
    </Togglable>
    <div>      {blogs.map(blog =>
<Blog
  key={blog.id}
  blog={blog}
  handleLike={handleLike}
  handleRemove={handleRemove}
  showRemoveButton={user && blog.user && blog.user._id === user._id}
/>
      )}

    </div>
      </>
    }
      </>
  )
}

export default App