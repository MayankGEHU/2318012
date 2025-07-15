import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
} from '@mui/material';
import { log } from '../utils/log';

const TOKEN = '<YOUR_BEARER_TOKEN_HERE>'; // Replace with your actual token

function StatsPage() {
  const [links, setLinks] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('shortLinks') || '[]');
    setLinks(stored);
  }, []);

  const handleClick = async (idx) => {
    const updatedLinks = [...links];
    const now = new Date().toISOString();

    // Simulate a fake click
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
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Shortened URL Statistics
      </Typography>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Short Link</TableCell>
            <TableCell>Original URL</TableCell>
            <TableCell>Created</TableCell>
            <TableCell>Expiry</TableCell>
            <TableCell>Clicks</TableCell>
            <TableCell>Click Details</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {links.map((link, idx) => (
            <TableRow key={link.shortcode}>
              <TableCell>
                <Button onClick={() => handleClick(idx)}>
                  {window.location.origin}/{link.shortcode}
                </Button>
              </TableCell>
              <TableCell>{link.longUrl}</TableCell>
              <TableCell>{new Date(link.createdAt).toLocaleString()}</TableCell>
              <TableCell>{new Date(link.expiresAt).toLocaleString()}</TableCell>
              <TableCell>{link.clickCount}</TableCell>
              <TableCell>
                {link.clicks && link.clicks.length > 0 ? (
                  <ul style={{ paddingLeft: 16, margin: 0 }}>
                    {link.clicks.map((click, cidx) => (
                      <li key={cidx}>
                        {new Date(click.timestamp).toLocaleString()} |{' '}
                        {click.source} | {click.geo}
                      </li>
                    ))}
                  </ul>
                ) : (
                  '—'
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}

export default StatsPage;
