
import { useDispatch } from "react-redux";
import { createAnecdote } from "../../store";
import anecdoteServices from "../../services/anecdotes"
import { createNewAnecdote } from "../../store";


const AnecdoteForm = () => {
    const dispatch = useDispatch();

    const handleSubmit = async(event) => {
        event.preventDefault();
        const content = event.target.content.value;
        dispatch(createNewAnecdote(content));
        event.target.content.value = '';
    }

    return (
        <>
        <h2>create new</h2>
        <form onSubmit={handleSubmit}>
            <div><input name='content' /></div>
            <button type='submit'>create</button>
        </form>
        </>
    )
}

export default AnecdoteForm;