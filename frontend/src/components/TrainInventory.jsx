import React from "react";
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper,
  Chip,
  TextField,
  Grid,
  Collapse,
  IconButton,
  Alert,
  CircularProgress,
  Tooltip,
  Modal,
  LinearProgress,
} from "@mui/material";

const CalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

const ExpandMoreIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6,9 12,15 18,9"></polyline>
  </svg>
);

const RefreshIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23,4 23,10 17,10"></polyline>
    <polyline points="1,20 1,14 7,14"></polyline>
    <path d="m3.51,9a9,9 0 0 1 14.85-3.36L23,10M1,14l4.64,4.36A9,9 0 0 0 20.49,15"></path>
  </svg>
);

const TrainInventory = ({ optimizationData }) => {
  const [trains, setTrains] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedDate, setSelectedDate] = React.useState('');
  const [showFilters, setShowFilters] = React.useState(false);
  const [filterStatus, setFilterStatus] = React.useState('all');
  const [error, setError] = React.useState(null);
  const [selectedTrain, setSelectedTrain] = React.useState(null);

  React.useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setSelectedDate(today);
    fetchData();
  }, []);

  // Update display when optimization data changes
  React.useEffect(() => {
    if (optimizationData && optimizationData.plan) {
      updateTrainsWithOptimization(optimizationData.plan);
    }
  }, [optimizationData]);

  const fetchData = (date = null) => {
    setLoading(true);
    setError(null);
    
    let url = "http://localhost:5000/api/full_trains";
    if (date) url += `?date=${date}`;
    
    fetch(url)
      .then(r => {
        if (!r.ok) throw new Error(`HTTP error! status: ${r.status}`);
        return r.json();
      })
      .then(data => {
        setTrains(data || []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Fetch full trains failed", err);
        setError(err.message);
        setLoading(false);
      });
  };

  const updateTrainsWithOptimization = (optimizationPlan) => {
    setTrains(prevTrains => {
      const updatedTrains = prevTrains.map(train => {
        const assignment = optimizationPlan.find(p => p.train_id === train.train_id);
        return {
          ...train,
          optimized_assignment: assignment ? assignment.assignment : null,
          optimization_score: assignment ? assignment.score : null
        };
      });
      return updatedTrains;
    });
  };

   const handleRowClick = (train) => {
    setSelectedTrain(train);
  };

  const handleCloseModal = () => {
    setSelectedTrain(null);
  };

  const getStatusColor = (action) => {
    switch (action) {
      case 'Revenue Service': return '#4caf50';
      case 'Standby (Cleaning)': return '#2196f3';
      case 'Maintenance (IBL)': return '#f44336';
      default: return '#757575';
    }
  };

  const getAssignmentColor = (assignment) => {
    switch (assignment) {
      case 'Service': return '#4caf50';
      case 'Standby': return '#2196f3';
      case 'IBL': return '#757575';
      default: return '#9e9e9e';
    }
  };

  const getFitnessColor = (score) => {
    if (score > 0.8) return '#4caf50';
    if (score > 0.6) return '#ff9800';
    return '#f44336';
  };

  const filteredTrains = trains.filter(train => {
    if (filterStatus === 'all') return true;
    if (filterStatus === 'service') return train.recommended_action === 'Revenue Service';
    if (filterStatus === 'maintenance') return train.recommended_action === 'Maintenance (IBL)';
    if (filterStatus === 'cleaning') return train.recommended_action === 'Standby (Cleaning)';
    if (filterStatus === 'branded') return train.branding_active === 1;
    if (filterStatus === 'optimized') return train.optimized_assignment !== null;
    return true;
  });

  const getTrainStats = () => {
    const total = trains.length;
    const service = trains.filter(t => t.recommended_action === 'Revenue Service').length;
    const maintenance = trains.filter(t => t.recommended_action === 'Maintenance (IBL)').length;
    const cleaning = trains.filter(t => t.recommended_action === 'Standby (Cleaning)').length;
    const branded = trains.filter(t => t.branding_active === 1).length;
    const optimized = trains.filter(t => t.optimized_assignment).length;
    
    return { total, service, maintenance, cleaning, branded, optimized };
  };

  const stats = getTrainStats();

  return (
    <Box>
      <Card sx={{ 
        backgroundColor: '#1a1d23', 
        color: "whitesmoke", 
        borderRadius: 3, 
        border: '1px solid #f6a33dff', 
        boxShadow: 3,
        width:'800px',
        margin:'auto',
        marginTop:2
      }}>
        <CardContent>
          {/* Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Train Inventory
              </Typography>
              <Typography variant="body2" sx={{ color: '#525356' }}>
                {stats.total} trains • {stats.service} service • {stats.maintenance} maintenance • {stats.branded} branded
                {stats.optimized > 0 && ` • ${stats.optimized} optimized`}
              </Typography>
            </Box>
            <IconButton 
              onClick={() => setShowFilters(!showFilters)}
              sx={{ color: '#f7941c' }}
            >
              <ExpandMoreIcon />
            </IconButton>
          </Box>

          {/* Optimization Summary */}
          {optimizationData && (
            <Alert 
              severity="info" 
              sx={{ 
                mb: 2, 
                backgroundColor: '#1a2532', 
                color: '#2196f3',
                border: '1px solid #2196f3'
              }}
            >
              <Typography variant="body2">
                Latest Optimization ({optimizationData.date}): 
                {` ${optimizationData.summary?.service_assigned || 0} Service, `}
                {` ${optimizationData.summary?.standby_assigned || 0} Standby, `}
                {` ${optimizationData.summary?.ibl_assigned || 0} IBL`}
                {optimizationData.summary?.conflicts_found > 0 && 
                  ` • ${optimizationData.summary.conflicts_found} conflicts detected`
                }
              </Typography>
            </Alert>
          )}

          {/* Filters */}
          <Collapse in={showFilters}>
            <Box sx={{ mb: 3, p: 2, border: '1px solid #3e2723', borderRadius: 2 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Date"
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: '#3e2723' },
                        '&:hover fieldset': { borderColor: '#f7941c' },
                        '&.Mui-focused fieldset': { borderColor: '#f7941c' },
                      },
                      '& .MuiInputLabel-root': { color: '#525356' },
                      '& .MuiInputBase-input': { color: 'whitesmoke' },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {[
                      { key: 'all', label: 'All', count: stats.total },
                      { key: 'service', label: 'Service', count: stats.service },
                      { key: 'maintenance', label: 'Maintenance', count: stats.maintenance },
                      { key: 'cleaning', label: 'Cleaning', count: stats.cleaning },
                      { key: 'branded', label: 'Branded', count: stats.branded },
                      { key: 'optimized', label: 'Optimized', count: stats.optimized }
                    ].map(filter => (
                      <Chip
                        key={filter.key}
                        label={`${filter.label} (${filter.count})`}
                        onClick={() => setFilterStatus(filter.key)}
                        sx={{
                          backgroundColor: filterStatus === filter.key ? '#f7941c' : '#3e2723',
                          color: filterStatus === filter.key ? 'black' : 'whitesmoke',
                          '&:hover': { backgroundColor: '#f7941c', color: 'black' },
                          fontSize: '0.75rem'
                        }}
                      />
                    ))}
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Button
                    variant="contained"
                    onClick={() => fetchData(selectedDate)}
                    startIcon={loading ? <CircularProgress size={16} /> : <RefreshIcon />}
                    disabled={loading}
                    sx={{
                      backgroundColor: '#f7941c',
                      '&:hover': { backgroundColor: '#e68900' },
                      '&:disabled': { backgroundColor: '#3e2723' }
                    }}
                  >
                    {loading ? 'Loading...' : 'Load Data'}
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Collapse>

          {/* Error Display */}
          {error && (
            <Alert severity="error" sx={{ mb: 2, backgroundColor: '#2d1b1b', color: '#ff6b6b' }}>
              Error loading data: {error}
            </Alert>
          )}

          {/* Table */}
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
              <CircularProgress sx={{ color: '#f7941c' }} />
            </Box>
          ) : (
            <TableContainer 
              component={Paper} 
              sx={{ 
                maxHeight: 400, 
                backgroundColor: '#2a2d35',
                '& .MuiTableCell-root': { 
                  borderColor: '#3e2723',
                  color: 'whitesmoke'
                },
                '& .MuiTableHead-root .MuiTableCell-root': {
                  backgroundColor: '#1a1d23',
                  fontWeight: 'bold'
                }
              }}
            >
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Train ID</TableCell>
                    <TableCell>Current Status</TableCell>
                    {optimizationData && <TableCell>Optimized</TableCell>}
                    <TableCell>Fitness</TableCell>
                    <TableCell>Last Maintenance</TableCell>
                    <TableCell>Mileage</TableCell>
                    <TableCell>Branded</TableCell>
                    <TableCell>Cleaning</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredTrains.map(train => (
                    <TableRow 
                      key={train.train_id}
                      sx={{
                        '&:hover': { backgroundColor: '#3e2723' },
                        backgroundColor: train.optimized_assignment ? 'rgba(247, 148, 28, 0.1)' : 'transparent'
                      }}
                      onClick={() => handleRowClick(train)}
                    >
                      <TableCell sx={{ fontWeight: 'bold' }}>
                        {train.train_id}
                      </TableCell>
                      
                      <TableCell>
                        <Chip
                          label={train.recommended_action}
                          size="small"
                          sx={{
                            backgroundColor: getStatusColor(train.recommended_action),
                            color: 'white',
                            fontSize: '0.75rem'
                          }}
                        />
                      </TableCell>

                      {optimizationData && (
                        <TableCell>
                          {train.optimized_assignment ? (
                            <Tooltip title={`Score: ${train.optimization_score}`}>
                              <Chip
                                label={train.optimized_assignment}
                                size="small"
                                sx={{
                                  backgroundColor: getAssignmentColor(train.optimized_assignment),
                                  color: 'white',
                                  fontSize: '0.75rem'
                                }}
                              />
                            </Tooltip>
                          ) : (
                            <Typography variant="caption" sx={{ color: '#757575' }}>-</Typography>
                          )}
                        </TableCell>
                      )}

                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: getFitnessColor(train.fitness_score || 0),
                              fontWeight: 'bold'
                            }}
                          >
                            {train.fitness_score !== undefined 
                              ? (train.fitness_score * 100).toFixed(1) + '%'
                              : 'N/A'
                            }
                          </Typography>
                        </Box>
                      </TableCell>

                      <TableCell>
                        <Typography variant="body2">
                          {train.last_maintenance_date || 'N/A'}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Typography variant="body2">
                          {train.total_mileage ? train.total_mileage.toLocaleString() : 'N/A'} km
                        </Typography>
                        {train.mileage_since_maintenance && (
                          <Typography variant="caption" sx={{ color: '#757575', display: 'block' }}>
                            {train.mileage_since_maintenance.toLocaleString()} since maint.
                          </Typography>
                        )}
                      </TableCell>

                      <TableCell>
                        <Chip
                          label={train.branding_active === 1 ? 'Yes' : 'No'}
                          size="small"
                          sx={{
                            backgroundColor: train.branding_active === 1 ? '#4caf50' : '#757575',
                            color: 'white',
                            fontSize: '0.75rem'
                          }}
                        />
                        {train.branding_company && (
                          <Typography variant="caption" sx={{ color: '#757575', display: 'block' }}>
                            {train.branding_company}
                          </Typography>
                        )}
                      </TableCell>

                      <TableCell>
                        <Chip
                          label={train.needs_cleaning ? 'Needed' : 'Clean'}
                          size="small"
                          sx={{
                            backgroundColor: train.needs_cleaning ? '#ff9800' : '#4caf50',
                            color: 'white',
                            fontSize: '0.75rem'
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {/* Footer */}
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" sx={{ color: '#525356' }}>
              Showing {filteredTrains.length} of {stats.total} trains
            </Typography>
            <Button 
              variant="contained" 
              onClick={() => fetchData(selectedDate)}
              startIcon={<RefreshIcon />}
              sx={{ 
                backgroundColor: '#f8a200',
                '&:hover': { backgroundColor: '#e68900' }
              }}
            >
              Refresh
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Modal */}
      <Modal open={!!selectedTrain} onClose={handleCloseModal}>
        <Box sx={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          bgcolor: '#1a1d23', borderRadius: 2, padding: 4, width: '600px', boxShadow: 24, border: '2px solid #f58d0eff'
        }}>
          <Typography variant="h5" sx={{ color: 'whitesmoke', mb: 2 }}>
            Train {selectedTrain?.train_id} Details
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Typography sx={{ color: 'whitesmoke' }}><strong>Status:</strong> {selectedTrain?.recommended_action}</Typography>
              <Typography sx={{ color: 'whitesmoke' }}><strong>Mileage:</strong> {selectedTrain?.total_mileage}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography sx={{ color: 'whitesmoke' }}><strong>Branding:</strong> {selectedTrain?.branding_company || '-'}</Typography>
              <Typography sx={{ color: 'whitesmoke' }}><strong>Last Maintenance:</strong> {selectedTrain?.last_maintenance_date}</Typography>
            </Grid>
          </Grid>
          <Typography  variant="h6" sx={{ color: 'whitesmoke',mt:2 }}><strong>Fitness Score:</strong> {selectedTrain?.fitness_score !== undefined ? (selectedTrain.fitness_score*100).toFixed(1)+'%' : 'N/A'}</Typography>
          <LinearProgress variant="determinate" value={selectedTrain?.fitness_score ? selectedTrain.fitness_score*100 : 0} sx={{ mt: 2, mb: 1, bgcolor: '#444', '& .MuiLinearProgress-bar': { backgroundColor: '#f8a200' }}} />
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button variant="outlined" onClick={handleCloseModal}>Close</Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default TrainInventory;