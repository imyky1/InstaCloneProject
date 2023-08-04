import axios from 'axios';
import React, { useState,useContext } from 'react';
import Card from '@mui/material/Card';
import { Snackbar, SnackbarContent } from '@mui/material';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import AccountCircle from '@mui/icons-material/AccountCircle';
import LockIcon from '@mui/icons-material/Lock';
import Box from '@mui/material/Box';
import { Link, useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles'; 
import { UserContext } from '../../App';

export default function Login() {
    const {state,dispatch} = useContext(UserContext)
    const navigate = useNavigate();
    const [open, setOpen] = React.useState(false);
    const [message, setMessage] = React.useState('');

    const [Formdata, setFormData] = useState({
        Email: '',
        Password: ''
    })
    const [errors, setErrors] = useState({
        Email: '',
        Password: '',
    });
    const handleShowMessage = (type, message) => {
        setMessage(message);
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const postdata = async () => {

        const newErrors = {};

        // Perform form validation here
        if (!Formdata.Email.trim()) {
            newErrors.Email = 'Email is required.';
        } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(Formdata.Email)) {
            newErrors.Email = 'Invalid email format.';
        }
        if (!Formdata.Password.trim()) {
            newErrors.Password = 'Password is required.';
        } else if (Formdata.Password.length < 6) {
            newErrors.Password = 'Password must be at least 6 characters long.';
        }
        // Check if there are any errors
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
        }
        else {
            try{
            const res = await axios.post("http://localhost:3000/signin", {
                password: Formdata.Password,
                email: Formdata.Email
            })
            localStorage.setItem('jwt',res.data.token)
            localStorage.setItem('user',JSON.stringify(res.data.user))
            dispatch({type:'USER',payload:res.data.user})
            handleShowMessage('success',"Signed in Successfully");
            // console.log(res.data)
            setTimeout(() => {
                navigate('/');
              }, 1000); // Delay the navigation by 1000 milliseconds (1 second)
        }
        catch(e){
            handleShowMessage('error', e.response.data.error);
            // Handle API errors here
            console.error('Error fetching data:', e);
        }
        }
    }

    return (
        <div>
            <Card sx={{ maxWidth: 800, textAlign: "center", mt: "200px", mr: "auto", ml: "auto" }}>
                {/* <CardMedia
                    component="img"
                    sx={{ height: 250 }}
                    image="/images/instaclonecard.jpg"
                /> */}
                <CardContent>
                    <h1 sx={{fontFamily:'Grand Hotel'}} >Instaclone</h1>
                </CardContent>
                <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'flex-end'}}>
                        <AccountCircle sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
                        <TextField fullWidth color="secondary" id="Email" label="Email" name='Email' value={Formdata.Email} onChange={handleChange} error={Boolean(errors.Email)} helperText={errors.Email} variant="standard" />
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'flex-end',mt:"15px"}}>
                        <LockIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
                        <TextField fullWidth color="secondary" id="password" type='password' label="Password" name='Password' value={Formdata.Password} onChange={handleChange} error={Boolean(errors.Password)} helperText={errors.Password} variant="standard" />
                    </Box>
                </CardContent>
                <CardActions>
                    <Button size="large" variant='outlined' onClick={postdata} sx={{ml:"auto",mr:"auto"}}>LOGIN</Button>
                </CardActions>
                <CardContent>
                   <Link to="/signup" style={{color:'black',textDecoration:'none',fontWeight:'600',fontSize:'25px'}} >New User?</Link>
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