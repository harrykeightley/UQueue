import React from 'react'
import PropTypes from 'prop-types'
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

function HelpedAlert(props) {
    return (
        <Dialog
            open={props.open}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">{"You are being helped, sit tight."}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    Tutor: {props.tutor} <br></br>
                    Message: {props.message}
                </DialogContentText>
            </DialogContent>
        </Dialog>
    )
}

HelpedAlert.propTypes = {
    open: PropTypes.bool.isRequired,
    tutor: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
}

export default HelpedAlert

