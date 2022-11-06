import { useContext } from 'react'
import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { DialogContent } from '@mui/material';
import Alert from '@mui/material/Alert';
import AuthContext from '../auth'


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export default function ErrorModal(){
    const {auth} = useContext(AuthContext);

    function handleCloseErrorModal(){
        auth.unmarkError();
    }
    return (
        <div>
        <Modal
          open={auth.hasErrorMessage()}>
          <Box sx={style}>
          <DialogContent>
            <Alert severity="error">{auth.errorMessage}</Alert>
          </DialogContent>
          <button id="dialog-button"
            className =  "modal-button"
            onClick={handleCloseErrorModal}>
            Done
          </button>
          </Box>
        </Modal>
      </div>
    );
}