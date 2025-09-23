import React, { useState } from "react";
import { Box, Grid, Card, CardContent, Typography, Modal, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,LinearProgress } from "@mui/material";

const trains = [
  { id: 'T001', fleet: 'A', status: 'Maintenance', mileage: 11303, route: 'Route 3', score: 92 },
  { id: 'T002', fleet: 'B', status: 'Telecom', mileage: 23683, route: 'Route 4', score: 54 },
  { id: 'T003', fleet: 'C', status: 'Ready', mileage: 66752, route: 'Route 2', score: 68 },
  { id: 'T004', fleet: 'D', status: 'Telecom', mileage: 82142, route: 'Route 4', score: 4 },
  { id: 'T005', fleet: 'A', status: 'Telecom', mileage: 105882, route: 'Route 4', score: 64 },
  { id: 'T006', fleet: 'B', status: 'Conflict', mileage: 33328, route: 'Route 4', score: 32 },
  { id: 'T007', fleet: 'C', status: 'Cleaning', mileage: 101142, route: 'Route 5', score: 11 },
];
const TrainIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21.291 10.375c.094-.654.148-1.32.148-2.001 0-3.955-3.21-7.165-7.166-7.165-3.955 0-7.166 3.21-7.166 7.165 0 .681.054 1.347.148 2.001H.699c-.386 0-.699.313-.699.699v5.021c0 .386.313.699.699.699h2.301v2.853c0 .386.313.699.699.699h3c.386 0 .699-.313.699-.699v-2.853h6c.386 0 .699-.313.699-.699v-2.853h2.301c.386 0 .699-.313.699-.699v-5.021c0-.386-.313-.699-.699-.699h-2.301zM11.966 12.001c-1.38 0-2.5-1.12-2.5-2.5 0-1.381 1.12-2.5 2.5-2.5 1.381 0 2.5 1.119 2.5 2.5 0 1.38-1.119 2.5-2.5 2.5zm4.848-2.5c0-1.381 1.12-2.5 2.5-2.5 1.381 0 2.5 1.119 2.5 2.5 0 1.38-1.119 2.5-2.5 2.5s-2.5-1.12-2.5-2.5z" />
  </svg>
);
const TrainInventory = () => {
  const [selectedTrain, setSelectedTrain] = useState(null);

  const handleRowClick = (train) => {
    setSelectedTrain(train);
  };
  const handleCloseModal = () => {
    setSelectedTrain(null);
  };

  return (
    <Box sx={{ padding: '20px' }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card sx={{ backgroundColor: '#1a1d23', color: 'whitesmoke',marginTop:4,marginLeft:[-2],borderRadius:3,width:'750px',margin:'auto',border: '1px solid #f6a33dff',boxShadow: 3,}}>
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <TrainIcon />
                    <Typography variant="h6" sx={{ fontWeight: "bold", marginLeft: 1 }}>
                        Train Inventory
                    </Typography>
                </Box>

              {/* Table inside the Card */}
              <TableContainer component={Paper} sx={{marginTop:3}}>
                <Table sx={{ minWidth: 650 ,backgroundColor:'#494d53ff'}} aria-label="Train Inventory">
                  <TableHead>
                    <TableRow>
                      <TableCell>Train ID</TableCell>
                      <TableCell>Fleet</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Mileage</TableCell>
                      <TableCell>Route</TableCell>
                      <TableCell>Score</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {trains.map((train) => (
                      <TableRow
                        key={train.id}
                        hover
                        onClick={() => handleRowClick(train)}
                        sx={{ cursor: "pointer", backgroundColor: '#595a5dff',opacity:1,color:'whitesmoke' }} 
                      >
                        <TableCell sx={{fontWeight:'bold'}}>{train.id}</TableCell>
                        <TableCell sx={{fontWeight:'bold'}}>{train.fleet}</TableCell>
                        <TableCell sx={{fontWeight:'bold'}}>{train.status}</TableCell>
                        <TableCell sx={{fontWeight:'bold'}}>{train.mileage}</TableCell>
                        <TableCell sx={{fontWeight:'bold'}}>{train.route}</TableCell>
                        <TableCell sx={{fontWeight:'bold'}}>{train.score}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Modal to show train details */}
      <Modal open={!!selectedTrain} onClose={handleCloseModal}>
        <Box sx={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          bgcolor: '#1a1d23', borderRadius: 2, padding: 4, width: '600px', boxShadow: 24,border: '2px solid #f58d0eff',
        }}>
          <Typography variant="h5" sx={{ marginBottom: 2, color: 'whitesmoke' }}>
            Train {selectedTrain?.id} Details
          </Typography>

          
          <Grid container spacing={7}>
            
            <Grid item xs={12} sm={6}>
              <Typography variant="h6" sx={{ color: 'whitesmoke' }}>
                <strong>Fleet:</strong> {selectedTrain?.fleet}
              </Typography>
              <Typography variant="h6" sx={{ color: 'whitesmoke' }}>
                <strong>Mileage:</strong> {selectedTrain?.mileage}
              </Typography>
              <Typography variant="h6" sx={{ color: 'whitesmoke' }}>
                <strong>Last Cleaning: 8:30</strong> {selectedTrain?.lastCleaning}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="h6" sx={{ color: 'whitesmoke' }}>
                <strong>Status:</strong> {selectedTrain?.status}
              </Typography>
              <Typography variant="h6" sx={{ color: 'whitesmoke' }}>
                <strong>Telecom:</strong> {selectedTrain?.telecom}
              </Typography>
              <Typography variant="h6" sx={{ color: 'whitesmoke' }}>
                <strong>Route:</strong> {selectedTrain?.route}
              </Typography>
            </Grid>
          </Grid>

          <Typography variant="h6" sx={{ color: 'whitesmoke', marginTop: 2 }}>
            <strong>Assignment Score:</strong>
          </Typography>
          <LinearProgress variant="determinate" value={selectedTrain?.score} sx={{ marginBottom: 2, backgroundColor: '#444444', 
              "& .MuiLinearProgress-bar": {
                backgroundColor: '#f8a200', 
              } 
            }} />
          <Typography sx={{ color: 'whitesmoke', textAlign: 'right' }}>
            {selectedTrain?.score}%
          </Typography>

          <Button variant="outlined" sx={{ marginTop: 2, marginRight: 2 }} onClick={handleCloseModal}>
            Override Assignment
          </Button>
          <Button variant="contained" sx={{ marginTop: 2,backgroundColor: '#f8a200', 
              '&:hover': {
                backgroundColor: '#f8a200',
              } 
            }} onClick={handleCloseModal}>
            View History
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default TrainInventory;
