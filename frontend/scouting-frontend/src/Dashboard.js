import React from 'react';
import { Box, Typography, Button, Stack, Paper } from '@mui/material';
import { Link } from 'react-router-dom';

function Dashboard() {
  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
      <Paper elevation={3} sx={{ p: 4, minWidth: 350 }}>
        <Typography variant="h4" mb={2} color="primary">Benvenuto in Scouting Calcio</Typography>
        <Typography variant="body1" mb={3}>
          Gestisci e ricerca i giocatori segnalati e visionati in modo semplice e veloce.
        </Typography>
        <Stack spacing={2}>
          <Button variant="contained" color="primary" component={Link} to="/segnalati">Vai a Segnalati</Button>
          <Button variant="contained" color="primary" component={Link} to="/visionati">Vai a Visionati</Button>
          <Button variant="outlined" color="primary" component={Link} to="/ricerca">Ricerca Giocatori</Button>
        </Stack>
      </Paper>
    </Box>
  );
}

export default Dashboard; 