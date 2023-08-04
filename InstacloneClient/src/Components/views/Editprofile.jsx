import axios from 'axios';
import React, { useState,useContext,useEffect} from 'react';
import Card from '@mui/material/Card';
import { Snackbar, SnackbarContent } from '@mui/material';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../../App';

export default function EditProfile() {
    const {state,dispatch} = useContext(UserContext) 
    const navigate = useNavigate();
    const [open, setOpen] = React.useState(false);    //state to open or close the snack bar
    const [message, setMessage] = React.useState(''); //state to display the message on snackbar
    
    const [url, seturl] = useState('')                //state to save url of image uploaded to cloudinary
    const [Formdata, setFormData] = useState({        //state to save the form data
        About: '',
        ProfilePic: ''
    })
    const handleShowMessage = (type, message) => {    //function to display message on snackbar
        setMessage(message);
        setOpen(true);
    };
    const handleClose = () => {                       //function to close the snackbar
        setOpen(false);
    };
    const handleChange = (e) => {                    //function to change the formdata
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };
    const handleFileChange = (e) => {                //function to change the file formdata 
        const selectedFile = e.target.files[0];
        console.log(selectedFile);

        setFormData((prevFormData) => ({
            ...prevFormData,
            ProfilePic: selectedFile,
        }));
    };
    useEffect(()=>{                                 //everytime url changes this effect takes place 
        if (url) {
            //editprofile request
            async function create(){  

                try{
                    const res = await axios.put("http://localhost:3000/editprofile", {
                        userId: state._id,
                        about:Formdata.About,
                        profilepic:url
                    },{
                        headers:{
                            Authorization:'Bearer '+localStorage.getItem('jwt')
                        }
                    })
                    localStorage.setItem('user',JSON.stringify(res.data))
                    dispatch({type:'USER',payload:res.data})
                    handleShowMessage('success',"saved Successfully");
                    setTimeout(() => {
                        navigate('/profile');
                      }, 1000); // Delay the navigation by 1000 milliseconds (1 second)
                }
                catch(e){
                    // handleShowMessage('error', e.response.data.error);
                    // Handle API errors here
                    console.error('Error fetching data:', e);
                }
        }
        create()
    }
    },[url])
    //function to upload image to cloudinary
    const postdata = async () => {
        const data = new FormData()
            //use FormData to send the request to cloudinary
            data.append(`file`, Formdata.ProfilePic);
            data.append('upload_preset', 'instaClone')
            data.append('cloud_name', 'dyl4cuxnc')
            try {
                const res = await axios.post("https://api.cloudinary.com/v1_1/dyl4cuxnc/image/upload", data,)
                console.log(res.data.url)
                handleShowMessage('success','Uploaded Successfully');
                seturl(res.data.url)
            }
            catch (error) {
                handleShowMessage('error',error.message);
                console.log(error)
            }
    }

    return (
        <div>
            <Card sx={{ maxWidth: 800, textAlign: "center", mt: "200px", mr: "auto", ml: "auto" }}>
                <CardContent>
                    <h1 sx={{fontFamily:'Grand Hotel'}} >Edit {state?state.name:'Loading'}</h1>
                </CardContent>
                <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'flex-end'}}>
                        <TextField fullWidth color="secondary" id="About" label="About" name='About' value={Formdata.About} onChange={handleChange}  variant="standard" />
                    </Box>
                </CardContent>
                <CardContent>
                    <div style={{display:'flex', justifyContent:'flex-start',color:'GrayText'}}>Change Profile Pitcure</div> 
                    <input
                        type="file"
                        className="form-control"
                        onChange={handleFileChange}
                    />
                </CardContent>
                <CardActions>
                    <Button size="large" variant='outlined' onClick={postdata} sx={{ml:"auto",mr:"auto"}}>Save Changes</Button>
                </CardActions>
                <CardContent>
                   <Link to="/profile" style={{color:'black',textDecoration:'none',fontWeight:'600',fontSize:'25px'}} >Cancel</Link>
                </CardContent>
            </Card>
            {/* Snackbar to display flash message */}
            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                open={open}
                autoHideDuration={3000} // Duration in milliseconds to auto-hide the message (3 seconds)
                onClose={handleClose}
            >
                <SnackbarContent
                    // className={type === 'erro' ? 'success' : 'error'}
                    message={message}
                 />
            </Snackbar>
        </div>
    )
}