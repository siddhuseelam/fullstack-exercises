import { useSelector,useDispatch } from "react-redux";
import { voteAnecdote } from "../../store";

const AnecdoteList = () => {
    const anecdotes = useSelector(state => state.anecdotes);
    
    const filter = useSelector(state => state.filter) ;
    const dispatch = useDispatch();

    const vote = (id) => {
        console.log('vote', id);
        dispatch(voteAnecdote(id));
    }   

    return (
        <div>
            
            {anecdotes.filter(anecdote => anecdote.content.toLowerCase().includes(filter.toLowerCase())).map(anecdote =>
                <div key={anecdote.id}>
                    <div>
                        {anecdote.content}
                    </div>
                    <div>
                        has {anecdote.votes}
                        <button onClick={() => vote(anecdote.id)}>vote</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AnecdoteList;