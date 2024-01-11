import { MainGame } from "./Components/MainGame"
import { ContextGame } from "./Context"
const App = () => {
  return (
    <>
      {/* ContextGame */}
      <ContextGame>

        {/* Componente MainGame */}
        <MainGame/>
        
      </ContextGame>
    </>
  )
}

export default App
