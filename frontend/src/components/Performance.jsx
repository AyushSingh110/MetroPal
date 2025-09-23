import React from "react";
import { Card, CardContent, Typography, Box, Grid } from "@mui/material";

const PerformanceCard = () => {
  return (
    <Card
      sx={{
        backgroundColor: '#1a1d23',
        color: 'whitesmoke',
        borderRadius: 3,
        boxShadow: 3,
        p: 2,
        mt: 3,
        width:'500px',
        margin:'auto',
        marginTop:6,
        ml:0,
        border: '1px solid #f6a33dff',
      }}
    >
      
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
       
        <Box sx={{ fontSize: '1.5rem', mr: 1, color: '#f26e2e' }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          Performance Insights
        </Typography>
      </Box>

      {/* Main Content Grid */}
      <Grid container spacing={4}>
        
        <Grid item xs={4}>
          <Typography variant="body1" sx={{ color: '#a0a0a0' }}>
            Punctuality
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#68df84', mt: 1 }}>
            94.2%
          </Typography>
          <Typography variant="body2" sx={{ color: '#68df84', mt: 0.5 }}>
            +2.1% vs yesterday
          </Typography>
        </Grid>

        <Grid item xs={4}>
          <Typography variant="body1" sx={{ color: '#a0a0a0' }}>
            Branding
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#f26e2e', mt: 1 }}>
            91.7%
          </Typography>
          <Typography variant="body2" sx={{ color: '#f26e2e', mt: 0.5 }}>
            -0.3% vs yesterday
          </Typography>
        </Grid>

        <Grid item xs={4}>
          <Typography variant="body1" sx={{ color: '#a0a0a0' }}>
            Efficiency
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#f2e663', mt: 1 }}>
            87.9%
          </Typography>
          <Typography variant="body2" sx={{ color: '#f2e663', mt: 0.5 }}>
            +1.4% vs yesterday
          </Typography>
        </Grid>
      </Grid>
    </Card>
  );
};

export default PerformanceCard;