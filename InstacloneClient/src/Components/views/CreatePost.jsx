import axios from 'axios'
import React, { useState,useEffect } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { Snackbar, SnackbarContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function CreatePost() {
    const navigate = useNavigate();
    const [open, setOpen] = React.useState(false); //state to open or close the snack bar
    const [message, setMessage] = React.useState('');//state to display the message on snackbar
    const [Formdata, setFormData] = useState({    //state to save the form data
        Title: '',
        Description: '',
        File: []
    })
    const [url, seturl] = useState('')            //state to save url of image uploaded to cloudinary
    const [errors, setErrors] = useState({        //state for form validation
        Title: '',
        Description: '',
        File: '',
    });
    const handleShowMessage = (message) => {      //function to display message on snackbar
        // setType(type);
        setMessage(message);
        setOpen(true);
    };
    const handleClose = () => {                   //function to close the snackbar
        setOpen(false);
    };
    const handleChange = (e) => {                 //function to change the formdata
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };
    useEffect(()=>{                               //everytime url changes this effect takes place 
        if (url) {
            //createpost request
            async function create(){       
            try{
                const res = await axios.post("http://localhost:3000/createpost", {
                    title: Formdata.Title,
                    description: Formdata.Description,
                    url: url
                },{
                    headers:{
                        Authorization:"Bearer "+localStorage.getItem('jwt')
                    }
                })
                handleShowMessage('New post Uploaded');
                setTimeout(() => {
                    navigate('/');
                }, 1000); // Delay the navigation by 1000 milliseconds (1 second)
            }
            catch(e){
                handleShowMessage(e.response.data.error);
                // Handle API errors here
                console.error('Error fetching data:', e);
            }
        }
        create()
    }
    },[url])
    //function to upload image to cloudinary
    const postdetails = async () => {

        const newErrors = {};

        // Perform form validation here
        if (!Formdata.Title.trim()) {
            newErrors.Title = 'Title is required.';
        }
        if (!Formdata.Description.trim()) {
            newErrors.Description = 'Description is required.';
        }
        if (!Formdata.File) {
            newErrors.File = 'File is required.';
        }
        // Check if there are any errors
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
        }
        else {
            //use FormData to send the request to cloudinary
            const data = new FormData()
            Formdata.File.forEach((image, index) => {
                console.log(`${index}=`, image)
                data.append(`file`, image);
            });
            data.append('upload_preset', 'instaClone')
            data.append('cloud_name', 'dyl4cuxnc')
            try {
                const res = await axios.post("https://api.cloudinary.com/v1_1/dyl4cuxnc/image/upload", data,)
                handleShowMessage('Uploaded Successfully');
                seturl(res.data.url)
            }
            catch (error) {
                handleShowMessage(error.message);
                console.log(error)
            }
        }
    }

    return (
        <div style={{ marginTop: '200px' }}>
            <Card sx={{ maxWidth: 800, textAlign: "center", mr: "auto", ml: "auto" }}>
                <CardHeader title="Create Post" />
                <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                        <TextField fullWidth color="secondary" id="title" label="Title" name="Title" error={Boolean(errors.Title)} helperText={errors.Title} value={Formdata.Title} onChange={handleChange} variant="standard" />
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'flex-end', mt: "15px" }}>
                        <TextField fullWidth color="secondary" id="Description" label="Description" name='Description' value={Formdata.Description} error={Boolean(errors.Description)} helperText={errors.Description} onChange={handleChange} variant="standard" />
                    </Box>
                </CardContent>
                <CardContent>
                    <input
                        type="file"
                        className="form-control"
                        onChange={(e) => {
                            setFormData((prevFormData) => ({
                                ...prevFormData,
                                File: Array.from(e.target.files)
                            }))
                        }}
                        // multiple
                    />
                    <Button variant="outlined" onClick={postdetails} fullWidth sx={{ margin: '30px 0 0' }}>
                        Upload
                    </Button>
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