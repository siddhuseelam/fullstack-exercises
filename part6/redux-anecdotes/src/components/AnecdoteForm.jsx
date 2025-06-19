
import { useDispatch } from "react-redux";
import { createAnecdote } from "../../store";


const AnecdoteForm = () => {
    const dispatch = useDispatch();

    const handleSubmit = (event) => {
        event.preventDefault();
        const content = event.target.content.value;
        dispatch(createAnecdote(content));
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