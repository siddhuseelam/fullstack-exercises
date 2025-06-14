import axios from 'axios'

const baseUrl = 'http://localhost:3002/api'

const getAll = () => {
  const request = axios.get(`${baseUrl}/blogs`)
  return request.then(response => {
    console.log('Response data:', response.data)
    return response.data
  })
}




let token = null


const update = async (id, updatedBlog) =>{

  const config = {
    headers: { Authorization: token }
  }
  const response = await axios.put(`${baseUrl}/blogs/${id}`,updatedBlog, config)
  console.log('Update response:', response.data)
  return response.data

}

const setToken = (newToken) => {
  token = `Bearer ${newToken}`
  console.log('Token set:', token)
}

const login = async (credentials) => {
  const response = await axios.post(`${baseUrl}/login`, credentials)
  console.log('Login response:', response.data)
  return response.data
}


const create = async (blogObject) => {
  const config = {
    headers: { Authorization: token }
  }

  const response = await axios.post(`${baseUrl}/blogs`, blogObject, config)
  return response.data
}

const remove = async (id) => {
  const config = {
    headers: {Austhorization: token }
  }
  const response = await axios.delete(`${baseUrl}/blogs/${id}`, config)
  return response.data
}
export default { getAll, login, setToken, create, update, remove }