import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Button, Typography, Container, Box, CssBaseline } from '@mui/material';

import Products from "./pages/Products";
import Dashboard from "./pages/Dashboard";
import RawMaterials from "./pages/RawMaterials";
import ProductForm from "./pages/ProductForm"; 

function App() {
  return (
    <BrowserRouter>
      <CssBaseline /> 
      <Box sx={{ flexGrow: 1 }}>
        
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Production Control
            </Typography>
            
            <Button color="inherit" component={Link} to="/">Dashboard</Button>
            <Button color="inherit" component={Link} to="/products">Produtos</Button>
            <Button color="inherit" component={Link} to="/materials">Matérias-Primas</Button>
          </Toolbar>
        </AppBar>

        <Container sx={{ mt: 4 }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/new" element={<ProductForm />} /> 
            <Route path="/materials" element={<RawMaterials />} />
          </Routes>
        </Container>

      </Box>
    </BrowserRouter>
  );
}

export default App;