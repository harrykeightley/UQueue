import React from 'react'
import PropTypes from 'prop-types'

import styles from '../styles/Queue.module.css'
import { Paper, Typography, Button } from '@material-ui/core';

import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

function Queue(props) {

    const [questions, setQuestions] = React.useState([]);

    const generateQuestion = () => {
        setQuestions([...questions, {name: 'Mike Phamowski', questionsAsked: 2 , time: '2'}])
    }

    return (
        <Paper elevation={2} style={{ padding: '24px' }}>
            <Typography style={{ padding: '8px' }} variant='h4' align='center'>{props.name}</Typography>

            <Typography variant='p' gutterBottom> Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</Typography>
            <div style={{ textAlign: 'center', margin: '16px'}}>
                <Button variant='contained' onClick={generateQuestion}>
                    Request Help
                </Button>
            </div>

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
                            <TableRow key={index + 1}>
                                <TableCell component="th" scope="row">
                                    {index + 1}
                                </TableCell>
                                <TableCell>{question.name}</TableCell>
                                <TableCell>{question.questionsAsked}</TableCell>
                                <TableCell>{question.time}</TableCell>
                                <TableCell>{question.time}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
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

