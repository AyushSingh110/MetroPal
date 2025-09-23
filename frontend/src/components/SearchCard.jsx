import React, { useState } from "react";
import { Card, CardContent, Typography, TextField, Button, Box, Modal, Grid } from "@mui/material";

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

const SearchCard = () => {
  const [query, setQuery] = useState("");
  const [trainData, setTrainData] = useState(null);
  const [open, isOpen] = useState(false);

  const handleSearch = async () => {
    try {
      const res = await fetch("/full_train_data.json");
      const data = await res.json();

      const allTrains = Object.values(data).flat();
      const found = allTrains.find(
        (trains) => trains.train_id.toLowerCase() === query.toLowerCase()
      );

      if (found) {
        setTrainData(found);
        isOpen(true);
      } else {
        alert("train not found!");
      }
    } catch (error) {
      console.error('Error fetching trains:', error);
    }
  };

  return (
    <Card sx={{ backgroundColor: '#1a1d23', color: "whitesmoke", padding: 2, marginTop: 4, borderRadius: 3, border: '1px solid #f6a33dff', boxShadow: 3 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <SearchIcon />
          <Typography variant="h6" sx={{ fontWeight: "bold", marginLeft: 1 }}>
            Search Trains
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', marginTop: 2 }}>
          <TextField
            label="Search by ID, fleet, or route..."
            variant="outlined"
            fullWidth
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            sx={{
              marginRight: 2,
              "& .MuiInputLabel-root": { color: "whitesmoke" },
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#f7941c" },
                "&:hover fieldset": { borderColor: "#f6a33dff" },
              },
              "& .MuiInputBase-input": { color: "whitesmoke" },
              "& .MuiInputBase-input::placeholder": { color: '#a0a0a0', opacity: 1 },
            }}
          />
          <Button
            variant="contained"
            color="whitesmoke"
            sx={{ backgroundColor: '#f7941cff', marginRight: 2, width: '100px' }}
            onClick={handleSearch}
          >
            Search
          </Button>
        </Box>
      </CardContent>

      <Modal open={open} onClose={() => isOpen(false)} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box sx={{
          backgroundColor: "#2a2d34",
          color: "whitesmoke",
          padding: 4,
          borderRadius: 3,
          minWidth: 500,
          border: '2px solid #f88b06ff',
          boxShadow: 3
        }}>
          {trainData && (
            <>
              <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
                Train ID: {trainData.train_id}
              </Typography>

              <Grid container spacing={12}>
                <Grid item xs={12} sm={6}>
                  <Typography sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Fitness Score:</Typography>
                  <Typography sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{trainData.fitness_score}</Typography>

                  <Typography sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Last Maintenance:</Typography>
                  <Typography sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{trainData.last_maintenance_date}</Typography>

                  <Typography sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Maintenance Due:</Typography>
                  <Typography sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{trainData.maintenance_due ? "Yes" : "No"}</Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Needs Cleaning:</Typography>
                  <Typography sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{trainData.needs_cleaning ? "Yes" : "No"}</Typography>

                  <Typography sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Branding Active:</Typography>
                  <Typography sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{trainData.branding_active}</Typography>

                  <Typography sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Branding Company:</Typography>
                  <Typography sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{trainData.branding_company}</Typography>
                </Grid>
              </Grid>
            </>
          )}
        </Box>
      </Modal>
    </Card>
  );
};

export default SearchCard;
