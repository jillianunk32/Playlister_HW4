import { useContext } from 'react'
import GlobalStoreContext from '../store';
import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { DialogContent } from '@mui/material';

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

export default function MUIRemoveSongModal() {
    const { store } = useContext(GlobalStoreContext);

    function handleConfirmRemoveSong () {
        store.addRemoveSongTransaction();
    }

    function handleCancelRemoveSong () {
        store.hideModals();
    }
    
    // let modalClass = "modal-dialog";
    // if (store.isRemoveSongModalOpen()) {
    //     modalClass += " is-visible";
    //     console.log("is visible");
    // }
    let songTitle = "";
    if (store.currentSong) {
        songTitle = store.currentSong.title;
    }

    return (
        <Modal
            open={store.isRemoveSongModalOpen()}
        >
            <Box sx={style}>
                <div className="modal-dialog">
                <header className="dialog-header">
                    Remove {songTitle}?
                </header>
                <DialogContent>Are you sure you want to remove {songTitle} from the playlist?</DialogContent>
                <div id="confirm-cancel-container">
                    <button
                        id="dialog-yes-button"
                        className="modal-button"
                        onClick={handleConfirmRemoveSong}
                    >Confirm</button>
                    <button
                        id="dialog-no-button"
                        className="modal-button"
                        onClick={handleCancelRemoveSong}
                    >Cancel</button>
                </div>
            </div>
            </Box>
        </Modal>
    );
}