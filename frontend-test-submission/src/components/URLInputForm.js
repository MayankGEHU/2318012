import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Grid,
  Typography,
  IconButton,
  Tooltip,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

const defaultValidity = 30;

function URLInputForm({ onSubmit }) {
  const [inputs, setInputs] = useState([{ url: '', validity: '', shortcode: '' }]);

  const handleChange = (idx, field, value) => {
    const newInputs = [...inputs];
    newInputs[idx][field] = value;
    setInputs(newInputs);
  };

  const addRow = () => {
    if (inputs.length < 5) {
      setInputs([...inputs, { url: '', validity: '', shortcode: '' }]);
    }
  };

  const removeRow = (idx) => {
    setInputs(inputs.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(inputs);
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Typography variant="h6" gutterBottom>
        Shorten up to 5 URLs
      </Typography>
      <Grid container spacing={2}>
        {inputs.map((inp, idx) => (
          <React.Fragment key={idx}>
            <Grid item xs={12} sm={5}>
              <TextField
                required
                fullWidth
                label="Long URL"
                value={inp.url}
                onChange={(e) => handleChange(idx, 'url', e.target.value)}
                error={inp.url && !isValidUrl(inp.url)}
                helperText={
                  inp.url && !isValidUrl(inp.url) ? 'Invalid URL' : ''
                }
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField
                type="number"
                fullWidth
                label="Validity (min, default 30)"
                value={inp.validity}
                onChange={(e) => handleChange(idx, 'validity', e.target.value)}
                inputProps={{ min: 1, max: 1440 }}
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField
                fullWidth
                label="Custom Shortcode"
                value={inp.shortcode}
                onChange={(e) => handleChange(idx, 'shortcode', e.target.value)}
                inputProps={{ maxLength: 10 }}
              />
            </Grid>
            <Grid item xs={12} sm={1}>
              {inputs.length > 1 && (
                <Tooltip title="Remove">
                  <IconButton color="error" onClick={() => removeRow(idx)}>
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              )}
            </Grid>
          </React.Fragment>
        ))}
        <Grid item xs={12}>
          {inputs.length < 5 && (
            <Button variant="outlined" onClick={addRow}>
              + Add More
            </Button>
          )}
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" type="submit">
            Shorten
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}

export default URLInputForm;
