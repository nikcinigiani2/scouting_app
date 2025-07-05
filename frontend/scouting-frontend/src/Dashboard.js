import React from 'react';
import { Box, Typography, Button, Stack, Paper, Grid } from '@mui/material';
import { Link } from 'react-router-dom';
import { 
  PersonAdd, 
  Visibility, 
  Search, 
  Dashboard as DashboardIcon 
} from '@mui/icons-material';
import logoFloria from './assets/logo_floria.png';

function Dashboard() {
  return (
    <Box maxWidth={1200} mx="auto" mt={4} sx={{ background: 'linear-gradient(135deg, #004080 0%, #1565c0 100%)', borderRadius: 3, boxShadow: 2 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box textAlign="center" mb={4}>
          <img src={logoFloria} alt="Logo Floria" style={{ width: 100, marginBottom: 16 }} />
          <Typography variant="h4" mb={2} color="primary" fontWeight="bold">
            Floria Scouting Manager
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
            Gestisci e ricerca i giocatori segnalati e visionati in modo semplice e veloce.
            Utilizza le funzionalità qui sotto per navigare nell'applicazione.
          </Typography>
        </Box>
        
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <Paper 
              elevation={2} 
              sx={{ 
                p: 3, 
                textAlign: 'center',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 24px rgba(0, 64, 128, 0.15)',
                }
              }}
            >
              <Box>
                <PersonAdd sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" mb={2} color="primary">
                  Giocatori Segnalati
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={3}>
                  Aggiungi e gestisci i giocatori che hai segnalato durante i match.
                </Typography>
              </Box>
              <Button 
                variant="contained" 
                color="primary" 
                component={Link} 
                to="/segnalati"
                fullWidth
                startIcon={<PersonAdd />}
              >
                Vai a Segnalati
              </Button>
            </Paper>
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <Paper 
              elevation={2} 
              sx={{ 
                p: 3, 
                textAlign: 'center',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 24px rgba(0, 64, 128, 0.15)',
                }
              }}
            >
              <Box>
                <Visibility sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" mb={2} color="primary">
                  Giocatori Visionati
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={3}>
                  Visualizza e modifica i giocatori che hai visionato in dettaglio.
                </Typography>
              </Box>
              <Button 
                variant="contained" 
                color="primary" 
                component={Link} 
                to="/visionati"
                fullWidth
                startIcon={<Visibility />}
              >
                Vai a Visionati
              </Button>
            </Paper>
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <Paper 
              elevation={2} 
              sx={{ 
                p: 3, 
                textAlign: 'center',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 24px rgba(0, 64, 128, 0.15)',
                }
              }}
            >
              <Box>
                <Search sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" mb={2} color="primary">
                  Ricerca Giocatori
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={3}>
                  Cerca tra tutti i giocatori con filtri avanzati e dettagli completi.
                </Typography>
              </Box>
              <Button 
                variant="outlined" 
                color="primary" 
                component={Link} 
                to="/ricerca"
                fullWidth
                startIcon={<Search />}
              >
                Ricerca Giocatori
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}

export default Dashboard; 