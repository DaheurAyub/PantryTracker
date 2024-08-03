"use client";

import { useState, useEffect } from 'react';
import { firestore } from '../firebase';
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  Modal,
  Stack,
  TextField,
  Typography,
  Card,
  CardContent,
  CardActions,
  Container
} from '@mui/material';
import { collection, query, getDocs, setDoc, doc, getDoc, deleteDoc } from 'firebase/firestore';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#FF5722', // Updated to match the autumn color
    },
    secondary: {
      main: '#F5F5F5',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
});

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [openAdd, setOpenAdd] = useState(false);
  const [openRemove, setOpenRemove] = useState(false);
  const [itemName, setItemName] = useState('');
  const [itemQuantity, setItemQuantity] = useState(1);
  const [selectedItem, setSelectedItem] = useState('');

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      });
    });
    setInventory(inventoryList);
  };

  const addItem = async (item, quantity) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity: currentQuantity } = docSnap.data();
      await setDoc(docRef, { quantity: currentQuantity + quantity });
    } else {
      await setDoc(docRef, { quantity });
    }

    await updateInventory();
  };

  const removeItem = async (item, quantity) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity: currentQuantity } = docSnap.data();
      if (currentQuantity <= quantity) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: currentQuantity - quantity });
      }
    }

    await updateInventory();
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const handleOpenAdd = () => setOpenAdd(true);
  const handleCloseAdd = () => setOpenAdd(false);
  const handleOpenRemove = (item) => {
    setSelectedItem(item);
    setOpenRemove(true);
  };
  const handleCloseRemove = () => setOpenRemove(false);

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          background: 'linear-gradient(135deg, #FFA07A 0%, #FF4500 100%)', // Updated to an autumn color gradient
        }}
      >
        <AppBar position="static" color="primary">
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold', color: '#FFFFFF' }}>
              Pantry Inventory
            </Typography>
          </Toolbar>
        </AppBar>

        <Container
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '2rem',
          }}
        >
          <Box display="flex" justifyContent="center" mb={2}>
            <Button
              variant="contained"
              onClick={handleOpenAdd}
              sx={{ marginBottom: '1rem', backgroundColor: '#FF5722', color: '#FFFFFF' }}
            >
              Add New Item
            </Button>
          </Box>

          <Modal open={openAdd} onClose={handleCloseAdd}>
            <Box
              position="absolute"
              top="50%"
              left="50%"
              width={400}
              bgcolor="white"
              borderRadius={2}
              boxShadow={24}
              p={4}
              display="flex"
              flexDirection="column"
              gap={3}
              sx={{
                transform: 'translate(-50%,-50%)',
                animation: 'fadeIn 0.3s',
                '@keyframes fadeIn': {
                  '0%': { opacity: 0 },
                  '100%': { opacity: 1 },
                },
              }}
            >
              <Typography variant="h6" textAlign="center">
                Add Item
              </Typography>
              <Stack width="100%" direction="column" spacing={2}>
                <TextField
                  label="Item Name"
                  variant="outlined"
                  fullWidth
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                />
                <TextField
                  label="Quantity"
                  variant="outlined"
                  fullWidth
                  type="number"
                  value={itemQuantity}
                  onChange={(e) => setItemQuantity(parseInt(e.target.value))}
                />
                <Button
                  variant="contained"
                  onClick={() => {
                    addItem(itemName, itemQuantity);
                    setItemName('');
                    setItemQuantity(1);
                    handleCloseAdd();
                  }}
                  sx={{ backgroundColor: '#FF5722', color: '#FFFFFF' }}
                >
                  Add
                </Button>
              </Stack>
            </Box>
          </Modal>

          <Modal open={openRemove} onClose={handleCloseRemove}>
            <Box
              position="absolute"
              top="50%"
              left="50%"
              width={400}
              bgcolor="white"
              borderRadius={2}
              boxShadow={24}
              p={4}
              display="flex"
              flexDirection="column"
              gap={3}
              sx={{
                transform: 'translate(-50%,-50%)',
                animation: 'fadeIn 0.3s',
                '@keyframes fadeIn': {
                  '0%': { opacity: 0 },
                  '100%': { opacity: 1 },
                },
              }}
            >
              <Typography variant="h6" textAlign="center">
                Remove Item
              </Typography>
              <Stack width="100%" direction="column" spacing={2}>
                <TextField
                  label="Quantity"
                  variant="outlined"
                  fullWidth
                  type="number"
                  value={itemQuantity}
                  onChange={(e) => setItemQuantity(parseInt(e.target.value))}
                />
                <Button
                  variant="contained"
                  onClick={() => {
                    removeItem(selectedItem, itemQuantity);
                    setItemQuantity(1);
                    handleCloseRemove();
                  }}
                  sx={{ backgroundColor: '#FF5722', color: '#FFFFFF' }}
                >
                  Remove
                </Button>
              </Stack>
            </Box>
          </Modal>

          <Box
            display="flex"
            flexWrap="wrap"
            justifyContent="center"
            gap={2}
          >
            {inventory.map(({ name, quantity }) => (
              <Card key={name} sx={{ minWidth: 275, maxWidth: 300, boxShadow: 3, transition: 'transform 0.3s', '&:hover': { transform: 'scale(1.05)' } }}>
                <CardContent>
                  <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
                    {name.charAt(0).toUpperCase() + name.slice(1)}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Quantity: {quantity}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    variant="contained"
                    onClick={() => handleOpenRemove(name)}
                    sx={{ backgroundColor: '#FF5722', color: '#FFFFFF' }}
                  >
                    Remove
                  </Button>
                </CardActions>
              </Card>
            ))}
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
