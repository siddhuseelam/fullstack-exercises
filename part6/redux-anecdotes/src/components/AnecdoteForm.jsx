
import { useDispatch } from "react-redux";
import { createAnecdote } from "../../store";
import anecdoteServices from "../../services/anecdotes"


const AnecdoteForm = () => {
    const dispatch = useDispatch();

    const handleSubmit = async(event) => {
        event.preventDefault();
        const content = event.target.content.value;
        const response = await anecdoteServices.save(content)
        dispatch(createAnecdote(response));
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