// dialog.jsx
import React from 'react';
import { Dialog } from '@mui/material';

export default function DialogContext({ open, setOpen, children }) {

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      style={{borderRadius:"70px"}}
      onClose={handleClose}
    >
      {children}
    </Dialog>
  );
}
