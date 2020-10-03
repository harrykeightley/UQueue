import React from 'react'
import PropTypes from 'prop-types'

import { Paper, Typography, Button, Tooltip } from '@material-ui/core';

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

import { socket } from './socket';
import HelpedAlert from './HelpedAlert';
import Claimer from './Claimer';
import { defaultSort } from '../helpers/queueSorts';

const claimedColor = '#FFF2FD'


// Determine from the date, the text that appears in the time column
const getTimeDifference = (date) => {
    const oldDate = new Date(date)
    const newDate = new Date()
    const timeDiff = Math.abs(newDate - oldDate)
    const seconds = Math.ceil(timeDiff / (1000))

    if (seconds < 60) {
        return "A few seconds"
    }
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) {
        return `${minutes} minutes`
    }

    const hours = Math.floor(minutes / 60)
    if (hours < 24) {
        return `${hours} hours`
    }

    return 'Ages'
}

function Queue(props) {

    const { queue, isTutor, user } = props
    const id = queue._id

    const [questions, setQuestions] = React.useState([]);
    const generateQuestion = () => {
        socket.emit('ask', id, user)
    }

    // Queue connection and disconnection
    React.useEffect(() => {
        socket.on('change', ({ questions, qid }) => {
            if (qid === id) {
                setQuestions(questions)
            }
        })

        // update state if disconnected and reconnected
        socket.on('reconnect', () => {
            socket.emit('update')
        })

        // broadcast that we need new info
        socket.emit('init', id)

        return () => socket.emit('cya', id)
        
    }, [id, queue.room])

    //refresh queue every second
    const [time, setTime] = React.useState(Date.now());
    React.useEffect(() => {
        const interval = setInterval(() => setTime(Date.now()), 1000);
        return () => {
            clearInterval(interval);
        };
    }, []);

    const isMyQuestion = (question) => {
        return user.email === question.user.email
    }

    const myQuestion = questions.find(question => question.user.user === user.user)

    return (
        <Paper elevation={2} style={{ padding: '24px' }}>
            <Typography gutterBottom style={{ padding: '8px' }} variant='h4' align='center'>{props.name}</Typography>
            {/* <h2 style={{ padding: '8px' }} align='center'>{props.name}</h2> */}

            <Typography variant='body1' align='center' gutterBottom> {queue.description} </Typography>
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
                        {questions.sort(defaultSort).map((question, index) => (
                            <TableRow key={index + 1} style={question.claimed ? { backgroundColor: claimedColor } : {}}>
                                <TableCell component="th" scope="row">
                                    {index + 1}
                                </TableCell>
                                <TableCell style={isMyQuestion(question) ? { fontWeight: 'bold' } : {}}>{question.user.name}</TableCell>
                                <TableCell>{question.questionsAsked}</TableCell>
                                <TableCell>{getTimeDifference(question.date)}</TableCell>
                                {isTutor && <TableCell align="right">
                                    <ActionRow qid={id} question={question} socket={socket} user={user} />
                                </TableCell>}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Dialogue alerts */}
            <HelpedAlert
                open={myQuestion !== undefined && myQuestion.claimed}
                message={myQuestion && myQuestion.claimed ? myQuestion.claimedInfo.info : ''}
                tutor={myQuestion && myQuestion.claimed ? myQuestion.claimedInfo.claimer : ''}
            />
        </Paper>
    )
}

Queue.propTypes = {
    queue: PropTypes.object.isRequired,
    name: PropTypes.string.isRequired,
}

function ActionRow(props) {

    // If the tutor claim dialogue is open or not
    const [open, setOpen] = React.useState(false)

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

    const { qid, question, user } = props

    const data = [
        {
            name: 'Check',
            icon: <CheckIcon />,
            func: () => {
                socket.emit('change', qid, user, { type: 'TICK', question: question })
            },
            color: 'green'
        },
        {
            name: 'Remove',
            icon: <ClearIcon />,
            func: () => {
                socket.emit('change', qid, user, { type: 'REMOVE', question: question })
            },
            color: 'orange'
        },
        {
            name: 'Claim',
            icon: <AccessibilityIcon />,
            func: () => { setOpen(true) },
            //color: '#0070f3'
            color: '#0070f3'
        },

    ]

    return (
        <div style={style.root}>
            <Claimer
                question={question}
                open={open}
                setOpen={setOpen}
                qid={qid}
                tutor={user}
            />
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
}

export default Queue

