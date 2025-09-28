import React, { useState } from "react";
import { Card, CardContent, Typography, Box, Button } from "@mui/material";

const GOOGLE_MAPS_API_KEY = "AIzaSyA770R6eXH6xVx-XjMub3O8seKVZuwRNfM"; 

const MAP_URL = `https://maps.googleapis.com/maps/api/staticmap?center=Edappally,Kochi&zoom=12&size=700x450&maptype=roadmap&markers=color:blue%7Clabel:A%7CAluva&markers=color:blue%7Clabel:B%7CCusat&markers=color:red%7Clabel:E%7CEdappally&markers=color:blue%7Clabel:L%7CLisie%2BHospital&markers=color:blue%7Clabel:M%7CMG%2BRoad&markers=color:blue%7Clabel:V%7CVytilla&key=${GOOGLE_MAPS_API_KEY}`;

const trainStops = [
    { name: "Aluva", arrival: "7:00 AM", arrivalActual: "7:01 AM", departure: "7:01 AM", departureActual: "7:03 AM", km: 0, platform: 1 },
    { name: "Pulinchodu", arrival: "7:05 AM", arrivalActual: "7:06 AM", departure: "7:06 AM", departureActual: "7:07 AM", km: 3, platform: 2 },
    { name: "Cusat", arrival: "7:12 AM", arrivalActual: "7:12 AM", departure: "7:13 AM", departureActual: "7:14 AM", km: 8, platform: 1 },
    { name: "Edappally", arrival: "7:17 AM", arrivalActual: "7:20 AM", departure: "7:18 AM", departureActual: "7:20 AM", km: 11, platform: 2 },
    { name: "Kaloor", arrival: "7:23 AM", arrivalActual: "7:25 AM", departure: "7:24 AM", departureActual: "7:26 AM", km: 15, platform: 1 },
    { name: "MG Road", arrival: "7:30 AM", arrivalActual: "7:31 AM", departure: "7:31 AM", departureActual: "7:32 AM", km: 19, platform: 2 },
    { name: "Vytilla", arrival: "7:37 AM", arrivalActual: "7:37 AM", departure: "7:38 AM", departureActual: "7:39 AM", km: 24, platform: 1 },
];

const MapPinIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
    </svg>
);

const EditIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
    </svg>
);

const TrainTimeline = ({ stops }) => {
    return (
        <Box sx={{ p: 2, overflowY: 'auto', height: '100%', maxWidth: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, borderBottom: '1px solid #404455', pb: 1, color: '#a0a0a0' }}>
                <Typography variant="caption" sx={{ fontWeight: 'bold', width: '20%',ml:11 }}>Arrival</Typography> 
                <Typography variant="caption" sx={{ fontWeight: 'bold', flexGrow: 1, textAlign: 'center' }}>Day 1 - Sep 28, Sun</Typography>
                <Typography variant="caption" sx={{ fontWeight: 'bold', width: '20%', textAlign: 'right' }}>Departure</Typography> 
            </Box>
            
            <Box sx={{ position: 'relative', ml: '110px', pr: '10px' }}> 
                
                <Box sx={{ position: 'absolute', top: 0, bottom: 0, left: 0, width: '4px', backgroundColor: '#3f4247' }} />

                {stops.map((stop, index) => (
                    <Box key={index} sx={{ display: 'flex', mb: 3, position: 'relative' }}>
                        
                        <Box sx={{ 
                            position: 'absolute', 
                            left: '-110px', 
                            width: '100px', 
                            textAlign: 'right', 
                            whiteSpace: 'nowrap' 
                        }}>
                            <Typography variant="body2" sx={{ color: '#a0a0a0' }}>{stop.arrival}</Typography>
                            <Typography variant="body2" sx={{ color: '#f26e2e' }}>{stop.arrivalActual}</Typography>
                        </Box>

                        <Box sx={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#56a7f5', position: 'absolute', left: '-4px', top: '5px' }} />

                        <Box sx={{ ml: '25px', flexGrow: 1, minWidth: 0 }}>
                            <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 0.5 }}>{stop.name}</Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', color: '#a0a0a0', mb: 1 }}>
                                <Typography variant="caption" sx={{ mr: 1 }}>{stop.km} km</Typography>
                                <Typography variant="caption" sx={{ mr: 1 }}>Platform {stop.platform}</Typography>
                                <Box sx={{ border: '1px solid #a0a0a0', borderRadius: '50%', p: '2px', display: 'flex' }}>
                                    <EditIcon />
                                </Box>
                            </Box>
                            {index === 0 && (
                                <Button size="small" variant="contained" sx={{ 
                                    textTransform: 'none', 
                                    backgroundColor: '#404455', 
                                    color: 'whitesmoke', 
                                    borderRadius: 3, 
                                    fontSize: '0.75rem', 
                                    p: '4px 10px',
                                    '&:hover': { backgroundColor: '#505465' }
                                }}>
                                    Get directions
                                </Button>
                            )}
                        </Box>
                        
                        <Box sx={{ ml: '15px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                            <Typography variant="body2" sx={{ color: '#a0a0a0' }}>{stop.departure}</Typography>
                            <Typography variant="body2" sx={{ color: '#f26e2e' }}>{stop.departureActual}</Typography>
                        </Box>
                    </Box>
                ))}
            </Box>
        </Box>
    );
}

const RouteVisualizer = () => {
    const [view, setView] = useState('map');

    return (
        <Card sx={{ backgroundColor: '#1a1d23', color: 'whitesmoke', height: "100%", width: "700px", borderRadius: 5, marginLeft: '10px', border: '1px solid #f6a33dff', boxShadow: 3, marginTop: 3 }}>
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
                            backgroundColor: view === 'map' ? '#404455' : 'transparent',
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
                            backgroundColor: view === 'timeline' ? '#404455' : 'transparent',
                            color: 'whitesmoke',
                            borderRadius: 2,
                            '&:hover': { backgroundColor: '#505465' }
                        }}
                        onClick={() => setView('timeline')}
                    >
                        Timeline
                    </Button>
                </Box>
                <Box sx={{ backgroundColor: '#1c2128', color: 'white', height: '450px', display: 'flex', flexDirection: 'column', justifyContent: view === 'map' ? 'center' : 'flex-start', alignItems: view === 'map' ? 'center' : 'stretch', borderRadius: 2, marginTop: 4 }}>
                    {view === 'map' ? (
                        <Box 
                            sx={{ width: '100%', height: '100%', overflow: 'hidden' }}
                        >
                            <img 
                                src={MAP_URL} 
                                alt="Train Route Map around Chinchwad, Pune" 
                                style={{ 
                                    width: '100%', 
                                    height: '100%', 
                                    objectFit: 'cover' 
                                }}
          
                                onError={(e) => {
                                    e.target.onerror = null; 
                                    e.target.style.display = 'none';
                                    const parent = e.target.parentNode;
                                    parent.innerHTML = `
                                        <div style="text-align: center; padding: 20px; color: #f44336;">
                                            <p>Map failed to load. Please ensure the <strong>GOOGLE_MAPS_API_KEY</strong> is set correctly in RouteVisualizer.jsx.</p>
                                            <p>Showing placeholder view.</p>
                                        </div>
                                    `;
                                }}
                            />
                        </Box>
                    ) : (
                        <TrainTimeline stops={trainStops} />
                    )}
                </Box>
            </CardContent>
        </Card>
    );
};

export default RouteVisualizer;