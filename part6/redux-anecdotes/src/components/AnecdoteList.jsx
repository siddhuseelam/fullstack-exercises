import { useSelector,useDispatch } from "react-redux";
import { voteAnecdote } from "../../store";
import { setNotification,removeNotification } from "../../store";

const AnecdoteList = () => {
    const anecdotes = useSelector(state => state.anecdotes);
    
    const filter = useSelector(state => state.filter) ;
    const dispatch = useDispatch();

    const vote = (anecdote) => {
        console.log('vote',anecdote.id);
        dispatch(voteAnecdote(anecdote.id));
        dispatch(setNotification(anecdote.content))
        setTimeout(()=>{dispatch(removeNotification())},5000)
        
    }   


    const sortedAnecdotes = [...anecdotes].sort((a,b) => b.votes-a.votes)

    return (
        <div>
            
            {sortedAnecdotes.filter(anecdote => anecdote.content.toLowerCase().includes(filter.toLowerCase())).map(anecdote =>
                <div key={anecdote.id}>
                    <div>
                        {anecdote.content}
                    </div>
                    <div>
                        has {anecdote.votes}
                        <button onClick={() => vote(anecdote)}>vote</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AnecdoteList;