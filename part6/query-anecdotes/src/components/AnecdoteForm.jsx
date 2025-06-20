import {useQuery, useMutation,useQueryClient} from '@tanstack/react-query'
import requests from '../../requests'
import { useContext } from 'react'
import NotificationContext from '../NotificationContext'





const AnecdoteForm = () => {
  const [notification,notificationDispatch] = useContext(NotificationContext)

  const queryClient = useQueryClient()

  const newAnecdoteMutation = useMutation({
    mutationFn: requests.createAnecdote,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey:['anecdotes']})
    },

    onError: () => {
      notificationDispatch({type:'SET_NOTIFICATION',payload:'failed to create new anecdote'})
      setTimeout(()=>{
        notificationDispatch({type:'CLEAR_NOTIFICATION'})
      },5000)
},
   
  } )

  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    if(content.length > 5){
      newAnecdoteMutation.mutate({content,votes:0})

      notificationDispatch({type:'SET_NOTIFICATION',payload:`new anecdote created with content ${content}`})
      setTimeout(()=>{
        notificationDispatch({type:'CLEAR_NOTIFICATION'})
      },5000)
    }
    else{
      notificationDispatch({type:'SET_NOTIFICATION',payload:`content is too short length is less than 5`})
      setTimeout(()=>{
        notificationDispatch({type:'CLEAR_NOTIFICATION'})
      },5000)
    }


    event.target.anecdote.value = ''
    console.log('new anecdote')
}

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name='anecdote' />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
