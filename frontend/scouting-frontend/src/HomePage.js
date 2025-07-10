import React from 'react';
import ArrowBack from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import { Box, Paper, Typography, Button, Grid } from '@mui/material';

function HomePage() {
  const navigate = useNavigate();

  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="70vh">
      <Typography variant="h4" fontWeight={700} mb={4} color="primary">
        Benvenuto! Scegli una sezione
      </Typography>
      <Grid container spacing={4} justifyContent="center">
        <Grid item>
          <Paper elevation={4} sx={{ p: 8, minWidth: 420, minHeight: 300, maxWidth: 500, textAlign: 'center', borderRadius: 5, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', boxShadow: 8 }}>
            <Typography variant="h5" mb={3} fontWeight={700}>Note e Referti</Typography>
            <Typography variant="body1" mb={4}>Carica e consulta file per annata</Typography>
            <Button variant="contained" color="primary" size="large" sx={{ fontSize: '1.2rem', py: 2, px: 4 }} onClick={() => navigate('/notereferti')}>
              Vai a Note e Referti
            </Button>
          </Paper>
        </Grid>
        <Grid item>
          <Paper elevation={4} sx={{ p: 8, minWidth: 420, minHeight: 300, maxWidth: 500, textAlign: 'center', borderRadius: 5, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', boxShadow: 8 }}>
            <Typography variant="h5" mb={3} fontWeight={700}>Scouting</Typography>
            <Typography variant="body1" mb={4}>Accedi alla dashboard di scouting</Typography>
            <Button variant="contained" color="secondary" size="large" sx={{ fontSize: '1.2rem', py: 2, px: 4 }} onClick={() => navigate('/dashboard')}>
              Vai a Scouting
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default HomePage; 