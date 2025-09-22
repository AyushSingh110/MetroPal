import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { AccountCircle } from '@mui/icons-material';

function Header() {
  const [selectedDay, setSelectedDay] = useState('Today');

  const handleDayChange = (event, newDay) => {
    if (newDay !== null) {
      setSelectedDay(newDay); 
    }
  };

  return (
    <AppBar position="sticky" sx={{ backgroundColor: 'black', color: '#fa9315ff', borderBottom: '2px solid #f8b057ff'}}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" sx={{ top: 0, zIndex: 1100 }}>
          MetroPal
        </Typography>
    
        <ToggleButtonGroup
          value={selectedDay}
          exclusive
          onChange={handleDayChange}
          aria-label="day selection"
          sx={{ '& .MuiToggleButton-root': {
            backgroundColor: '#f7941cff',
            color: 'whitesmoke',
            border : '1px solid #f8b057ff',
            '&.Mui-selected': {
                backgroundColor: 'black', // Selected button color
                color: 'whitesmoke',
            }
          }}}
        >
          <ToggleButton value="Today" aria-label="Today">
            Today
          </ToggleButton>
          <ToggleButton value="Tomorrow" aria-label="Tomorrow">
            Tomorrow
          </ToggleButton>
        </ToggleButtonGroup>
        
        <Button color="inherit">Export Plan</Button>
        <Button color="inherit">Download CSV</Button>
        <IconButton color="inherit">
          <AccountCircle />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
