import AnecdoteForm from './components/AnecdoteForm'
import AnecdoteList from './components/AnecdoteList'
import AnecdoteFilter from './components/AnecdoteFilter'
import Notification from './components/Notification'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { initialiseAnecdotes } from '../store'


const App = () => {
  const dispatch = useDispatch()
  useEffect(()=>{
      dispatch(initialiseAnecdotes())
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