import AnecdoteForm from './components/AnecdoteForm'
import AnecdoteList from './components/AnecdoteList'
import AnecdoteFilter from './components/AnecdoteFilter'
import Notification from './components/Notification'
import anecdoteService from '../services/anecdotes'
import { setAnecdotes } from '../store'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
const App = () => {
  const dispatch = useDispatch()
  useEffect(()=>{
      anecdoteService.getAll().then(anecdotes =>{
        dispatch(setAnecdotes(anecdotes))
      })
  })


  return (
    <div>
      <Notification/>
      <h2>Anecdotes</h2>
      <AnecdoteFilter/>
      <AnecdoteList />
      <AnecdoteForm />
    </div>
  )
}

export default App