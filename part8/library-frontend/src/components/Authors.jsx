import {gql,useQuery,useMutation} from '@apollo/client'
import { ALL_AUTHORS } from './queries'
import { useState } from 'react'
import { UPDATE_AUTHOR } from './queries'



const Authors = (props) => {

  const [selectedAuthor,setSelectedAuthor] = useState('')
  const [year,setYear] = useState('')
  const [updateAuthor] = useMutation(UPDATE_AUTHOR,{
    refetchQueries: [{query: ALL_AUTHORS}]
  })

  const handleSubmit = (event) => {
    updateAuthor({
      variables: { name: selectedAuthor, setBornTo: parseInt(year) }
    })
    setSelectedAuthor('')
    setYear('')
    event.preventDefault()
  }



  const result = useQuery(ALL_AUTHORS)
  if (!props.show) {
    return null
  }
  
  if (result.loading) {
    return <div>loading...</div>
  }

  if(result.error){
    return <div>error {result.error.message}</div>
  }
  const authors = result.data.allAuthors


  return (
    <>
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <div>
      <h2>Set birthyear</h2>
          <form onSubmit={handleSubmit}>
            <select value={selectedAuthor} onChange={(event) => setSelectedAuthor(event.target.value)}>
              {authors.map((author) => (
                <option key={author.name} value={author.name}>
                  {author.name}
                </option>
              ))}
            </select>
            <input type="number" onChange={(event) => setYear(event.target.value)} value={year} />
            <button type="submit">update author</button>
          </form>
    </div>
          </>
  )
}

export default Authors
