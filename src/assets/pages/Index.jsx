import { Box, TextField, Button } from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import { useState } from 'react'
import { useNavigate } from "react-router-dom";


function Index() {

    const navigate = useNavigate()

    const [username, setUsername] = useState("")
    function handleSubmit(e) {
        e.preventDefault();
        navigate(`/user/${username}`)



    }
    return (
        <form onSubmit={handleSubmit}>
            <Box sx={{ maxWidth: "30em", height: "50em", display: "flex", flexDirection: "column" }}>


                <TextField id="outlined-basic" label="Nome usuário" variant="outlined" value={username} onChange={(e) => setUsername(e.target.value)} required />
                <Button variant="contained" endIcon={<SendIcon />} type="submit" >
                    Pesquisar
                </Button>





            </Box>
        </form>

    )
} export default Index;
