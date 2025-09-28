import React, { useState, useCallback, useMemo } from "react";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  Modal,
  Grid,
  Alert,
  Backdrop,
  CircularProgress,
  IconButton
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

const SearchIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="20" 
    height="20" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    role="img"
    aria-label="Search icon"
  >
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

const SearchCard = () => {
  const [query, setQuery] = useState("");
  const [trainData, setTrainData] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Memoized styles for better performance
  const cardStyles = useMemo(() => ({
    backgroundColor: '#1a1d23',
    color: "whitesmoke",
    padding: 2,
    marginTop: 4,
    borderRadius: 3,
    border: '1px solid #f6a33dff',
    boxShadow: 3
  }), []);

  const textFieldStyles = useMemo(() => ({
    marginRight: 2,
    "& .MuiInputLabel-root": { 
      color: "whitesmoke",
      "&.Mui-focused": { color: "#f6a33dff" }
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": { borderColor: "#f7941c" },
      "&:hover fieldset": { borderColor: "#f6a33dff" },
      "&.Mui-focused fieldset": { borderColor: "#f6a33dff" },
    },
    "& .MuiInputBase-input": { color: "whitesmoke" },
    "& .MuiInputBase-input::placeholder": { color: '#a0a0a0', opacity: 1 },
  }), []);

  const modalStyles = useMemo(() => ({
    backgroundColor: "#2a2d34",
    color: "whitesmoke",
    padding: 4,
    borderRadius: 3,
    minWidth: 500,
    maxWidth: '90vw',
    maxHeight: '90vh',
    overflow: 'auto',
    border: '2px solid #f88b06ff',
    boxShadow: 3,
    position: 'relative'
  }), []);

  const handleSearch = useCallback(async () => {
    if (!query.trim()) {
      setError("Please enter a search query");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/full_train_data.json");
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      const allTrains = Object.values(data).flat();
      const found = allTrains.find(
        (train) => train.train_id.toLowerCase() === query.toLowerCase().trim()
      );

      if (found) {
        setTrainData(found);
        setOpen(true);
      } else {
        setError("Train not found! Please check the train ID and try again.");
      }
    } catch (error) {
      console.error('Error fetching trains:', error);
      setError("Failed to fetch train data. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [query]);

  const handleClose = useCallback(() => {
    setOpen(false);
    setTrainData(null);
  }, []);

  const handleKeyPress = useCallback((event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  }, [handleSearch]);

  const handleQueryChange = useCallback((e) => {
    setQuery(e.target.value);
    if (error) setError(""); // Clear error when user starts typing
  }, [error]);

  return (
    <>
      <Card sx={cardStyles}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <SearchIcon />
            <Typography 
              variant="h6" 
              component="h2"
              sx={{ fontWeight: "bold", marginLeft: 1 }}
            >
              Search Trains
            </Typography>
          </Box>
          
          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 2, 
                backgroundColor: '#d32f2f20',
                color: 'whitesmoke',
                '& .MuiAlert-icon': { color: '#f44336' }
              }}
            >
              {error}
            </Alert>
          )}

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <TextField
              label="Search by ID, fleet, or route..."
              variant="outlined"
              fullWidth
              value={query}
              onChange={handleQueryChange}
              onKeyPress={handleKeyPress}
              disabled={loading}
              sx={textFieldStyles}
              inputProps={{
                'aria-describedby': 'search-help-text',
                maxLength: 50
              }}
            />
            <Button
              variant="contained"
              sx={{ 
                backgroundColor: '#f7941cff',
                color: 'white',
                minWidth: '100px',
                '&:hover': { backgroundColor: '#f88b06ff' },
                '&:disabled': { backgroundColor: '#666' }
              }}
              onClick={handleSearch}
              disabled={loading || !query.trim()}
              aria-label="Search for train"
            >
              {loading ? <CircularProgress size={20} color="inherit" /> : 'Search'}
            </Button>
          </Box>
          
          <Typography 
            id="search-help-text" 
            variant="caption" 
            sx={{ color: '#a0a0a0', mt: 1, display: 'block' }}
          >
            Enter the exact train ID to search for train details
          </Typography>
        </CardContent>
      </Card>

      <Modal
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
          sx: { backgroundColor: 'rgba(0, 0, 0, 0.7)' }
        }}
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          p: 2
        }}
        aria-labelledby="train-details-title"
        aria-describedby="train-details-description"
      >
        <Box sx={modalStyles}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography 
              id="train-details-title"
              variant="h5" 
              component="h3"
              sx={{ fontWeight: 'bold' }}
            >
              Train Details: {trainData?.train_id}
            </Typography>
            <IconButton
              onClick={handleClose}
              sx={{ color: 'whitesmoke' }}
              aria-label="Close train details"
            >
              <CloseIcon />
            </IconButton>
          </Box>

          {trainData && (
            <Grid container spacing={3} id="train-details-description">
              <Grid item xs={12} sm={6}>
                <Box sx={{ mb: 2 }}>
                  <Typography sx={{ fontWeight: 'bold', fontSize: '1rem', mb: 0.5 }}>
                    Fitness Score:
                  </Typography>
                  <Typography 
                    sx={{ 
                      fontSize: '1.1rem',
                      color: trainData.fitness_score >= 8 ? '#4caf50' : 
                             trainData.fitness_score >= 6 ? '#ff9800' : '#f44336'
                    }}
                  >
                    {trainData.fitness_score}
                  </Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography sx={{ fontWeight: 'bold', fontSize: '1rem', mb: 0.5 }}>
                    Last Maintenance:
                  </Typography>
                  <Typography sx={{ fontSize: '1.1rem' }}>
                    {trainData.last_maintenance_date}
                  </Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography sx={{ fontWeight: 'bold', fontSize: '1rem', mb: 0.5 }}>
                    Maintenance Due:
                  </Typography>
                  <Typography 
                    sx={{ 
                      fontSize: '1.1rem',
                      color: trainData.maintenance_due ? '#f44336' : '#4caf50'
                    }}
                  >
                    {trainData.maintenance_due ? "Yes" : "No"}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box sx={{ mb: 2 }}>
                  <Typography sx={{ fontWeight: 'bold', fontSize: '1rem', mb: 0.5 }}>
                    Needs Cleaning:
                  </Typography>
                  <Typography 
                    sx={{ 
                      fontSize: '1.1rem',
                      color: trainData.needs_cleaning ? '#f44336' : '#4caf50'
                    }}
                  >
                    {trainData.needs_cleaning ? "Yes" : "No"}
                  </Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography sx={{ fontWeight: 'bold', fontSize: '1rem', mb: 0.5 }}>
                    Branding Active:
                  </Typography>
                  <Typography sx={{ fontSize: '1.1rem' }}>
                    {trainData.branding_active}
                  </Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography sx={{ fontWeight: 'bold', fontSize: '1rem', mb: 0.5 }}>
                    Branding Company:
                  </Typography>
                  <Typography sx={{ fontSize: '1.1rem' }}>
                    {trainData.branding_company || 'N/A'}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          )}
        </Box>
      </Modal>
    </>
  );
};

export default SearchCard;
