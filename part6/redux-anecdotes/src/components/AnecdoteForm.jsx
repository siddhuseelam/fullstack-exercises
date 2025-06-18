
import { useDispatch } from "react-redux";
import { createAnecdoteActionCreator } from "../reducers/anecdoteReducer";


const AnecdoteForm = () => {
    const dispatch = useDispatch();

    const handleSubmit = (event) => {
        event.preventDefault();
        const content = event.target.content.value;
        dispatch(createAnecdoteActionCreator(content));
    }

    return (
        <form onSubmit={handleSubmit}>
            <div><input name='content' /></div>
            <button type='submit'>create</button>
        </form>
    )
}

export default AnecdoteForm;