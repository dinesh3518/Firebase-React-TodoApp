import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import {Box,Divider,Toolbar,Drawer, List,ListItem,ListItemButton,ListItemIcon,ListItemText,IconButton,CssBaseline} from '@mui/material';
import { Logout,Dashboard} from '@mui/icons-material';
import MenuIcon from '@mui/icons-material/Menu';
import { Todo } from './Todo';
import Cookies from 'universal-cookie';
import { useNavigate } from 'react-router-dom';
const cookies = new Cookies();
const drawerWidth = 220;

function ResponsiveDrawer(props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const userIcon=cookies.get('user-icon');
  const navigate=useNavigate();
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const handleLogout=()=>{
    cookies.remove('auth-token');
    cookies.remove('user-icon');
    navigate('/');
}
  const drawer = (
    <div  className='bg-primary vh-100'>
     <Toolbar className='text-light text-center fw-bold'>Todo App</Toolbar>
      <Divider />
      <List>
        {['Dashboard', 'Logout'].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton onClick={()=>(index===1)?handleLogout():navigate(`/todos/${cookies.get('auth-token')}`)}>
              <ListItemIcon>
                {index % 2 === 0 ? <Dashboard />: <Logout />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
      className='bg-light'
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar className='d-flex justify-content-between'>
          <IconButton
            color="blue"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <div>
            {userIcon?<img src={userIcon} className='img-fluid rounded-circle'
                            style={{ height: '2rem', width: '2rem' }} alt='...' />:
                            <i className="far fa-user-circle" style={{ fontSize: '28px', color: 'white' }}></i>}
          
          </div>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` },backgroundColor:'#ddeef0' }}
      >
        <Toolbar />
        <Todo/>
      </Box>
    </Box>
  );
}



export default ResponsiveDrawer;