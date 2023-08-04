import React, { useContext } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import MenuItem from '@mui/material/MenuItem';
import CycloneIcon from '@mui/icons-material/Cyclone';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { Tooltip, Avatar } from '@mui/material';
const pages = ['Login', 'Signup', 'Blog'];
const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];
import { UserContext } from '../App';

function InstaAppBar() {
  const { state, dispatch } = useContext(UserContext)
  const rendelist = () => {
    if (state) {
      return [
        <Link to="/profile" style={{ fontFamily: 'monospace', textDecoration: 'none', fontWeight: 700, fontSize: '20px', padding: '3px', marginRight: '25px', color: 'black' }}>PROFILE</Link>,
        <Link to="/followingpost" style={{ fontFamily: 'monospace', textDecoration: 'none', fontWeight: 700, fontSize: '20px', padding: '3px', marginRight: '25px', color: 'black' }}>FOLLOWING</Link>,
        <Button
          style={{ fontFamily: 'monospace', textDecoration: 'none', fontWeight: 700, fontSize: '20px', padding: 0, marginRight: '25px', color: 'black' }}
          onClick={()=>{
            localStorage.clear()
            dispatch({type:'CLEAR'})
            window.location.reload()
          }}
        >
          LOGOUT
        </Button>
      ]
    }
    else {
      return [<Link to="/login" style={{ fontFamily: 'monospace', textDecoration: 'none', fontWeight: 700, fontSize: '20px', marginRight: '25px', color: 'black' }}>LOGIN</Link>,
      <Link to="/signup" style={{ fontFamily: 'monospace', textDecoration: 'none', fontWeight: 700, fontSize: '20px', marginRight: '25px', color: 'black' }}>SIGNUP</Link>]
    }
  }
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <>{state?
    <AppBar position="fixed" sx={{ background: "#E8A0BF" }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ height: "70px" }}>
          <CycloneIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1, color: 'black', fontSize: '40px' }} />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'Black',
              textDecoration: 'none',
            }}
          >
            INSTACLONE
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {rendelist().map((item) => (
                <MenuItem onClick={handleCloseNavMenu}>{item}</MenuItem>
              ))}

            </Menu>
          </Box>
          <CycloneIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1, color: 'black', fontSize: '40px' }} />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'Black',
              textDecoration: 'none',
            }}
          >
            INSTACLONE
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex', justifyContent: 'end' } }}>
            {rendelist()}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title={state.name}>
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Remy Sharp" src={state.profilepic?state.profilepic:'https://plus.unsplash.com/premium_photo-1683584405772-ae58712b4172?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bm8lMjBwcm9maWxlfGVufDB8fDB8fHww&auto=format&fit=crop&w=600&q=60'} />
              </IconButton>
            </Tooltip>
            {/* <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
              ))}
            </Menu> */}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
    :<AppBar position="fixed" sx={{ background: "#E8A0BF" }}>
    <Container maxWidth="xl">
      <Toolbar disableGutters sx={{ height: "70px" }}>
        <CycloneIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1, color: 'black', fontSize: '40px' }} />
        <Typography
          variant="h6"
          noWrap
          component="a"
          href="/"
          sx={{
            mr: 2,
            display: { xs: 'none', md: 'flex' },
            fontFamily: 'monospace',
            fontWeight: 700,
            letterSpacing: '.3rem',
            color: 'Black',
            textDecoration: 'none',
          }}
        >
          INSTACLONE
        </Typography>

        <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleOpenNavMenu}
            color="inherit"
          >
            <MenuIcon />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorElNav}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            open={Boolean(anchorElNav)}
            onClose={handleCloseNavMenu}
            sx={{
              display: { xs: 'block', md: 'none' },
            }}
          >
            {rendelist().map((item) => (
              <MenuItem onClick={handleCloseNavMenu}>{item}</MenuItem>
            ))}

          </Menu>
        </Box>
        <CycloneIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1, color: 'black', fontSize: '40px' }} />
        <Typography
          variant="h5"
          noWrap
          component="a"
          href="/"
          sx={{
            mr: 2,
            display: { xs: 'flex', md: 'none' },
            flexGrow: 1,
            fontFamily: 'monospace',
            fontWeight: 700,
            letterSpacing: '.3rem',
            color: 'Black',
            textDecoration: 'none',
          }}
        >
          INSTACLONE
        </Typography>
        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex', justifyContent: 'end' } }}>
          {rendelist()}
        </Box>

        {/* <Box sx={{ flexGrow: 0 }}>
          <Tooltip title={state.name}>
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
              <Avatar alt="Remy Sharp" src={state.profilepic?state.profilepic:'https://plus.unsplash.com/premium_photo-1683584405772-ae58712b4172?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bm8lMjBwcm9maWxlfGVufDB8fDB8fHww&auto=format&fit=crop&w=600&q=60'} />
            </IconButton>
          </Tooltip>
          {/* <Menu
            sx={{ mt: '45px' }}
            id="menu-appbar"
            anchorEl={anchorElUser}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
          >
            {settings.map((setting) => (
              <MenuItem key={setting} onClick={handleCloseUserMenu}>
                <Typography textAlign="center">{setting}</Typography>
              </MenuItem>
            ))}
          </Menu> */}
        {/* </Box> */}
      </Toolbar>
    </Container>
  </AppBar>}</>
  );
}
export default InstaAppBar;