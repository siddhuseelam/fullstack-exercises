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
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])


  const handleLogin = async (credentials) => {
    try {
      const response  = await blogService.login(credentials)
      if (response.token) {
        console.log('Login successful:', response)
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
    <div>

      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}

    </div>
      </>
    }
      </>
  )
}

export default App