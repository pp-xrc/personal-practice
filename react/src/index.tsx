import {createRoot } from 'react-dom/client'
import App from './App'

const root =document.querySelector('#root')
if(root){
    createRoot(root).render(<App/>)
}

console.log('NODE_ENV', process.env.NODE_ENV)
console.log('BASE_ENV', process.env.BASE_ENV)
console.log("process.env", process.env);

