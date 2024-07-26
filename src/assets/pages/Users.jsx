import React, { useEffect, useState } from "react"

import { Box, Container, Button } from "@mui/material"

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';

import Typography from '@mui/material/Typography';
import { CardActions } from "@mui/material";
import { Link } from "react-router-dom";
import DeleteIcon from '@mui/icons-material/Delete';

import { Edit } from "@mui/icons-material";
import TextField from '@mui/material/TextField';
function Users() {


    const [editMenu, setEditMenu] = useState(null)
    const [username, setUsername] = useState("")
    const UserCard = ({ user }) => {




        return (
            <React.Fragment>

                <CardContent  >


                    <Box sx={{ display: "flex", alignItems: "baseline", gap: "1em" }}>
                        <Avatar alt="Remy Sharp" src={user.avatar_url} />
                        {editMenu ==user.name?
                            <TextField id="standard-basic" label="name" variant="standard" onChange={(e) => setUsername(e.target.value)} value={username} />
                            : <Typography variant="h5">{user.name}</Typography>}

                        <Box display={"flex"} >

                            <Button onClick={() => {
                                setUsername(user.name)
                                setEditMenu((menu) => menu ? null : user.name)

                            }}>
                                <Edit />
                            </Button>
                            <Button onClick={() =>editMenu?UpdateUser(user): DeleteUser(user.id)}>{editMenu == user.name? "confirmar" : <DeleteIcon />}</Button>

                        </Box>

                    </Box>

                    <CardActions>

                        <Button variant="contained" color="success" component={Link} to={`https://github.com/${user.name}`} target="_blank">Visitar perfil no github</Button>

                    </CardActions>



                </CardContent>
            </React.Fragment>
        )
    }

    const DeleteUser = async (id) => {
        try {
            const response = await fetch(`http://localhost:5000/del/${id}`, {
                method: "DELETE"
            })
            if (!response.ok) {
                throw new Error("erro ao deletar usuário")
            }

            setUsers(users.filter(user=>user.id!==id))

            const data = await response.json()
            console.log(data)


        }
        catch (error) {
            console.error("error:", error)
        }




    }


    const UpdateUser = async (user) => {

        
        try{
            const response = await fetch(`https://api.github.com/users/${username}`);
            if(!response.ok){
                throw new Error(`usuário não existente! status: ${response.status}`);
            }



            try{
                const data= await response.json()
                const id= user.id
                const EditUser = {name:username,avatar_url:data.avatar_url}
                
                const responseEdit = await fetch(`http://localhost:5000/users/${id}`,{
                    method:"PUT",
                    headers: { "Content-Type": "application/json" },
                    body:JSON.stringify(EditUser)
                })
                if(!responseEdit.ok){
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
    
                setUsers(prev=>prev.map(user=>user.id===id?{id:id,name:username,avatar_url:data.avatar_url}:user))
                setEditMenu(null)
            }
             catch(error){
                console.error("erro:",error)
             }
        }
        catch(error){
            console.error("erro:",error)
        }



        



    }
    const [users, setUsers] = useState([])

    useEffect(() => {



        const FetchMessag = async () => {
            try {
                const response = await fetch("http://localhost:5000/users")

                if (!response.ok) {
                    throw new Error(`Erro ao carregar dados ${response.statusText}`)
                }



                const data = await response.json()


                setUsers(data)
            }
            catch (error) {
                console.error("error fetching:", error)

            }
        }
        FetchMessag()
    }



        , [])


    return (
        <Box >
            <Container sx={{ margin: "5%", display: "flex", flexDirection: "row", gap: "5em" }}>
                {users && users.map((user, k) => (
                    <Card key={k}>{UserCard({ user })}</Card>
                ))}
            </Container>



        </Box>)
} export default Users