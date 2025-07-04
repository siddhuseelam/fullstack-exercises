import {gql,useQuery} from '@apollo/client'
import { ALL_BOOKS } from './queries'




const Books = (props) => {
  if (!props.show) {
    return null
  }

  const result = useQuery(ALL_BOOKS)
  if (result.loading) {
    return <div>loading...</div>
  }

  if(result.error){
    return <div>error {result.error.message}</div>
  }

  const books = result.data.allBooks


  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Books
