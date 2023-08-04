import axios from 'axios';
import React, { useState } from 'react';
import Card from '@mui/material/Card';
import { Snackbar, SnackbarContent, BottomNavigation } from '@mui/material';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import AccountCircle from '@mui/icons-material/AccountCircle';
import LockIcon from '@mui/icons-material/Lock';
import Box from '@mui/material/Box';
import TitleIcon from '@mui/icons-material/Title';
import { Link, useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';

const MyStyledSnackbarContent = styled(SnackbarContent)(({ theme }) => ({
    backgroundColor: theme.palette.success.main, // You can customize the background color here
    color: 'white', // You can customize the text color here
    // Add any other custom styles you want to apply to the SnackbarContent
}));

export default function Login() {
    const navigate = useNavigate();
    const [open, setOpen] = React.useState(false);
    const [message, setMessage] = React.useState('');
    const [type, setType] = React.useState('success'); // 'success' or 'error'
    const [Formdata, setFormData] = useState({
        Name: '',
        Email: '',
        Password: ''
    })
    const [errors, setErrors] = useState({
        Name: '',
        Email: '',
        Password: '',
    });
    const handleShowMessage = (type, message) => {
        setType(type);
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
        if (!Formdata.Name.trim()) {
            newErrors.Name = 'Username is required.';
        }
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
            try {
                const res = await axios.post("http://localhost:3000/signup", {
                    name: Formdata.Name,
                    password: Formdata.Password,
                    email: Formdata.Email
                }, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                handleShowMessage('success', res.data.message);
                // console.log(res.data)
                setTimeout(() => {
                    navigate('/login');
                }, 1000); // Delay the navigation by 1000 milliseconds (1 second)
            }
            catch (e) {
                handleShowMessage('error', e.response.data.error);
                // Handle API errors here
                console.error('Error fetching data:', e);
            }
        }
    }
    return (
        <div>
            {/* //loggin-card */}
            <Card sx={{ maxWidth: 800, textAlign: "center", mt: "120px", mr: "auto", ml: "auto" }}>
            <CardContent>
                    <h1 sx={{fontFamily:'Grand Hotel'}} >Instaclone</h1>
                </CardContent>
                <CardContent>

                    <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                        <AccountCircle sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
                        <TextField fullWidth color="secondary" id="Email" label="Email" name='Email' value={Formdata.Email} onChange={handleChange} error={Boolean(errors.Email)} helperText={errors.Email} variant="standard" />
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'flex-end', mt: "15px" }}>
                        <TitleIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
                        <TextField fullWidth color="secondary" id="Name" label="UserName" name='Name' value={Formdata.Name} onChange={handleChange} error={Boolean(errors.Name)} helperText={errors.Name} variant="standard" />
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'flex-end', mt: "15px" }}>
                        <LockIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
                        <TextField fullWidth color="secondary" id="password" type='password' name='Password' label="Password" value={Formdata.Password} error={Boolean(errors.Password)} helperText={errors.Password} onChange={handleChange} variant="standard" />
                    </Box>

                </CardContent>

                <CardActions>
                    <Button size="large" onClick={postdata} sx={{ color: "black", border: "solid black 0.5px", padding: "10px 40px", ml: "auto", mr: "auto" }}>SIGN UP</Button>
                </CardActions>

                <CardContent>
                    <Link style={{ color: 'black', textDecoration: 'none', fontWeight: '600', fontSize: '25px' }} to="/login">Already Have An Account?</Link>
                </CardContent>
            </Card>
            <Box sx={{ width: "100vw",bottom:0,display:'flex',flexDirection:'column',justifyContent:'center'}}>
                <BottomNavigation
                    
                    showLabels
                    value={'Yash Kumar'}
                >
                    <h7>© Yash Kumar Yadav</h7>
                </BottomNavigation>
            </Box>

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