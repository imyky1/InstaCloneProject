import App from "../../App.css"
import axios from 'axios';
import React,{useState,useEffect,useContext} from 'react';
import { Link } from "react-router-dom";
import { UserContext } from "../../App";
export default function Profile(){
    const [data, setdata] = useState([]);
    const{state,dispatch} = useContext(UserContext)

    // console.log('state=',state)
    console.log(localStorage.getItem('user'))
    useEffect(()=>{
        async function fetchdata(){
        const res = await axios.get('http://localhost:3000/mypost',{
            headers:{
                Authorization:'Bearer '+localStorage.getItem('jwt')
            }    
        })
        // console.log("data=",res.data) 
        setdata(res.data.foundpost)
        }
        fetchdata()
    },[])
    return(
        <>
        {state?
       <div style={{marginTop:"130px"}}>
        <div style={{display:"flex",justifyContent:'space-around',margin:'18px 0px',borderBottom:'1px solid black'}}>
            <div style={{paddingBottom:'20px'}}>
                <img style={{width:"260px",height:"260px",borderRadius:"50%"}} src={state.profilepic?state.profilepic:'https://plus.unsplash.com/premium_photo-1683584405772-ae58712b4172?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bm8lMjBwcm9maWxlfGVufDB8fDB8fHww&auto=format&fit=crop&w=600&q=60'} alt="" />
                
            </div>
            <div style={{marginLeft:'5px'}}>
                <h1>{state?state.name:'loading..'}</h1>
                <div style={{display:"flex" , justifyContent:'space-between',width:'108%'}}>
                    <h3>{state?state.followers.length:'0'} followers</h3>
                    <h3>{data.length} Posts</h3>
                    <h3>{state?state.following.length:'0'} following</h3>
                </div>
                <div>
                    {state?state.about:''}
                </div>
                <div style={ {marginTop:'50px', marginLeft: "auto", marginRight: "auto",":hover":{backgroundColor:'#FFD0D0'}}}>
                <Link to="/editprofile" style={{color: "black",textDecoration:'none',backgroundColor:'#FFF1F1', border: "solid black 0.5px",borderRadius:'5px', padding: "10px 20px"}} >Edit Profile?</Link>
                </div>
            </div>
        </div>
        <div className="gallery">
            {
                data.map(item =>(
                  <img className="item" src={item.photo} key={item._id} alt={item.title} />
                ))
            }            
        </div>
       </div>
       :'Loading...'}
       </>
    )
}