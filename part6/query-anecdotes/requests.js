import axios from 'axios'

 const getAnecdotes =()=>{
   return  axios.get('http://localhost:3001/anecdotes').then(res => res.data)
}   


 const createAnecdote = (content) =>{
    return axios.post('http://localhost:3001/anecdotes',content).then(res => res.data)



}


const updateAnecdote = (anecdote ) =>{
    if(anecdote.content.length<5){
        return Promise.reject()
    }
    return axios.put(`http://localhost:3001/anecdotes/${anecdote.id}`,anecdote).then(res => res.data)
}


export default {getAnecdotes,createAnecdote,updateAnecdote}