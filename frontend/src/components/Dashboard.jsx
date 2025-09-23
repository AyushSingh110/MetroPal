import React, { useState, useEffect } from "react";
import { Box, Grid, Card, CardContent, Typography, Alert, Chip } from "@mui/material";
import SearchCard from "./SearchCard";
import RouteVisualizer from "./RouteVisualizer";
import OptimizationSliders from "./OptimizationSliders";
import TrainInventory from "./TrainInventory";
import PerformanceCard from "./Performance";
import AutoDraft from "./AutoDraft";

const Dashboard = () => {
  const [dashboardStats, setDashboardStats] = useState({
    totalTrains: 25,
    availableTrains: 15,
    maintenanceDue: 3,
    pendingTasks: 12
  });
  
  const [optimizationResult, setOptimizationResult] = useState(null);
  const [recentConflicts, setRecentConflicts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch dashboard data on component mount
  useEffect(() => {
    fetchDashboardData();
    fetchRecentConflicts();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch current train data
      const response = await fetch('/api/full_trains');
      const trainData = await response.json();
      
      if (trainData && Array.isArray(trainData)) {
        const stats = calculateStats(trainData);
        setDashboardStats(stats);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentConflicts = async () => {
    try {
      const response = await fetch('/api/conflicts');
      const conflicts = await response.json();
      setRecentConflicts(conflicts.slice(0, 3)); // Show only recent 3
    } catch (error) {
      console.error('Error fetching conflicts:', error);
    }
  };

  const calculateStats = (trainData) => {
    const totalTrains = trainData.length;
    const availableTrains = trainData.filter(train => 
      train.recommended_action === "Revenue Service"
    ).length;
    const maintenanceDue = trainData.filter(train => 
      train.maintenance_due || train.job_card_status === "Open"
    ).length;
    const pendingTasks = trainData.filter(train => 
      train.needs_cleaning || train.maintenance_due
    ).length;

    return {
      totalTrains,
      availableTrains,
      maintenanceDue,
      pendingTasks
    };
  };

  const handleOptimizationResult = (result) => {
    setOptimizationResult(result);
    
    // Update dashboard stats based on optimization result
    if (result && result.summary) {
      setDashboardStats(prev => ({
        ...prev,
        availableTrains: result.summary.service_assigned + result.summary.standby_assigned
      }));
    }
    
    // Refresh conflicts
    fetchRecentConflicts();
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return '#f44336';
      case 'medium': return '#ff9800';
      case 'low': return '#2196f3';
      default: return '#757575';
    }
  };

  const StatCard = ({ title, value, loading, color = 'whitesmoke' }) => (
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
          {title}
        </Typography>
        <Typography 
          variant="h3" 
          sx={{ 
            fontWeight: 'bold', 
            textAlign: 'center', 
            marginTop: 2,
            color: loading ? '#525356' : color
          }}
        >
          {loading ? '...' : value}
        </Typography>
      </CardContent>
    </Card>
  );

  return (
    <div>
      <Box sx={{ padding: '20px' }}>
        <Grid container spacing={3}>
          {/* Stats Cards Row */}
          <Grid item xs={12} container spacing={3} justifyContent="space-between">
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Total Trains"
                value={dashboardStats.totalTrains}
                loading={loading}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Available Trains"
                value={dashboardStats.availableTrains}
                loading={loading}
                color={dashboardStats.availableTrains > 10 ? '#4caf50' : '#ff9800'}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Maintenance Due"
                value={dashboardStats.maintenanceDue}
                loading={loading}
                color={dashboardStats.maintenanceDue > 5 ? '#f44336' : '#ff9800'}
              />
            </Grid>

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
                    Active Conflicts
                  </Typography>
                  <Typography 
                    variant="h3" 
                    sx={{ 
                      fontWeight: 'bold', 
                      textAlign: 'center', 
                      marginTop: 2,
                      color: recentConflicts.length > 0 ? '#f44336' : '#4caf50'
                    }}
                  >
                    {optimizationResult?.summary?.conflicts_found || 0}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Recent Conflicts Alert */}
          {recentConflicts.length > 0 && (
            <Grid item xs={12}>
              <Alert 
                severity="warning" 
                sx={{ 
                  backgroundColor: '#2d1f1b', 
                  color: '#ff9800',
                  border: '1px solid #ff9800'
                }}
              >
                <Typography variant="subtitle1" sx={{ marginBottom: 1, fontWeight: 'bold' }}>
                  Recent Optimization Conflicts:
                </Typography>
                {recentConflicts.map((conflictData, index) => (
                  <Box key={index} sx={{ marginBottom: 1 }}>
                    <Typography variant="body2" sx={{ color: '#525356', marginBottom: 0.5 }}>
                      {conflictData.date} - {conflictData.conflicts?.length || 0} conflicts detected
                    </Typography>
                    {conflictData.conflicts?.slice(0, 2).map((conflict, cIndex) => (
                      <Box key={cIndex} sx={{ marginLeft: 2, marginBottom: 0.5 }}>
                        <Chip
                          label={conflict.severity}
                          size="small"
                          sx={{
                            backgroundColor: getSeverityColor(conflict.severity),
                            color: 'white',
                            marginRight: 1,
                            fontSize: '0.75rem'
                          }}
                        />
                        <Typography variant="caption" sx={{ color: '#ff9800' }}>
                          {conflict.train_id}: {conflict.issue.substring(0, 50)}...
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                ))}
              </Alert>
            </Grid>
          )}

          {/* Current Optimization Result */}
          {optimizationResult && (
            <Grid item xs={12}>
              <Card
                sx={{
                  backgroundColor: '#1a1d23',
                  color: 'whitesmoke',
                  borderRadius: 3,
                  border: '1px solid #4caf50',
                  boxShadow: 3,
                  padding: 2
                }}
              >
                <CardContent>
                  <Typography variant="h6" sx={{ color: '#4caf50', marginBottom: 2 }}>
                    Latest Optimization - {optimizationResult.date}
                  </Typography>
                  
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={8}>
                      <Typography variant="body1" sx={{ color: '#525356', marginBottom: 1 }}>
                        Assignment Summary:
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                        <Chip 
                          label={`${optimizationResult.summary?.service_assigned || 0} Service`}
                          sx={{ backgroundColor: '#4caf50', color: 'white' }}
                        />
                        <Chip 
                          label={`${optimizationResult.summary?.standby_assigned || 0} Standby`}
                          sx={{ backgroundColor: '#2196f3', color: 'white' }}
                        />
                        <Chip 
                          label={`${optimizationResult.summary?.ibl_assigned || 0} IBL`}
                          sx={{ backgroundColor: '#757575', color: 'white' }}
                        />
                        {optimizationResult.summary?.conflicts_found > 0 && (
                          <Chip 
                            label={`${optimizationResult.summary.conflicts_found} Conflicts`}
                            sx={{ backgroundColor: '#f44336', color: 'white' }}
                          />
                        )}
                      </Box>
                    </Grid>
                    
                    <Grid item xs={12} md={4}>
                      {optimizationResult.summary?.avg_service_score && (
                        <Box sx={{ textAlign: 'right' }}>
                          <Typography variant="body2" sx={{ color: '#525356' }}>
                            Avg Service Score:
                          </Typography>
                          <Typography variant="h5" sx={{ color: '#4caf50', fontWeight: 'bold' }}>
                            {(optimizationResult.summary.avg_service_score * 100).toFixed(1)}%
                          </Typography>
                        </Box>
                      )}
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          )}

          {/* Main Content Area */}
          <Grid item xs={12} container spacing={7}>
            <Grid item xs={12} md={6}>
              <Grid container spacing={3} direction="column">
                <Grid item xs={12}>
                  <SearchCard />
                </Grid>

                <Grid item xs={12}>
                  <OptimizationSliders onOptimizationResult={handleOptimizationResult} />
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12} md={6}>
              <RouteVisualizer optimizationData={optimizationResult} />
            </Grid>
          </Grid>
          
          <Grid container spacing={5}>
            <Grid item xs={12} md={6}>
              <TrainInventory optimizationData={optimizationResult} />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Grid container spacing={2} direction="column">
                <Grid item xs={12}>
                  <AutoDraft optimizationData={optimizationResult} />
                </Grid>

                <Grid item xs={12}>
                  <PerformanceCard optimizationData={optimizationResult} />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default Dashboard;