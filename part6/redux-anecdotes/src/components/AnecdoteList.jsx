import { useSelector,useDispatch } from "react-redux";
import { setNotificationAction } from "../../store";
import { setNotification,removeNotification } from "../../store";
import { voteAnecdoteAction } from "../../store";

const AnecdoteList = () => {
    const anecdotes = useSelector(state => state.anecdotes);
    
    const filter = useSelector(state => state.filter) ;
    const dispatch = useDispatch();

    const vote = (anecdote) => {
        console.log('vote',anecdote.id);
        const newAnecdote = {
            ...anecdote,
            votes:anecdote.votes+1
        }
       dispatch(voteAnecdoteAction(newAnecdote));
       dispatch(setNotification(`you voted '${anecdote.content}'`,5))
        
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