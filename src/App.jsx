import { useState } from 'react'

import './App.css'
import Interaction from "./components/particle";

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     <Interaction/>
    </>
  )
}

export default App
