import React, { useState } from 'react';
import URLInputForm from '../components/URLInputForm';
import {
  Box,
  List,
  ListItem,
  Typography,
  Alert,
  Link as MuiLink,
} from '@mui/material';
import { log } from '../utils/log';

const TOKEN = process.env.REACT_APP_LOGGER_BEARER_TOKEN || '';

function generateShortCode(existing, preferred) {
  const charset = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let code = preferred || '';
  if (!code || existing.has(code)) {
    do {
      code = '';
      for (let i = 0; i < 5; ++i) {
        code += charset[Math.floor(Math.random() * charset.length)];
      }
    } while (existing.has(code));
  }
  return code;
}

function URLShortenerPage() {
  const [links, setLinks] = useState(() =>
    JSON.parse(localStorage.getItem('shortLinks') || '[]')
  );
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (inputs) => {
    setError('');
    setSuccess('');
    const now = new Date();
    const newLinks = [];
    const existingCodes = new Set(links.map((l) => l.shortcode));

    for (let i = 0; i < inputs.length; ++i) {
      const { url, validity, shortcode } = inputs[i];

      try {
        new URL(url);
      } catch {
        const msg = `Row ${i + 1}: Invalid URL`;
        setError(msg);
        await log('frontend', 'error', 'component', `Invalid URL: ${url}`, TOKEN);
        return;
      }

      if (shortcode && existingCodes.has(shortcode)) {
        const msg = `Row ${i + 1}: Shortcode "${shortcode}" already used`;
        setError(msg);
        await log(
          'frontend',
          'error',
          'component',
          `Shortcode collision: ${shortcode}`,
          TOKEN
        );
        return;
      }

      const code = generateShortCode(existingCodes, shortcode);
      existingCodes.add(code);

      const mins = parseInt(validity, 10) || 30;
      const createdAt = now.toISOString();
      const expiresAt = new Date(now.getTime() + mins * 60000).toISOString();

      newLinks.push({
        longUrl: url,
        shortcode: code,
        createdAt,
        expiresAt,
        clickCount: 0,
        clicks: [],
      });

      await log(
        'frontend',
        'info',
        'component',
        `Shortened URL ${url} -> ${code}`,
        TOKEN
      );
    }

    const updatedLinks = [...links, ...newLinks];
    setLinks(updatedLinks);
    localStorage.setItem('shortLinks', JSON.stringify(updatedLinks));

    setSuccess('Short URLs created successfully!');
  };

  const validLinks = links.filter(
    (link) => new Date(link.expiresAt) > new Date()
  );

  return (
    <Box sx={{ p: 3 }}>
      <URLInputForm onSubmit={handleSubmit} />

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mt: 2 }}>
          {success}
        </Alert>
      )}

      <Typography variant="h6" sx={{ mt: 4 }}>
        Shortened URLs:
      </Typography>
      <List>
        {validLinks.length > 0 ? (
          validLinks.map((link) => (
            <ListItem key={link.shortcode}>
              <MuiLink
                href={`${window.location.origin}/${link.shortcode}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {window.location.origin}/{link.shortcode}
              </MuiLink>
              &nbsp;→&nbsp; {link.longUrl}
              &nbsp;| Expires:{' '}
              {new Date(link.expiresAt).toLocaleString()}
            </ListItem>
          ))
        ) : (
          <Typography variant="body2" sx={{ mt: 2 }}>
            No valid links yet.
          </Typography>
        )}
      </List>
    </Box>
  );
}

export default URLShortenerPage;
