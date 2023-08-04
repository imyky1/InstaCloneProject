import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../../App';

import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import Collapse from '@mui/material/Collapse';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import { TextField, Box, Menu, MenuItem, Button } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import AddBoxIcon from '@mui/icons-material/AddBox';
import axios from 'axios';

const ExpandMore = styled((props) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
})(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
    }),
}));

export default function Home() {
    const { state, dispatch } = useContext(UserContext)
    // console.log(state)

    // Use an object to manage the Menu anchor element for each card
    const [anchorElNav, setAnchorElNav] = React.useState({});
    const [comment, setcomment] = useState('')                   //state to set comments
    const [expanded, setExpanded] = React.useState(false);      //state to open comments section
    const [data, setdata] = useState([]);                       //state to set data of all posts
    useEffect(() => {                                           //side effect to load all the following post everytime page reloads
        async function fetchdata() {
            const res = await axios.get('http://localhost:3000/allpost', {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('jwt')
                }
            })
            setdata(res.data.foundpost)
        }
        fetchdata()
        // console.log(data)
    }, [])
    const handleOpenNavMenu = (event, postId) => {              //function to open menu of post
        // Check if the anchorEl for the specific post ID is null
        if (!anchorElNav[postId]) {
            // Set the anchorEl for the specific post ID
            setAnchorElNav((prev) => ({
                ...prev,
                [postId]: event.currentTarget
            }));
        }
    };

    const handleCloseNavMenu = (postId) => {                    //function to close the menu of pos
        // Remove the anchorEl for the specific post ID
        setAnchorElNav((prev) => ({
            ...prev,
            [postId]: null
        }));
    };
    const handleExpandClick = () => {                           //function to open/close comment
        setExpanded(!expanded);
    };
    const handleCommentChange = (e) => {                          //function to change value of comment
        setcomment(e.target.value)
    }
    const changelike = async (id) => {                          //function to like unlike a post
        // Find the post object that matches the given id
        const postIndex = data.findIndex(post => post._id === id);
        if (postIndex !== -1) {
            const res = await axios.put('http://localhost:3000/like', {
                postId: id
            }, {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('jwt')
                }
            })
            setdata((prevdata) => {
                const newdata = [...prevdata]
                newdata[postIndex] = res.data.updatedpost
                return newdata
            })
        }
    }

    const makecomment = async (text, postId) => {               //function to create a comment
        const postIndex = data.findIndex(post => post._id === postId);
        const res = await axios.put('http://localhost:3000/comment', {
            postId,
            text
        }, {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('jwt')
            }
        })
        // console.log(res)
        setdata((prevdata) => {
            const newdata = [...prevdata]
            newdata[postIndex] = res.data
            return newdata
        })
    }

    const deletepost = async (postId) => {                      //function to delete a post
        try {
            const res = await axios.delete(`http://localhost:3000/deletepost/${postId}`, {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('jwt')
                }
            })
            const newdata = data.filter(item => {
                return item._id !== res.data._id
            })
            setdata(newdata)
        }
        catch (e) {
            console.log(e);
        }
    }
    return (
        <>
        <div>
        <div className="Home" >
            {
                data.map(item => (

                    <Card className='home-card' key={item._id}>

                        {/* Div to display Who posted and more icon */}
                        <div style={{ display: 'flex',justifyContent:'space-between'}}>

                            {/* Card header inside div to display who posted */}
                            <CardHeader title={<Link to={`/profile/${item.postedBy._id}`} style={{ fontFamily: 'monospace', textDecoration: 'none', fontWeight: 700, fontSize: '20px', color: 'black' }}> {item.postedBy.name} </Link>}
                                subheader={item.date}
                            />

                            {/* More button which open delete and profile option */}
                            <IconButton
                                sx={{ ml: '350px' }}
                                size="large"
                                aria-label="delete"
                                aria-controls={`menu-appbar-${item._id}`} // Unique ID for each Menu
                                aria-haspopup="true"
                                onClick={(event) => handleOpenNavMenu(event, item._id)}
                            >
                                <MoreVertIcon />
                            </IconButton>
                            <Menu
                                id={`menu-appbar-${item._id}`} // Unique ID for each Menu
                                anchorEl={anchorElNav[item._id]}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={Boolean(anchorElNav[item._id])} // Check if Menu should be open for this post
                                onClose={() => handleCloseNavMenu(item._id)} // Close Menu for this post
                            >
                                {/* Rest of the Menu items */}
                                {item.postedBy._id === state._id && (
                                    <MenuItem onClick={() => deletepost(item._id)}>
                                        <Button sx={{ color: 'black' }}>Delete</Button>
                                    </MenuItem>
                                )}
                                <MenuItem onClick={() => handleCloseNavMenu(item._id)}>
                                    <Link to={`/profile/${item.postedBy._id}`} style={{ textDecoration: 'none', marginLeft: '7px', fontSize: '14px', color: 'black' }}> PROFILE </Link>
                                </MenuItem>
                            </Menu>
                        </div>

                        {/* Card-media to display image which is posted */}
                        <CardMedia
                            component="img"
                            image={item.photo}
                            alt="cannot load"
                        />

                        {/* Card actions for like and share */}
                        <CardActions disableSpacing sx={{ padding: '8px 16px 0' }}>
                            <IconButton onClick={() => { changelike(item._id) }} aria-label="add to favorites">
                                {item.likes.includes(state._id) ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                            </IconButton>
                            <IconButton aria-label="share">
                                <ShareIcon />
                            </IconButton>
                        </CardActions>

                        {/* Card content to display the number of likes */}
                        <CardContent sx={{ padding: '0 30px 5px' }}>
                            <Typography variant="body3" color="text.secondary">
                                {item.likes.length} Likes
                            </Typography>
                        </CardContent>

                        {/* Card content to display the title */}
                        <CardContent sx={{ padding: '8px 16px' }}>
                            <Typography variant="body1" color="text.secondary">
                                {item.title}
                            </Typography>
                        </CardContent>

                        {/* Card media to display the description */}
                        <CardContent sx={{ padding: '8px 16px' }}>
                            <Typography variant="body2" color="text.secondary">
                                {item.description}
                            </Typography>
                        </CardContent>



                        {/* Card content to add comments */}
                        <CardContent sx={{ padding: '0px 16px 10px' }}>
                            {/* <Box sx={{ display: 'flex', alignItems: 'flex-end' }}> */}
                                <form onSubmit={(e) => {
                                    e.preventDefault()
                                    makecomment(e.target[0].value, item._id)
                                    setcomment('')
                                }} >
                                    <TextField fullWidth color="secondary" id="Comment" placeholder='Comment' value={comment} onChange={handleCommentChange} name='Comment' variant="standard" />
                                </form>

                            {/* </Box> */}
                        </CardContent>

                        {/*Exapnd icon to display all the comments*/}
                        <ExpandMore
                            expand={expanded}
                            onClick={handleExpandClick}
                            aria-expanded={expanded}
                            aria-label="show more"

                        >

                            <ExpandMoreIcon />
                        </ExpandMore>
                        show all {item.Comments.length} comments
                        <Collapse in={expanded} timeout="auto" unmountOnExit>
                            <CardContent>
                                {item.Comments.map(comment => (
                                    <Typography key={item._id} paragraph><span style={{ fontWeight: 600 }}>{comment.postedBy.name}</span>-{comment.text}</Typography>
                                ))}
                            </CardContent>
                        </Collapse>
                    </Card>
                ))
            }

            {/* Bottom Navigation */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <BottomNavigation
                    sx={{ position: 'fixed', bottom: 0, height: '80px', width: '120px', backgroundColor: '#FDF4F5', border: '0.2px solid grey', borderRadius: '20% 20% 0 0' }}
                    showLabels
                >
                    <BottomNavigationAction component={Link} to='/createpost' label="Create Post" icon={<AddBoxIcon fontSize='large' />} />
                </BottomNavigation>
            </div>
        </div>
        </div>
        </>
    )
}