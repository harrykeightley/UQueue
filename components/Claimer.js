import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import PropTypes from 'prop-types'
import { socket } from './socket';


function Claimer(props) {

    const { tutor, question, open, setOpen, qid } = props

    const [info, setInfo] = React.useState("")

    const handleChange = (event) => {
        setInfo(event.target.value)
    }

    const handleClose = () => {
        setOpen(false);
    };

    const claim = () => {
        question.claimedInfo = {info: info, claimer: tutor.name}
        socket.emit('change', qid, tutor, { type: 'CLAIM', question: question })
        setOpen(false)
    }

    return (
        question && <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Subscribe</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Enter the text the student will see when claimed:
                </DialogContentText>
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Claimed Information"
                    type="text"
                    value={info}
                    onChange={handleChange}
                    fullWidth
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Cancel
                </Button>
                <Button onClick={claim} color="primary">
                    Claim
                </Button>
            </DialogActions>
        </Dialog>
    )
}

Claimer.propTypes = {
    qid: PropTypes.string,
    tutor: PropTypes.object,
    question: PropTypes.object,
    open: PropTypes.bool,
    setOpen: PropTypes.func
}

export default Claimer

