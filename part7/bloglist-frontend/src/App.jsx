import { useState, useEffect, useReducer } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import Blog from './components/Blog';
import Login from './components/Login';
import NotificationContext from './NotificationContext';
import blogService from './services/blogs';

const BlogPage = ({ blogs, handleLike, handleRemove }) => {
  const { id } = useParams();
  const blog = blogs?.find(blog => blog.id === id);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/blogs/${id}/comments`);
        setComments(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching comments:', error);
        setError('Failed to load comments');
        setLoading(false);
      }
    };
    fetchComments();
  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) {
      setError('Comment cannot be empty');
      return;
    }
    try {
      const response = await axios.post(`/api/blogs/${id}/comments`, { comment: newComment });
      setComments([...comments, response.data]);
      setNewComment('');
      setError(null);
    } catch (error) {
      console.error('Error posting comment:', error);
      setError('Failed to post comment');
    }
  };

  if (!blogs) return <div className="d-flex justify-content-center align-items-center min-vh-100">Loading...</div>;
  if (!blog) return <div className="d-flex justify-content-center align-items-center min-vh-100 text-danger">Blog not found</div>;

  return (
    <div className="container my-5">
      <div className="card shadow">
        <div className="card-body">
          <h2 className="card-title mb-4">{blog.title}</h2>
          <a href={blog.url} target="_blank" rel="noopener noreferrer" className="card-link mb-3 d-block">{blog.url}</a>
          <p className="card-text"><strong>Author:</strong> {blog.author}</p>
          <p className="card-text"><strong>Likes:</strong> {blog.likes || 0}</p>
          <h3 className="mt-4">Comments</h3>
          {loading && <div>Loading comments...</div>}
          {error && <div className="alert alert-danger">{error}</div>}
          {comments.length === 0 && !loading && !error && <div className="text-muted">No comments yet</div>}
          <ul className="list-group mb-4">
            {comments.map(comment => (
              <li key={comment.id} className="list-group-item">
                <p>{comment.content}</p>
                <small className="text-muted">Posted on {new Date(comment.createdAt).toLocaleDateString()}</small>
              </li>
            ))}
          </ul>
          <form onSubmit={handleCommentSubmit}>
            <div className="mb-3">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="form-control"
                rows="4"
              />
            </div>
            <button type="submit" className="btn btn-primary">Post Comment</button>
          </form>
        </div>
      </div>
    </div>
  );
};

const UserDetails = ({ users }) => {
  const { id } = useParams();
  const user = users?.find(user => user.id === id);

  if (!users) return <div className="d-flex justify-content-center align-items-center min-vh-100">Loading...</div>;
  if (!user) return <div className="d-flex justify-content-center align-items-center min-vh-100 text-danger">User not found</div>;

  return (
    <div className="container my-5">
      <div className="card shadow">
        <div className="card-body">
          <h2 className="card-title mb-4">{user.name}</h2>
          {user.blogs.length > 0 && (
            <>
              <h3 className="mt-4">Added Blogs</h3>
              <ul className="list-group">
                {user.blogs.map(blog => (
                  <li key={blog.id} className="list-group-item">{blog.title}</li>
                ))}
              </ul>
            </>
          )}
          {user.blogs.length === 0 && <p className="text-muted">No blogs added yet.</p>}
        </div>
      </div>
    </div>
  );
};

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'SET_NOTIFICATION':
      return { message: action.payload.message, type: action.payload.type };
    case 'CLEAR':
      return { message: null, type: null };
    default:
      return state;
  }
};

const Notification = ({ message, type }) => {
  if (!message) return null;
  return (
    <div className={`alert alert-${type === 'success' ? 'success' : 'danger'} d-flex align-items-center`} role="alert">
      <div>{message}</div>
    </div>
  );
};

const App = () => {
  const result = useQuery({
    queryKey: ['blogs'],
    queryFn: blogService.getAll,
  });

  const [notification, dispatchNotification] = useReducer(notificationReducer, { message: null, type: null });

  const loginReducer = (state, action) => {
    switch (action.type) {
      case 'LOGIN':
        return action.payload;
      case 'LOGOUT':
        return null;
      default:
        return state;
    }
  };

  const [user, userStateDispatch] = useReducer(loginReducer, null);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      userStateDispatch({ type: 'LOGIN', payload: user });
      blogService.setToken(user.token);
    }
  }, []);

  const handleLike = async (id) => {
    try {
      const blogToLike = result.data.find(blog => blog.id === id);
      const updatedBlog = {
        title: blogToLike.title,
        author: blogToLike.author,
        url: blogToLike.url,
        likes: blogToLike.likes + 1,
        user: blogToLike.user ? blogToLike.user.id : null,
      };
      const response = await blogService.update(id, updatedBlog);
      dispatchNotification({ type: 'SET_NOTIFICATION', payload: { message: 'Blog liked successfully', type: 'success' } });
      setTimeout(() => dispatchNotification({ type: 'CLEAR' }), 1000);
    } catch (exception) {
      console.error('Error liking blog:', exception);
      dispatchNotification({ type: 'SET_NOTIFICATION', payload: { message: 'Failed to like the blog', type: 'error' } });
      setTimeout(() => dispatchNotification({ type: 'CLEAR' }), 1000);
    }
  };

  const handleLogin = async (credentials) => {
    try {
      const response = await blogService.login(credentials);
      if (response.token) {
        window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(response));
        userStateDispatch({ type: 'LOGIN', payload: response });
        blogService.setToken(response.token);
        dispatchNotification({ type: 'SET_NOTIFICATION', payload: { message: 'Successfully logged in', type: 'success' } });
        setTimeout(() => dispatchNotification({ type: 'CLEAR' }), 1000);
      }
    } catch (error) {
      console.error('Login failed:', error);
      dispatchNotification({ type: 'SET_NOTIFICATION', payload: { message: 'Wrong credentials', type: 'error' } });
      setTimeout(() => dispatchNotification({ type: 'CLEAR' }), 1000);
    }
  };

  const queryClient = useQueryClient();

  const blogMutation = useMutation({
    mutationFn: blogService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      dispatchNotification({ type: 'SET_NOTIFICATION', payload: { message: 'Blog created successfully', type: 'success' } });
      setTimeout(() => dispatchNotification({ type: 'CLEAR' }), 1000);
    },
    onError: (error) => {
      console.error('Error creating blog:', error);
      dispatchNotification({ type: 'SET_NOTIFICATION', payload: { message: 'Failed to create a blog', type: 'error' } });
      setTimeout(() => dispatchNotification({ type: 'CLEAR' }), 1000);
    },
  });

  const createBlog = async (blogObject) => {
    blogMutation.mutate(blogObject);
  };

  const deleteMutation = useMutation({
    mutationFn: blogService.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      dispatchNotification({ type: 'SET_NOTIFICATION', payload: { message: 'Blog removed successfully', type: 'success' } });
      setTimeout(() => dispatchNotification({ type: 'CLEAR' }), 1000);
    },
    onError: (error) => {
      dispatchNotification({ type: 'SET_NOTIFICATION', payload: { message: 'Failed to remove the blog', type: 'error' } });
      setTimeout(() => dispatchNotification({ type: 'CLEAR' }), 1000);
    },
  });

  const handleRemove = (id) => {
    if (window.confirm('Are you sure you want to remove this blog?')) {
      deleteMutation.mutate(id);
    }
  };

  const allUsersReducer = (state, action) => {
    switch (action.type) {
      case 'SET_USERS':
        return action.payload;
      default:
        return state;
    }
  };

  const [allusers, allusersStateDispatch] = useReducer(allUsersReducer, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await blogService.getUserDetails();
        allusersStateDispatch({ type: 'SET_USERS', payload: response });
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, []);

  return (
    <Router>
      <div className="min-vh-100 bg-light">
        <NotificationContext.Provider value={{ notification, dispatchNotification }}>
          <header className="bg-white shadow-sm">
            <div className="container py-4">
              {user ? (
                <h1 className="h3 fw-bold">Blogs</h1>
              ) : (
                <h1 className="h3 fw-bold">Please log in to manage blogs</h1>
              )}
              {!user && (
                <div className="mt-4">
                  <Login handleLogin={handleLogin} />
                </div>
              )}
              {user && (
                <div className="d-flex justify-content-between align-items-center mt-4">
                  <p className="mb-0">
                    <span className="fw-medium">{user.name}</span> logged in
                  </p>
                  <button
                    onClick={() => {
                      window.localStorage.removeItem('loggedBlogAppUser');
                      userStateDispatch({ type: 'LOGOUT' });
                      blogService.setToken(null);
                    }}
                    className="btn btn-danger"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </header>

          <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
            <div className="container">
              <div className="collapse navbar-collapse">
                <ul className="navbar-nav">
                  <li className="nav-item">
                    <Link className="nav-link" to="/">Blogs</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/users">Users</Link>
                  </li>
                </ul>
              </div>
            </div>
          </nav>

          <main className="container py-5">
            <Routes>
              <Route
                path="/"
                element={
                  <div>
                    <Notification message={notification.message} type={notification.type} />
                    {result.isLoading && (
                      <div className="d-flex justify-content-center align-items-center py-5">
                        <div className="spinner-border text-primary" role="status"></div>
                        <span className="ms-3">Loading blogs...</span>
                      </div>
                    )}
                    {result.isError && (
                      <div className="alert alert-danger">
                        Error fetching blogs: {result.error.message}
                      </div>
                    )}
                    {result.isSuccess && (
                      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                        {result.data.map(blog => (
                          <div key={blog.id} className="col">
                            <div className="card h-100 shadow-sm">
                              <Blog blog={blog} />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                }
              />
              <Route
                path="/users"
                element={
                  <div className="card shadow">
                    <div className="card-header bg-light">
                      <h1 className="h4 mb-0">Users</h1>
                    </div>
                    <div className="card-body p-0">
                      <div className="table-responsive">
                        <table className="table table-hover mb-0">
                          <thead>
                            <tr>
                              <th scope="col" className="px-4 py-3">Name</th>
                              <th scope="col" className="px-4 py-3">Blogs Created</th>
                            </tr>
                          </thead>
                          <tbody>
                            {allusers.map(user => (
                              <tr key={user.id}>
                                <td className="px-4 py-3">
                                  <Link to={`/users/${user.id}`} className="text-primary">{user.name}</Link>
                                </td>
                                <td className="px-4 py-3">
                                  <span className="badge bg-primary">{user.blogs.length}</span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                }
              />
              <Route path="/users/:id" element={<UserDetails users={allusers} />} />
              <Route path="/blogs/:id" element={<BlogPage blogs={result.data} handleLike={handleLike} handleRemove={handleRemove} />} />
            </Routes>
          </main>
        </NotificationContext.Provider>
      </div>
    </Router>
  );
};

export default App;