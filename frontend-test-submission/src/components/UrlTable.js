import React, { useState } from 'react';
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  IconButton,
  Collapse,
  Tooltip,
  Chip,
  Link,
} from '@mui/material';
import {
  KeyboardArrowDown,
  KeyboardArrowUp,
  OpenInNew,
} from '@mui/icons-material';

function UrlTable({ links, onOpenClick }) {
  const [openRow, setOpenRow] = useState(null);

  const toggleRow = (idx) => {
    setOpenRow((prev) => (prev === idx ? null : idx));
  };

  const getTimeDiff = (expiresAt) => {
    const now = new Date();
    const exp = new Date(expiresAt);
    const diffMs = exp - now;

    if (diffMs <= 0) {
      return 'Expired';
    }

    const diffSeconds = Math.floor(diffMs / 1000);
    const hours = Math.floor(diffSeconds / 3600);
    const minutes = Math.floor((diffSeconds % 3600) / 60);
    const seconds = diffSeconds % 60;

    let result = '';
    if (hours > 0) result += `${hours}h `;
    if (minutes > 0) result += `${minutes}m `;
    result += `${seconds}s left`;

    return result;
  };

  return (
    <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
  <Table size="small" sx={{ tableLayout: 'fixed' }}>
    <TableHead sx={{ bgcolor: '#f5f5f5' }}>
      <TableRow>
        <TableCell sx={{ width: 40 }} />
        <TableCell sx={{ width: 180 }}>Short URL</TableCell>
        <TableCell sx={{ width: 250 }}>Original URL</TableCell>
        <TableCell align="center" sx={{ width: 160 }}>Created</TableCell>
        <TableCell align="center" sx={{ width: 160 }}>Expiry</TableCell>
        <TableCell align="center" sx={{ width: 120 }}>Time Left</TableCell>
        <TableCell align="center" sx={{ width: 80 }}>Clicks</TableCell>
        <TableCell align="center" sx={{ width: 80 }}>Open</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {links.map((link, idx) => {
        const isExpired = new Date(link.expiresAt) <= new Date();
        return (
          <React.Fragment key={link.shortcode}>
            <TableRow
              hover
              sx={{
                bgcolor: isExpired ? '#fdecea' : undefined,
              }}
            >
              <TableCell>
                <IconButton size="small" onClick={() => toggleRow(idx)}>
                  {openRow === idx ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                </IconButton>
              </TableCell>
              <TableCell sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                <Link
                  href={`${window.location.origin}/${link.shortcode}`}
                  underline="hover"
                  target="_blank"
                  rel="noopener"
                >
                  {window.location.origin}/{link.shortcode}
                </Link>
              </TableCell>
              <TableCell sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                <Tooltip title={link.longUrl}>
                  <Link
                    href={link.longUrl}
                    underline="hover"
                    target="_blank"
                    rel="noopener"
                  >
                    {link.longUrl}
                  </Link>
                </Tooltip>
              </TableCell>
              <TableCell align="center">
                {new Date(link.createdAt).toLocaleString()}
              </TableCell>
              <TableCell align="center">
                {new Date(link.expiresAt).toLocaleString()}
                {isExpired && (
                  <Chip
                    label="Expired"
                    size="small"
                    color="error"
                    sx={{ ml: 1 }}
                  />
                )}
              </TableCell>
              <TableCell align="center">
                {getTimeDiff(link.expiresAt)}
              </TableCell>
              <TableCell align="center">
                {link.clickCount || 0}
              </TableCell>
              <TableCell align="center">
                <Tooltip title="Open URL">
                  <IconButton
                    color="primary"
                    onClick={() => handleClick(idx, link.longUrl)}
                    disabled={isExpired}
                  >
                    <OpenInNew />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={8} sx={{ p: 0, border: 0 }}>
                <Collapse
                  in={openRow === idx}
                  timeout="auto"
                  unmountOnExit
                >
                  <Box sx={{ m: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Click Details
                    </Typography>
                    {link.clicks?.length > 0 ? (
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Timestamp</TableCell>
                            <TableCell>Source</TableCell>
                            <TableCell>Geo</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {link.clicks.map((click, cidx) => (
                            <TableRow key={cidx}>
                              <TableCell>
                                {new Date(click.timestamp).toLocaleString()}
                              </TableCell>
                              <TableCell>{click.source}</TableCell>
                              <TableCell>{click.geo}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No click data.
                      </Typography>
                    )}
                  </Box>
                </Collapse>
              </TableCell>
            </TableRow>
          </React.Fragment>
        );
      })}
    </TableBody>
  </Table>
</TableContainer>

  );
}

export default UrlTable;
