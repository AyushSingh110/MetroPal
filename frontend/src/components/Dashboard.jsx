import React from "react";
import { Box, Grid, Card, CardContent, Typography } from "@mui/material";
import SearchCard from "./SearchCard";
import RouteVisualizer from "./RouteVisualizer";
import OptimizationSliders from "./optimizationSliders";
import TrainInventory from "./TrainInventory";
import PerformanceCard from "./Performance";

const Dashboard = () => {
  return (
    <div>
      <Box sx={{ padding: '20px' }}>
        <Grid container spacing={3}>
          <Grid item xs={12} container spacing={3} justifyContent="space-between">
            {/* card1 */}
            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  backgroundColor: '#1a1d23',
                  color: 'whitesmoke',
                  height: '200px',
                  width: '350px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  borderRadius: 3,
                  border: '1px solid #f6a33dff',
                  boxShadow: 3,
                }}
              >
                <CardContent sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', textAlign: 'left' }}>
                    Total Trains
                  </Typography>
                  <Typography variant="h3" sx={{ fontWeight: 'bold', textAlign: 'center', marginTop: 2 }}>
                    25
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* card2 */}
            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  backgroundColor: '#1a1d23',
                  color: 'whitesmoke',
                  height: '200px',
                  width: '350px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  borderRadius: 3,
                  border: '1px solid #f6a33dff',
                  boxShadow: 3,
                }}
              >
                <CardContent sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', textAlign: 'left' }}>
                    Available Trains
                  </Typography>
                  <Typography variant="h3" sx={{ fontWeight: 'bold', textAlign: 'center', marginTop: 2 }}>
                    15
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* card3 */}
            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  backgroundColor: '#1a1d23',
                  color: 'whitesmoke',
                  height: '200px',
                  width: '350px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  borderRadius: 3,
                  border: '1px solid #f6a33dff',
                  boxShadow: 3,
                }}
              >
                <CardContent sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', textAlign: 'left' }}>
                    Maintenance Due
                  </Typography>
                  <Typography variant="h3" sx={{ fontWeight: 'bold', textAlign: 'center', marginTop: 2 }}>
                    3
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* card4 */}
            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  backgroundColor: '#1a1d23',
                  color: 'whitesmoke',
                  height: '200px',
                  width: '300px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  borderRadius: 3,
                  border: '1px solid #f6a33dff', 
                  boxShadow: 3, 
                }}
              >
                <CardContent sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', textAlign: 'left' }}>
                    Pending Tasks
                  </Typography>
                  <Typography variant="h3" sx={{ fontWeight: 'bold', textAlign: 'center', marginTop: 2 }}>
                    12
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Main Content Area */}
          <Grid item xs={12} container spacing={7}>
            <Grid item xs={12} md={6}>
              <Grid container spacing={3} direction="column">
                <Grid item xs={12}>
                  <SearchCard />
                </Grid>

                <Grid item xs={12}>
                  <OptimizationSliders />
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12} md={6}>
              <RouteVisualizer />
            </Grid>
          </Grid>
          <Grid container spacing={5}>
            <Grid item xs={12} md={6}>
              <TrainInventory />
            </Grid>

            <Grid item xs={12} md={6}>
              <PerformanceCard /> 
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default Dashboard;
