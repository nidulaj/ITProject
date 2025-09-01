/*export default function App() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-pink-500 to-purple-600">
      <h1 className="text-5xl font-bold text-white">Tailwind Works 🎉</h1>
    </div>
  )
}*/

/*export default function Button() {
  return (
    <button className="bg-brand text-white px-4 py-2 rounded-lg hover:bg-brand/80">
      Custom Button
    </button>
  )
}*/


import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
/*import DiscountForm from './features/financial-management/components/DiscountForm'*/
import DiscountPage from './features/financial-management/pages/DiscountPage'

function App() {

  return (
    <>
        <DiscountPage />
    </>
  )
}

export default App