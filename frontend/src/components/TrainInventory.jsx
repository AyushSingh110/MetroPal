import React from "react";
import { Box, Card, CardContent, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";

const TrainInventory = () => {
  const [trains, setTrains] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(()=>{
    fetchData();
  },[]);

  const fetchData = (d=null) => {
    setLoading(true);
    let url = "http://localhost:5000/api/full_trains";
    if (d) url += `?date=${d}`;
    fetch(url)
      .then(r=>r.json())
      .then(data=>{ 
        setTrains(data || []); 
        setLoading(false); 
      })
      .catch(err=>{ console.error("Fetch full trains failed", err); setLoading(false); });
  }

  return (
    <Box>
      <Card sx={{ backgroundColor: '#1a1d23', color: "whitesmoke", borderRadius: 3, border: '1px solid #f6a33dff', boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Train Inventory (Full dataset)</Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>Shows: train_id, recommended_action, fitness_score, last_maintenance_date, total_mileage, branding_active</Typography>
          {loading ? <div>Loading...</div> : (
            <TableContainer component={Paper} sx={{ maxHeight: 360 }}>
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Train ID</TableCell>
                    <TableCell>Recommended Action</TableCell>
                    <TableCell>Fitness Score</TableCell>
                    <TableCell>Last Maintenance</TableCell>
                    <TableCell>Total Mileage</TableCell>
                    <TableCell>Branding Active</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {trains.map(t => (
                    <TableRow key={t.train_id}>
                      <TableCell>{t.train_id}</TableCell>
                      <TableCell>{t.recommended_action}</TableCell>
                      <TableCell>{(t.fitness_score!==undefined)?t.fitness_score:t.fitness}</TableCell>
                      <TableCell>{t.last_maintenance_date}</TableCell>
                      <TableCell>{t.total_mileage}</TableCell>
                      <TableCell>{(t.branding_active===1 || t.branding_active===true) ? 'Yes' : 'No'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
          <Box sx={{ mt: 2 }}>
            <Button variant="contained" sx={{ backgroundColor: '#f8a200' }} onClick={()=>fetchData()}>Refresh</Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default TrainInventory;
