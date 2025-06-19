import { createSlice } from "@reduxjs/toolkit"
import { configureStore } from "@reduxjs/toolkit"
import anecdoteServices from './services/anecdotes'


  const getId = () => (100000 * Math.random()).toFixed(0)

  const asObject = (anecdote) => {
    return {
      content: anecdote,
      id: getId(),
      votes: 0
    }
  }

const noteSlice = createSlice({
    name: 'anecdotes',
    initialState: []
    ,
    reducers:{
        createAnecdote(state,action){
          
             state.push(action.payload)
        
            
        },
        voteAnecdote(state,action){
            const id = action.payload
            
            const anecdote = state.find((a)=> a.id==id)
            if(anecdote){
                anecdote.votes+=1
            }
            
            
        },
        setAnecdotes(state,action){
            return action.payload
        }

    }
    
})

const notificationSlice = createSlice({
    name:'notification',
    initialState:'',
    reducers:{
        setNotification(state, action){
            return action.payload
        },
        removeNotification(state,action){
            return ''
        }
    }
})

const filterSlice = createSlice({
    name: 'filter',
    initialState: '',
    reducers:{
        setFilter(state,action){
            return action.payload
        }
    }

}
)


export const createNewAnecdote = (content) =>{
    return async dispatch => {
        const newAnecdote = await anecdoteServices.save(content)
        dispatch(createAnecdote(newAnecdote))
    }
}

export const  initialiseAnecdotes = () =>{
    return async dispatch =>{
        const anecdotes = await anecdoteServices.getAll()
        dispatch(setAnecdotes(anecdotes))
    }
    }
export const voteAnecdoteAction = (id) =>{
    return async dispatch =>{
       const response =  await anecdoteServices.update(id)
        dispatch(voteAnecdote(response.id))
    }
}

export const setNotificationAction = (message,timeout) =>{
    return async dispatch =>{
        dispatch(setNotification(message))
        setTimeout(()=>{
            dispatch(removeNotification())
        },timeout)
    }
}
    

export const {setNotification,removeNotification} = notificationSlice.actions
export const {createAnecdote, voteAnecdote,setAnecdotes} = noteSlice.actions
export const {setFilter} = filterSlice.actions
export default configureStore({
    reducer: {
        anecdotes: noteSlice.reducer,
        filter: filterSlice.reducer,
        notification:notificationSlice.reducer
    }
})