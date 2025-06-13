import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import Login from './components/Login'
const App = () => {
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
      }
    } catch (error) {
      console.error('Login failed:', error)
    }
  }

  return (
    <>

    
    {user ? <h1>Blogs</h1> : <h1>Please log in to see blogs</h1>}
    {!user && 
      <Login handleLogin={handleLogin} />}
    {user && <p>{user.name} logged in <button onClick={()=>{window.localStorage.removeItem('loggedBlogAppUser'); setUser(null); blogService.setToken(null);}}>Logout</button></p>}

    {user &&
    <div>
      
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}

    </div>
    }
      </>
  )
}

export default App