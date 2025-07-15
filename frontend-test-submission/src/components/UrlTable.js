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
      <Table size="small">
        <TableHead sx={{ bgcolor: '#f5f5f5' }}>
          <TableRow>
            <TableCell />
            <TableCell>Short URL</TableCell>
            <TableCell>Original URL</TableCell>
            <TableCell align="center">Created</TableCell>
            <TableCell align="center">Expiry</TableCell>
            <TableCell align="center">Time Left</TableCell>
            <TableCell align="center">Clicks</TableCell>
            <TableCell align="center">Open</TableCell>
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
                      {openRow === idx ? (
                        <KeyboardArrowUp />
                      ) : (
                        <KeyboardArrowDown />
                      )}
                    </IconButton>
                  </TableCell>
                  <TableCell sx={{ maxWidth: 200 }}>
                    <Link
                      href={`${window.location.origin}/${link.shortcode}`}
                      underline="hover"
                      target="_blank"
                      rel="noopener"
                    >
                      {window.location.origin}/{link.shortcode}
                    </Link>
                  </TableCell>
                  <TableCell sx={{ maxWidth: 250 }}>
                    <Tooltip title={link.longUrl}>
                      <Link
                        href={link.longUrl}
                        underline="hover"
                        target="_blank"
                        rel="noopener"
                        sx={{ wordBreak: 'break-all' }}
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
                        onClick={() => onOpenClick(idx, link.longUrl)}
                        disabled={isExpired}
                      >
                        <OpenInNew />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>

                {/* Collapsible Row */}
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
                        {link.clicks && link.clicks.length > 0 ? (
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
                          <Typography
                            variant="body2"
                            color="text.secondary"
                          >
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
