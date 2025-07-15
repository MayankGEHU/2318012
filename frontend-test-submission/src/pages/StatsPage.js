import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import UrlTable from '../components/UrlTable';
import { log } from '../utils/log';

const TOKEN = process.env.REACT_APP_LOGGER_BEARER_TOKEN || '';

function StatsPage() {
  const [links, setLinks] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('shortLinks') || '[]');
    setLinks(stored);
  }, []);

  const handleClick = async (idx, url) => {
    const updatedLinks = [...links];
    const now = new Date().toISOString();

    updatedLinks[idx].clickCount = (updatedLinks[idx].clickCount || 0) + 1;
    updatedLinks[idx].clicks.push({
      timestamp: now,
      source: 'stats-page',
      geo: 'India',
    });

    setLinks(updatedLinks);
    localStorage.setItem('shortLinks', JSON.stringify(updatedLinks));

    await log(
      'frontend',
      'info',
      'component',
      `Link clicked: ${updatedLinks[idx].shortcode}`,
      TOKEN
    );

    window.open(url, '_blank');
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Shortened URL Statistics
      </Typography>

      {links.length === 0 ? (
        <Typography>No shortened URLs found.</Typography>
      ) : (
        <UrlTable links={links} onOpenClick={handleClick} />
      )}
    </Box>
  );
}

export default StatsPage;
