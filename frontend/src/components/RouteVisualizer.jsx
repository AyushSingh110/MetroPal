import React, { useState } from "react";
import {Card,CardContent,Typography,Box,Button} from "@mui/material";

const MapPinIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
    </svg>
);

const RouteVisualizer = () => {
    const [view,setView] = useState(null);

    return (
        <Card sx={{backgroundColor: '#1a1d23', color:'whitesmoke',height:"100%",width:"700px",borderRadius:5,marginLeft:'10px',border: '1px solid #f6a33dff',boxShadow: 3,}}>
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <MapPinIcon />
                    <Typography variant="h6" sx={{ fontWeight: "bold", marginLeft: 1 }}>
                        Route Visualizer
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                    <Button
                        variant="contained"
                        sx={{
                            mr: 1,
                            backgroundColor: view === 'map' ? '#404455' : '#1e2129',
                            color: 'whitesmoke',
                            borderRadius: 2,
                            '&:hover': { backgroundColor: '#505465' }
                        }}
                        onClick={() => setView('map')}
                    >
                        Map View
                    </Button>
                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: view === 'timeline' ? '#404455' : '#1e2129',
                            color: 'whitesmoke',
                            borderRadius: 2,
                            '&:hover': { backgroundColor: '#505465' }
                        }}
                        onClick={() => setView('timeline')}
                    >
                        Timeline
                    </Button>
                </Box>
                <Box sx={{ backgroundColor: '#1c2128', color: 'white', height: '450px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', borderRadius: 2,marginTop:4 }}>
                    {view === 'map' ? (
                        <>
                            <Typography variant="body1">Interactive Route Map</Typography>
                            <Typography variant="body2" sx={{ color: '#a0a0a0' }}>Click trains to view details</Typography>
                        </>
                    ) : (
                        <Typography variant="body1">Timeline view content goes here.</Typography>
                    )}
                </Box>
            </CardContent>
        </Card>
    );
};

export default RouteVisualizer;