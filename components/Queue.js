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
import BlockIcon from '@material-ui/icons/Block';

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

    const { queue, isTutor, user, course } = props
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


    const [time, setTime] = React.useState(Date.now());
    React.useEffect(() => {
        // Ask for permission for notifications
        if ("Notification" in window) {
            Notification.requestPermission();
        }

        //refresh queue every second
        const interval = setInterval(() => setTime(Date.now()), 1000);
        return () => {
            clearInterval(interval);
        };
    }, []);

    const isMyQuestion = (question) => {
        return user.user === question.user.user
    }

    const myQuestion = questions.find(question => question.user.user === user.user)

    // Notify when I get a question
    React.useEffect(() => {
        if (myQuestion !== undefined && myQuestion.claimed) {
            new Notification(`A ${course} tutor has messaged you!`, {icon: '/favicon.ico'})
        }
    }, [myQuestion && myQuestion.claimed])

    return (
        <Paper elevation={2} style={{ padding: '24px' }}>
            <Typography gutterBottom style={{ padding: '8px' }} variant='h4' align='center'>{props.name}</Typography>
            {/* <h2 style={{ padding: '8px' }} align='center'>{props.name}</h2> */}

            <Typography variant='body1' align='center' gutterBottom> {queue.description} </Typography>

            <div style={{ textAlign: 'center', margin: '16px' }}>
                <Button
                    style={myQuestion === undefined ? { backgroundColor: '#0070f3', color: 'white' } : {}}
                    disabled={myQuestion !== undefined}
                    onClick={generateQuestion}
                    variant='contained'>
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
                                <TableCell style={isMyQuestion(question) ? { fontWeight: 'bold' } : {}}>
                                    {question.user.name == '__redacted__' ? question.user.user : question.user.name}
                                </TableCell>
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

    // TODO eventually refactor this to use username instead of name since tutors can have duplicate names.
    const studentClaimedByMe = question.claimed && question.claimedInfo.claimer === user.name

    const claim = () => {
        if (!question.claimed) {
            setOpen(true)
        } else if (studentClaimedByMe) {
            // Unclaim the student
            socket.emit('change', qid, user, { type: 'UNCLAIM', question: question })
        }
    }

    const claimToolTip = () => {
        if (!question.claimed) {
            return 'Claim'
        } else if (studentClaimedByMe) {
            return 'Unclaim'
        } else {
            return `Claimed by ${question.claimedInfo.claimer}`
        }

    }

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
            name: claimToolTip(),
            icon: studentClaimedByMe ? <BlockIcon /> : <AccessibilityIcon />,
            func: claim,
            color: question.claimed && !studentClaimedByMe ? 'grey' : '#0070f3'
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

