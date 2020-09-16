import React from 'react'
import PropTypes from 'prop-types'

import styles from '../styles/Queue.module.css'
import { Paper, Typography, Button, Tooltip } from '@material-ui/core';

import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import IconButton from '@material-ui/core/IconButton';

import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
import AccessibilityIcon from '@material-ui/icons/Accessibility';

import io from 'socket.io-client';
const TUTOR_ID = 'Harry'

function Queue(props) {

    const { course, zone, name, isTutor } = props

    const [questions, setQuestions] = React.useState([]);

    const id = `${course}/${zone}/${name}`


    const socket = io()

    const generateQuestion = () => {
        socket.emit('ask', id, TUTOR_ID)
    }

    socket.on('init', (questions) => {
        setQuestions(questions)
    })

    socket.on('change', (questions) => {
        setQuestions(questions)
    })

    // Queue connection and disconnection
    React.useEffect(() => {
        socket.on('connect', () => {
            socket.emit('init', id)
        })

        return () => {
            socket.emit('disconnect')
            socket.off()
        }
    }, [props.name])

    return (
        <Paper elevation={2} style={{ padding: '24px' }}>
            <Typography gutterBottom style={{ padding: '8px' }} variant='h4' align='center'>{props.name}</Typography>
            {/* <h2 style={{ padding: '8px' }} align='center'>{props.name}</h2> */}

            <Typography variant='body1' gutterBottom> Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</Typography>
            <div style={{ textAlign: 'center', margin: '16px' }}>
                <Button style={{ backgroundColor: '#0070f3', color: 'white' }} variant='contained' onClick={generateQuestion}>
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
                            {isTutor && <TableCell align="right"></TableCell>}
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
                                {isTutor && <TableCell align="right">
                                    <ActionRow qid={id} question={question} socket={socket} />
                                </TableCell>}
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

function ActionRow(props) {

    const style = {
        root: {
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'nowrap',
            justifyContent: 'center',
            alignItems: 'center',
            alignContent: 'stretch',
        }
    }

    const { qid, socket, question } = props

    const data = [
        {
            name: 'Check',
            icon: <CheckIcon />,
            func: () => {
                socket.emit('change', qid, TUTOR_ID, { type: 'TICK', question: question })
            },
            color: 'green'
        },
        {
            name: 'Remove',
            icon: <ClearIcon />,
            func: () => {
                socket.emit('change', qid, TUTOR_ID, { type: 'REMOVE', question: question })
            },
            color: 'orange'
        },
        {
            name: 'Claim',
            icon: <AccessibilityIcon />,
            func: () => {
                socket.emit('change', qid, TUTOR_ID, { type: 'CLAIM', question: question })
            },
            //color: '#0070f3'
            color: '#0070f3'
        },

    ]

    return (
        <div style={style.root}>
            {data.map((action) => (
                <Tooltip title={action.name} key={action.name}>
                    <IconButton onClick={action.func} style={{ color: action.color }}>
                        {action.icon}
                    </IconButton>
                </Tooltip>
            ))}
        </div>
    )
}

ActionRow.propTypes = {
    question: PropTypes.object.isRequired,
    socket: PropTypes.object.isRequired
}

export default Queue

