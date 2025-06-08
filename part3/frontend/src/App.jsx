import { useEffect, useState } from 'react'


import personServices from './services/persons'
















const Filter = ({ findNumber }) => {
  return (
    <div>
      <h3>search</h3>
      <input type="text" onChange={findNumber} />
    </div>
  )
}

const AddNumber = ({ addNumber, newName, changeNewName, newNumber, changeNewNumber }) => {
  return (
    <div>
      <h3>add new Number</h3>
      <form onSubmit={addNumber}>
        <div>
          name: <input onChange={changeNewName} value={newName} />
          <br />
          <br />
          number: <input onChange={changeNewNumber} value={newNumber} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    </div>
  )
}


const PersonsList = ({ filteredPersons }) => {
  return (
    <div>
      <h2>Numbers</h2>
      {filteredPersons.map((person, i) => (
        <p key={i}>{person.name} {person.number}</p>
      ))}
    </div>
  )
}









const ErrorMessage = ({message})=>{
  if (!message) {
    return null;
  }
  return (
    <div style={{
      color: '#fff',
      background: '#e53935',
      border: '1.5px solid #b71c1c',
      borderRadius: '8px',
      padding: '1em 1.5em',
      margin: '1em 0',
      fontWeight: 500,
      fontSize: '1.1em',
      boxShadow: '0 2px 8px rgba(229,57,53,0.08)',
      textAlign: 'center',
      letterSpacing: '0.5px', 
      maxWidth: '420px',
      marginLeft: 'auto',
      marginRight: 'auto'
    }}>
      {message}
    </div>
  );
}

const SuccessMessage = ({message})=>{
  if (!message) {
    return null;
  }
  return (
    <div style={{
      color: '#fff',
      background: '#43a047',
      border: '1.5px solid #1b5e20',
      borderRadius: '8px',
      padding: '1em 1.5em',
      margin: '1em 0',
      fontWeight: 500,
      fontSize: '1.1em',
      boxShadow: '0 2px 8px rgba(67,160,71,0.08)',
      textAlign: 'center',
      letterSpacing: '0.5px',
      maxWidth: '420px',
      marginLeft: 'auto',
      marginRight: 'auto'
    }}>
      {message}
    </div>
  );
}


const App = () => {

  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [persons, setPersons] = useState([]) 


  useEffect(()=>{
    console.log('effect');
    
    personServices.getAll().then(initialData => setPersons(initialData) )
  },[])


  const [newName, setNewName] = useState('')
  const addNumber = (event)=>{
    event.preventDefault();
    const newContactObject = {
      name:newName.trim(), 
      number:newNumber.trim()
    };
   
    if (newName.trim() === '' || newNumber.trim() === '') {
      setErrorMessage('Name or number cannot be empty');
      setTimeout(() => setErrorMessage(null), 3000);
      return;
    }
    const existingPerson = persons.find(person => person.name === newName.trim());
    if (existingPerson) {
      const confirmUpdate = window.confirm(
      `${newName.trim()} is already added to phonebook, replace the old number with a new one?`
      );
      if (confirmUpdate) {
      const id = existingPerson.id;
      personServices
        .update(id, newContactObject)
        .then(returnedContact =>{
          setPersons(persons.map(person => person.id === id ? returnedContact : person))
          setSuccessMessage(`Updated ${returnedContact.name}'s number successfully!`);
          setTimeout(() => setSuccessMessage(null), 3000);
        })
        .catch(() => {
          setErrorMessage(`Failed to update ${newName.trim()}. Contact may have been removed from server.`);
          setTimeout(() => setErrorMessage(null), 3000);
        });
      }
      return;
    }
    
    personServices 
      .create(newContactObject)
      .then(responseObject => {
         setPersons(persons.concat(responseObject))
         setNewNumber('')
         setNewName('')
         setSuccessMessage(`Added ${newContactObject.name}`);
         setTimeout(() => setSuccessMessage(null), 3000);
        })
      .catch(() => {
        setErrorMessage('Failed to add contact.');
        setTimeout(() => setErrorMessage(null), 3000);
      });
  }
  const changeNewName = (event)=>{
    setNewName(event.target.value)
    
  }
  const [newNumber, setNewNumber] = useState('')

  const changeNewNumber = (event)=>{
    setNewNumber(event.target.value)
  }

  const [filteredPersons, setfilteredPersons] = useState(persons);
  const findNumber = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    const filteredPersons = persons.filter(person =>
      person.name.toLowerCase().includes(searchTerm)
    );
    setfilteredPersons(filteredPersons);
  };

  const deleteContactOf = (id) => {
    const conformation = window.confirm(`Are you sure you want to delete this contact?`);
    if (!conformation) {
      return;
    }
    personServices
      .deletePerson(id)
      .then(() => {
        setPersons(persons.filter(person => person.id !== id));
        setfilteredPersons(filteredPersons.filter(person => person.id !== id));
        setSuccessMessage('Contact deleted successfully.');
        setTimeout(() => setSuccessMessage(null), 3000);
      })
      .catch(() => {
        setErrorMessage('The contact was already deleted from the server');
        setTimeout(() => setErrorMessage(null), 3000);
      });
  }




  return (
    <div>

      <ErrorMessage message={errorMessage} />
      <SuccessMessage message={successMessage} />
      <h2>Phonebook</h2>

      <Filter findNumber={findNumber} />


      <AddNumber 
        addNumber={addNumber} 
        newName={newName} 
        changeNewName={changeNewName} 
        newNumber={newNumber} 
        changeNewNumber={changeNewNumber}
      />
      <hr />
      
      
      
      <PersonsList filteredPersons={filteredPersons} />
      <h3>All Persons</h3>
      
        {persons.map((person, i) => (
          <p key={i}>{person.name} {person.number}   <button onClick={() =>  deleteContactOf(person.id)}>Delete</button></p>
          
        ))}
      
    </div>
  )
}

export default App