import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import {useQuery, useMutation,useQueryClient} from '@tanstack/react-query'
import requests from '../requests'
import NotificationContext from './NotificationContext'
import { useReducer } from 'react'

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'SET_NOTIFICATION':
      return action.payload
    case 'CLEAR_NOTIFICATION':
      return ''
    default:
      return state
  }
}


const App = () => {


  
  const [notification,notificationDispatch] = useReducer(notificationReducer,'')

  const queryClient = useQueryClient()

   const votingMutation = useMutation({
      mutationFn: requests.updateAnecdote,
      onSuccess: () => {
        queryClient.invalidateQueries({queryKey:['anecdotes']})
      }
    })

  const handleVote = (anecdote) => {
   
    votingMutation.mutate({...anecdote,votes:anecdote.votes+1})
    notificationDispatch({type:'SET_NOTIFICATION',payload:`you voted '${anecdote.content}'`})
    setTimeout(()=>{
      notificationDispatch({type:'CLEAR_NOTIFICATION'})
    },5000)
    console.log('vote')
  }


  const result = useQuery({
    queryKey: ['anecdotes'],
    queryFn: requests.getAnecdotes,
    retry: false,
  })

  if (result.isLoading) {
    return <div>loading...</div>
  }

  if (result.isError) {
    return <div>anecdote service not available due to problems in server</div>
  }


  const anecdotes = result.data






  return (

    
    <NotificationContext.Provider value={[notification, notificationDispatch]} >
    <div>
      <h3>Anecdote app</h3>

      <Notification />
      <AnecdoteForm />

      {anecdotes.map(anecdote => <div key={anecdote.id}>
        <div>
          {anecdote.content}
        </div>
        <div>
          has {anecdote.votes}
          <button onClick={() => handleVote(anecdote)}>vote</button>
        </div>
      </div>
      )}
    </div>
    </NotificationContext.Provider>


  )
}

export default App
