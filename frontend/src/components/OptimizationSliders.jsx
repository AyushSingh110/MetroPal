import React, { useState } from "react";
import { Card, CardContent, Typography, Slider, Grid , Box} from "@mui/material";

const SettingsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.39a2 2 0 0 0 .73 2.73l.15.08a2 2 0 0 1 1 1.74v.44a2 2 0 0 1-1 1.73l-.15.08a2 2 0 0 0-.73 2.73l.22.39a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.44a2 2 0 0 1 1-1.73l.15-.08a2 2 0 0 0 .73-2.73l-.22-.39a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const OptimizationSliders = () => {
  const [punctuality, setPunctuality] = useState(80);
  const [maintenance, setMaintenance] = useState(60);
  const [cleaning, setCleaning] = useState(65);
  const [branding, setBranding] = useState(80);
  const [mileage, setMileage] = useState(50);
  const [telecom, setTelecom] = useState(85);

  return (
    <Card
      sx={{
        backgroundColor: "#1a1d23",
        color: "whitesmoke",
        padding: 3,
        borderRadius: 5,
        width: "600px", 
        margin: "auto", 
        border: '1px solid #f6a33dff',
        boxShadow: 3,
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <SettingsIcon />
          <Typography variant="h6" sx={{ fontWeight: "bold", marginLeft: 1 }}>
            Optimization Weights
          </Typography>
        </Box>
        <Typography variant="body1" sx={{ color: "#525356", marginBottom: 3 }}>
          Adjust factors to influence train routes assignment
        </Typography>

        <Grid container spacing={19}>
          {/* Left Column */}
          <Grid item xs={12} sm={6}>
            <Typography sx={{ color: "whitesmoke", fontWeight: "bold" }}>Punctuality</Typography>
            <Slider
              value={punctuality}
              onChange={(e, newValue) => setPunctuality(newValue)}
              min={0}
              max={100}
              valueLabelDisplay="auto"
              sx={{
                marginTop: 1,
                color: "#f7941c",
                "& .MuiSlider-rail": { backgroundColor: "#3e2723" },
                "& .MuiSlider-thumb": { backgroundColor: "#f7941c", width: 18, height: 18 },
                "& .MuiSlider-valueLabel": { backgroundColor: "#f7941c", borderRadius: 2 },
                width: "100%", 
              }}
            />

            <Typography sx={{ color: "whitesmoke", fontWeight: "bold" }}>Maintenance</Typography>
            <Slider
              value={maintenance}
              onChange={(e, newValue) => setMaintenance(newValue)}
              min={0}
              max={100}
              valueLabelDisplay="auto"
              sx={{
                marginTop: 1,
                color: "#f7941c",
                "& .MuiSlider-rail": { backgroundColor: "#3e2723" },
                "& .MuiSlider-thumb": { backgroundColor: "#f7941c", width: 18, height: 18 },
                "& .MuiSlider-valueLabel": { backgroundColor: "#f7941c", borderRadius: 2 },
                width: "100%", // Make the slider take up full width
              }}
            />

            <Typography sx={{ color: "whitesmoke", fontWeight: "bold" }}>Cleaning Readiness</Typography>
            <Slider
              value={cleaning}
              onChange={(e, newValue) => setCleaning(newValue)}
              min={0}
              max={100}
              valueLabelDisplay="auto"
              sx={{
                marginTop: 1,
                color: "#f7941c",
                "& .MuiSlider-rail": { backgroundColor: "#3e2723" },
                "& .MuiSlider-thumb": { backgroundColor: "#f7941c", width: 18, height: 18 },
                "& .MuiSlider-valueLabel": { backgroundColor: "#f7941c", borderRadius: 2 },
                width: "100%", // Make the slider take up full width
              }}
            />
          </Grid>

          {/* Right Column */}
          <Grid item xs={12} sm={6}>
            <Typography sx={{ color: "whitesmoke", fontWeight: "bold" }}>Branding</Typography>
            <Slider
              value={branding}
              onChange={(e, newValue) => setBranding(newValue)}
              min={0}
              max={100}
              valueLabelDisplay="auto"
              sx={{
                marginTop: 1,
                color: "#f7941c",
                "& .MuiSlider-rail": { backgroundColor: "#3e2723" },
                "& .MuiSlider-thumb": { backgroundColor: "#f7941c", width: 18, height: 18 },
                "& .MuiSlider-valueLabel": { backgroundColor: "#f7941c", borderRadius: 2 },
                width: "100%", // Make the slider take up full width
              }}
            />

            <Typography sx={{ color: "whitesmoke", fontWeight: "bold" }}>Mileage Balance</Typography>
            <Slider
              value={mileage}
              onChange={(e, newValue) => setMileage(newValue)}
              min={0}
              max={100}
              valueLabelDisplay="auto"
              sx={{
                marginTop: 1,
                color: "#f7941c",
                "& .MuiSlider-rail": { backgroundColor: "#3e2723" },
                "& .MuiSlider-thumb": { backgroundColor: "#f7941c", width: 18, height: 18 },
                "& .MuiSlider-valueLabel": { backgroundColor: "#f7941c", borderRadius: 2 },
                width: "100%", // Make the slider take up full width
              }}
            />

            <Typography sx={{ color: "whitesmoke", fontWeight: "bold" }}>Telecom Readiness</Typography>
            <Slider
              value={telecom}
              onChange={(e, newValue) => setTelecom(newValue)}
              min={0}
              max={100}
              valueLabelDisplay="auto"
              sx={{
                marginTop: 1,
                color: "#f7941c",
                "& .MuiSlider-rail": { backgroundColor: "#3e2723" },
                "& .MuiSlider-thumb": { backgroundColor: "#f7941c", width: 18, height: 18 },
                "& .MuiSlider-valueLabel": { backgroundColor: "#f7941c", borderRadius: 2 },
                width: "100%", // Make the slider take up full width
              }}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default OptimizationSliders;
