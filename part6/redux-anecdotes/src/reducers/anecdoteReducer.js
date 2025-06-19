const anecdotesAtStart = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]

const getId = () => (100000 * Math.random()).toFixed(0)

const asObject = (anecdote) => {
  return {
    content: anecdote,
    id: getId(),
    votes: 0
  }
}



export const voteActionCreator = (id) => {
  return {
    type: 'VOTE',
    payload: { id }
  }
}
const initialState = anecdotesAtStart.map(asObject)


export const createAnecdoteActionCreator = (content) => {
  return {
    type: 'CREATE',
    payload: { content }
  }
}

const reducer = (state = initialState, action) => {
  console.log('state now: ', state)
  console.log('action', action)

  if (action.type === 'VOTE') {
    const id = action.payload.id
    const anecdoteToVote = state.find(a => a.id === id)
    const votedAnecdote = {
      ...anecdoteToVote,
      votes: anecdoteToVote.votes + 1
    }
    return state.map(a => a.id === id ? votedAnecdote : a).sort((a, b) => b.votes - a.votes)
  }
  if (action.type === 'CREATE') {
    const content = action.payload.content
    return [...state, asObject(content)].sort((a, b) => b.votes - a.votes)
  }

  return state
}

export const filterReducer = (state = '', action) => {
  if (action.type === 'SET_FILTER') {
    return action.payload.filter
  }
  return state
}


export const setFilterActionCreator = (filter) => {
  return {
    type: 'SET_FILTER',
    payload: { filter }
  }
}

export default reducer