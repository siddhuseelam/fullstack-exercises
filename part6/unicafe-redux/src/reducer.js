const initialState = {
  good: 0,
  ok: 0,
  bad: 0
}

const counterReducer = (state = initialState, action) => {
  console.log(action)
  switch (action.type) {
    case 'GOOD':
      const newGood = state.good +1
      const newState = {...state, good: newGood}

      return newState
    case 'OK':
      return {...state, ok: state.ok + 1}
    case 'BAD':
      return {...state, bad: state.bad + 1}
    case 'ZERO':
      return {...state, good: 0, ok: 0, bad: 0}
    default: return state
  }
  
}

export default counterReducer
