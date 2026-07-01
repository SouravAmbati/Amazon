import React from 'react'
import Home from './pages/Home/Home.jsx'
import DesktopOnly from './components/screen/MobielOnly.jsx'

const App = () => {
  return (
    <div>
      <DesktopOnly>
        <Home />
      </DesktopOnly>
    </div>
  )
}

export default App