import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import { Box, Button, Container, Divider } from "@mui/material";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';

import Typography from '@mui/material/Typography';
import { CardActions } from "@mui/material";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import Star from '@mui/icons-material/Star';

import { Link } from "react-router-dom";

import { useNavigate } from "react-router-dom";
function User() {
   
    const navigate = useNavigate()
    const { username } = useParams()

    const [userdata, setUserdata] = useState(null)

    const [location, setLocation] = useState({ lat: null, lon: null })


    const [showmap, setShowmap] = useState(false)
    const [showrepos, setShowrepos] = useState(false)

    const [repos, setRepos] = useState([])

    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true)

    const Cardrepositorio = ({ repos }) => {

        return (
            <Card variant="outlined" sx={{ width: "12em", '@media(max-width:700px)': { width: "100%" } }}>
                <CardContent variant="h4">
                    <Typography sx={{ wordBreak: "break-word" }} component={Link} to={repos.html_url} target="_blank">{repos.name}</Typography>

                    <Typography ><Star />{repos.stargazers_count}</Typography>
                </CardContent>
            </Card>
        )


    }
    const card = (
        <React.Fragment>

            <CardContent>
                {userdata ? <>
                    <Avatar alt="Remy Sharp" src={userdata.avatar_url} />
                    <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                        {userdata.name}
                    </Typography>
                    <Typography>
                        {userdata.bio}
                    </Typography>
                    <Typography>
                        {userdata.location}
                    </Typography>

                    <Typography>Principais repositórios:</Typography>
                    <Button onClick={() => setShowrepos((r) => r ? false : true)}>{showrepos ? "esconder repositórios" : "mostrar repositórios"}</Button>

                    {showrepos && <Container sx={{ display: "flex", flexWrap: "wrap" }}>

                        {repos.slice(0, 5).map((repositorio, k) => (
                            <Cardrepositorio repos={repositorio} key={k} />
                        ))}

                    </Container>}


                    <Divider />
                    <CardActions>
                        <Button onClick={() => showmap ? setShowmap(false) : setShowmap(true)}>
                            {showmap ? "esconder localização" : "Ver Localização"}
                        </Button>
                    </CardActions>
                </> : (<Typography>
                    Carregando...
                </Typography>)}

                <Divider />
                <Button variant="contained" color="success" onClick={() => addUser(userdata.login,userdata.avatar_url)}>Cadastrar</Button>
            </CardContent>
        </React.Fragment>
    )


    const map = (
        <MapContainer center={[location.lat, location.lon]} zoom={13} scrollWheelZoom={false} style={{ height: "20em", width: "100%" }}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[location.lat, location.lon]}>
                <Popup>
                    Localização de quem está pesquisando. <br />
                </Popup>
            </Marker>
        </MapContainer>
    )

    async function addUser(name,avatar) {
        try {


            const response = await fetch("http://localhost:5000/users", {

                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ "name": name ,"avatar_url":avatar})

            })
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            console.log({ user: data })

            navigate("/")





        } catch (error) {
            console.error("error:", error);
            setError("Usuário já cadastrado")
        }


    }
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                setLocation({ lat: position.coords.latitude, lon: position.coords.longitude })

            }, (error) => {
                console.error("error getting geolocation", error)
            })
        } else {
            console.warn("geolocation não é suportada")
        }
    }, [])

    useEffect(() => {
        const fetchUserdata = async () => {

            try {


                const response = await fetch(`https://api.github.com/users/${username}`);
                if (!response.ok) {
                    throw new Error(`erro ao buscar usuário :${response.statusText}`)
                }
                const data = await response.json()
                setUserdata(data)
                setLoading(false)

                try {

                    const reposLink = data.repos_url
                    const reposResponse = await fetch(reposLink);
                    if (!reposResponse.ok) {
                        throw new Error(`erro ao buscar repositorios : ${reposResponse.statustText}`)
                    }
                    const dataRepos = await reposResponse.json()
                    setRepos(dataRepos)

                }
                catch (error) {
                    console.error("error fetching repos", error)
                    setError("erro ao buscar repositorios")
                }

            }
            catch (error) {
                console.error("error fetching:", error)
                setError("erro na busca de usuário")
            }
        }

        fetchUserdata()
    }, [username])

    return (
        <Box sx={{ height: "100%", maxWidth: "30em" }}>
            {loading && <Typography>Carregando...</Typography>}
            {error && <Typography color="error"> {error}</Typography>}
            {userdata && <Card variant="outlined">{card}</Card>}


            {location.lat && location.lon && showmap ? (map

            ) : ""}





        </Box>
    )
} export default User;