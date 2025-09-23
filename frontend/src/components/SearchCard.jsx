import React from "react";
import { Card, CardContent, Typography, TextField, Button, Box } from "@mui/material";
import { blueGrey } from "@mui/material/colors";

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);
const SearchCard = () => {
    return (
        <Card sx={{ backgroundColor: '#1a1d23', color: "whitesmoke", padding: 2, marginTop: 4 , borderRadius: 3,border: '1px solid #f6a33dff',boxShadow: 3,}}>
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <SearchIcon />
                    <Typography variant="h6" sx={{ fontWeight: "bold", marginLeft: 1 }}>
                        Search Trains
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', marginTop: 2 ,}}>
                    <TextField 
                        label="Search by ID, fleet, or route..."
                        variant="outlined"
                        fullWidth
                        sx={{ 
                            marginRight: 2,
                            "& .MuiInputLabel-root": { color: "whitesmoke" },  
                            "& .MuiOutlinedInput-root": {
                            "& fieldset": {
                                borderColor: "#f7941c", 
                            }, 
                            "&:hover fieldset": {
                                borderColor: "#f6a33dff",
                            },
                            },
                            "& .MuiInputBase-input": {
                            color: "whitesmoke", 
                            },
                            "& .MuiInputBase-input::placeholder": {
                            color: '#a0a0a0',
                            opacity: 1,
                            },
                        }}
                    />
                    <Button 
                        variant="contained" 
                        color="whitesmoke" 
                        sx={{ backgroundColor: '#f7941cff',marginRight: 2,width:'100px' }}
                    >
                        Search
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );
};

export default SearchCard;
