import React from 'react'
import PropTypes from 'prop-types'
import Axios from 'axios'
import styles from '../../styles/Course.module.css'

import { useRouter } from 'next/router'
import RoomSelector from '../../components/RoomSelector';
import Queue from '../../components/Queue';
import { Grid, Container, Typography } from '@material-ui/core';

function Course(props) {
    const router = useRouter()

    const { id } = router.query;
    const [rooms, setRooms] = React.useState([])

    React.useEffect(() => {
        Axios.get(`/api/rooms/${id}/`).then(res => setRooms(res.data))
    }, [])

    const [room, setRoom] = React.useState(null)

    // Get initial queue data
    const [queues, setQueues] = React.useState([])
    React.useEffect(() => {
        if (room === null) {
            return;
        }
        Axios.get(`/api/queues/${room._id}`)
        .then(res => setQueues(res.data))
        .catch(err => console.log(err))
    }, [room])

    return (
        <div>
            <div className={styles.titleBar}>
                <h2>{id}: </h2>
                <RoomSelector room={room} rooms={rooms} setRoom={setRoom} course={id} />


            </div>
            {/* Extra label when a room hasn't been selected */}
            {room === null &&
                <Typography display='initial' align='center' variant='body1'>
                    Select a room from the drop-down menu above.
                </Typography>
            }
            <br></br>
            <Container maxWidth='xl'>
                <Grid container spacing={3}>
                    {queues.map((queue) => (
                        <Grid item xs={12} md={6} key={queue.name}>
                            <Queue queue={queue} name={queue.name} isTutor={props.isStaff} user={props.user}></Queue>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </div>
    )
}

Course.propTypes = {

}

// Pull user info from UQ SSO
Course.getInitialProps = async (ctx) => {
    const { id } = ctx.query;
    let user = 'x-kvd-payload' in ctx.req.headers ?
        JSON.parse(ctx.req.headers['x-kvd-payload']) : {
            user: 'testuser',
            email: 'test@test.com',
            name: 'Barry Beatley'
        }

    // Determine if the user is a tutor for the course
    let isStaff = false
    let courses = await fetch('http://localhost:8081/api/courses')
    let json = await courses.json()
    let course = json.find((course) => course.code === id)
    if (course.staff.filter(member => member.user === user.user).length) {
        isStaff = true
    }

    return { user, isStaff }
}

export default Course;
