
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';


import Button from '@mui/material/Button';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';

import { Link } from 'react-router-dom';

function Navbar() {
    return (



        <Box sx={{  width: "100%"}}>
            <AppBar position="static">
                <Toolbar sx={{justifyContent:"space-between"}}>
                    <Box>
                        <Button edge="start" color="inherit" aria-label="home" sx={{ mr: 2 }} startIcon={<HomeIcon />} component={Link} to="/">
                            Inicio
                        </Button>
                        <Button color="inherit" aria-label="home" sx={{ mr: 2 }} startIcon={<PersonIcon/>} component={Link} to="/users" >
                            usuários
                        </Button>
                    </Box>

                    <Button color="inherit">Login</Button>
                </Toolbar>
            </AppBar>
        </Box>
    )
} export default Navbar;