const Header = (props) => <h1>{props.course}</h1>

const Content = (props) => {

  
  return(
    <div>
    
    {props.parts.map((part) => (
      <Part key={part.name} part={part} />

    ))}

    <Total total = {props.parts.reduce((s,p) => s+p.exercises, 0)}/>
  </div>

  )
  }


const Part = (props) => (
  <p>
    {props.part.name} {props.part.exercises}
  </p>
)

const Courses = (props) => {
  return (
    <div>
      {props.courses.map((course, idx) => (
        <Course key={course.name + idx} course={course} />
      ))}
    </div>
  );
}


const Course = (props) => {
  return (
    <div>
      
      <Header course={props.course.name} />
      <Content parts={props.course.parts} />
   
    </div>
  )
}

const Total = (props) => <p> <strong>Total of {props.total} exercises</strong></p>

export default Courses