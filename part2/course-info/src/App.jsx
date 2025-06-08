import Courses from './components/Courses'

const App = () => {
const courses = [
  {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10,
      },
      {
        name: 'Using props to pass data',
        exercises: 7,
      },
      {
        name: 'State of a component',
        exercises: 14,
      },
    ],
  },
  {
    name: 'Spaghetti Code Culinary Arts',
    parts: [
      {
        name: 'Boiling JavaScript Basics',
        exercises: 8,
      },
      {
        name: 'Saucing Up CSS',
        exercises: 6,
      },
      {
        name: 'Debugging with a Fork',
        exercises: 12,
      },
    ],
  },
  {
    name: 'Quantum Meme Programming',
    parts: [
      {
        name: 'Schrödinger’s Code: It Works and It Doesn’t',
        exercises: 9,
      },
      {
        name: 'Meme-Driven Development',
        exercises: 5,
      },
      {
        name: 'Cat GIF API Integration',
        exercises: 15,
      },
    ],
  },
  {
    name: 'Procrastination-Driven Development',
    parts: [
      {
        name: 'Introduction to Infinite Scrolling',
        exercises: 4,
      },
      {
        name: 'Mastering the Art of "I’ll Do It Tomorrow"',
        exercises: 3,
      },
      {
        name: 'Coffee-Powered Coding Sprints',
        exercises: 10,
      },
    ],
  },
  {
    name: 'Keyboard Warrior Bootcamp',
    parts: [
      {
        name: 'Typing at 120 WPM with Attitude',
        exercises: 7,
      },
      {
        name: 'Hotkey Heroics',
        exercises: 5,
      },
      {
        name: 'Rage-Quitting with Style',
        exercises: 11,
      },
    ],
  },
  {
    name: 'Bug Wrangling 101',
    parts: [
      {
        name: 'Identifying the Elusive Null Pointer',
        exercises: 6,
      },
      {
        name: 'Taming Wild Loops',
        exercises: 8,
      },
      {
        name: 'Convincing the Compiler It’s Wrong',
        exercises: 13,
      },
    ],
  },
  {
    name: 'Code Wizardry and Snack Alchemy',
    parts: [
      {
        name: 'Casting Spells with Python',
        exercises: 9,
      },
      {
        name: 'Transmuting Chips into Code',
        exercises: 4,
      },
      {
        name: 'Midnight Pizza-Powered Debugging',
        exercises: 12,
      },
    ],
  },
];

  return (
   

      <Courses courses={courses} />
    
  )
}

export default App