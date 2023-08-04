import App from "../../App.css"
import axios from 'axios';
import React,{useState,useEffect,useContext} from 'react';
import { UserContext } from "../../App";
import { useParams } from "react-router-dom";
import { Button } from "@mui/material";
export default function UserProfile(){
    const {id} = useParams()
    const [userprofile, setuserprofile] = useState(null);
    const{state,dispatch} = useContext(UserContext)
    // console.log(state)
    useEffect(()=>{
        async function fetchdata(){
        const res = await axios.get(`http://localhost:3000/user/${id}`,{
            headers:{
                Authorization:'Bearer '+localStorage.getItem('jwt')
            }    
        })
        // console.log("data=",res.data) 
        setuserprofile(res.data)
        }
        fetchdata()
    },[])
    const followuser = async(followId)=>{
        const res = await axios.put('http://localhost:3000/follow',{
            followId
        },{
            headers:{
                Authorization:'Bearer '+localStorage.getItem('jwt')
            }
        })
        console.log(res.data)
        dispatch({type:'UPDATE',payload:{following:res.data.following,followers:res.data.followers}})
        localStorage.setItem('user',JSON.stringify(res.data))
        setuserprofile((prevstate)=>{
            return{
                ...prevstate,
                user:{...prevstate.user,followers:[...prevstate.user.followers,res.data._id]}
            }
        })
    }
    const unfollowuser = async(unfollowId)=>{
        const res = await axios.put('http://localhost:3000/unfollow',{
            unfollowId
        },{
            headers:{
                Authorization:'Bearer '+localStorage.getItem('jwt')
            }
        })
        console.log(res.data)
        dispatch({type:'UPDATE',payload:{following:res.data.following,followers:res.data.followers}})
        localStorage.setItem('user',JSON.stringify(res.data))
        setuserprofile((prevstate)=>{
            const newfollower = prevstate.user.followers.filter(item=>(item !== res.data._id))
            return{
                ...prevstate,
                user:{...prevstate.user,followers:newfollower}
            }
        })
    }
    return(
        <>
        {userprofile ?
       <div style={{marginTop:"130px"}}>
        <div style={{display:"flex",justifyContent:'space-around',margin:'18px 0px',borderBottom:'1px solid black'}}>
            <div style={{paddingBottom:'20px'}}>
                <img style={{width:"260px",height:"260px",borderRadius:"50%"}} src={userprofile.user.profilepic?userprofile.user.profilepic:'https://plus.unsplash.com/premium_photo-1683584405772-ae58712b4172?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bm8lMjBwcm9maWxlfGVufDB8fDB8fHww&auto=format&fit=crop&w=600&q=60'} alt="" />
                
            </div>
            <div>
                <h1>{userprofile.user.name}</h1>
                <div style={{display:"flex" , justifyContent:'space-between',width:'108%'}}>
                    <h3>{userprofile.user.followers.length} followers</h3>
                    <h3>{userprofile.post.length} Posts</h3>
                    <h3>{userprofile.user.following.length} following</h3>
                </div>
                <div>
                {userprofile.user.about?userprofile.user.about:''}
                </div>
                {userprofile.user._id===state._id ? null :
                userprofile.user.followers.includes(state._id)?
                    <Button size="large" onClick={()=>{unfollowuser(userprofile.user._id)}} sx={{ mt:'20px' ,color: "black",backgroundColor:'#FFF1F1', border: "solid black 0.5px", padding: "10px 20px", ml: "auto", mr: "auto" ,":hover":{backgroundColor:'#FFD0D0'}}}>Unfollow</Button> :
                    <Button size="large" onClick={()=>{followuser(userprofile.user._id)}} sx={{ mt:'20px' ,color: "black",backgroundColor:'#FFF1F1', border: "solid black 0.5px", padding: "10px 20px", ml: "auto", mr: "auto",":hover":{backgroundColor:'#FFD0D0'} }}>follow</Button>                
                }
            </div>
        </div>
        <div className="gallery">
            {
                userprofile.post.map(item =>(
                  <img className="item" src={item.photo} key={item._id} alt={item.title} />
                ))
            }            
        </div>
       </div>
       : 'Loading...'}
       </>
    )
}