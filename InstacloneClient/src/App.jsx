import { useState, useEffect, useContext, createContext, useReducer } from 'react'
import InstaAppBar from './Components/Navbar'
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom'
import Home from './Components/views/Home'
import Login from './Components/views/Login'
import Profile from './Components/views/Profile'
import Signup from './Components/views/SignUp'
import CreatePost from './Components/views/CreatePost'
import UserProfile from './Components/views/userprofile'
import FollowingPost from './Components/views/FollowingPost'
import EditProfile from './Components/views/Editprofile'
import { UserReducer, intialState } from './Reducer/UserReducer'

export const UserContext = createContext()
const Routing = () => {
  const navigate = useNavigate()
  const {state,dispatch} = useContext(UserContext)

  // Checking if a user is loggedin or not
  useEffect(()=>{
    const user = JSON.parse(localStorage.getItem('user'))
    if(user){
      dispatch({type:'USER',payload:user})
    }
    //if not logged in then move to /login page
    else{
      navigate('/login')
    }
  },[])
  
  return (
    <Routes>
      <Route path='/' element={<Home />}>
      </Route>
      <Route path='/login' element={<Login />}>
      </Route>
      <Route path='/signup' element={<Signup />}>
      </Route>
      <Route exact path='/profile' element={<Profile />}>
      </Route>
      <Route path='/createpost' element={<CreatePost />}>
      </Route>
      <Route path='/profile/:id' element={<UserProfile />}>
      </Route>
      <Route path='/followingpost' element={<FollowingPost />}>
      </Route>
      <Route path='/editprofile' element={<EditProfile />}>
      </Route>
    </Routes>
  )
}
function App() {
  const [count, setCount] = useState(0)
  const [state, dispatch] = useReducer(UserReducer, intialState)
  return (
    <>
      <UserContext.Provider value={{state,dispatch}}>
        <BrowserRouter>
          <InstaAppBar />
          <Routing />
        </BrowserRouter>
      </UserContext.Provider>
    </>
  )
}

export default App
