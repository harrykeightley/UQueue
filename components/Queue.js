import React from 'react'
import PropTypes from 'prop-types'

import styles from '../styles/Queue.module.css'
import { Paper, Typography } from '@material-ui/core';

import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

function Queue(props) {

    const [questions, setQuestions] = React.useState([]);

    return (
        <Paper elevation={2} style={{padding: '8px'}}>
            <Typography style={{ padding: '16px'}} gutterBottom variant='h6' align='center'>{props.name}</Typography>

            <TableContainer>
                <Table aria-label="customized table">
                    <TableHead>
                        <TableRow>
                            <TableCell>#</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Questions Today</TableCell>
                            <TableCell>Time</TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {questions.map((question, index) => (
                            <TableRow key={index}>
                                <TableCell component="th" scope="row">
                                    {index}
                                </TableCell>
                                <TableCell>{question.name}</TableCell>
                                <TableCell>{question.questionsAsked}</TableCell>
                                <TableCell>{question.time}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            {questions.map((question, index) => (
                <Question key={index} question={question}></Question>
            ))}
        </Paper>
    )
}

Queue.propTypes = {
    weighting: PropTypes.func,
    name: PropTypes.string.isRequired,
}

function Question(props) {

}

export default Queue

