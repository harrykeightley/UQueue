import React from 'react'
import PropTypes from 'prop-types'
import Axios from 'axios'
import styles from '../../styles/Course.module.css'

import { useRouter } from 'next/router'
import RoomSelector from '../../components/RoomSelector';
import Queue from '../../components/Queue';
import { Grid, Container } from '@material-ui/core';

function Course(props) {
    const router = useRouter()

    const { id } = router.query;
    const [rooms, setRooms] = React.useState([])

    React.useEffect(() => {
        Axios.get(`/api/rooms/${id}/`).then(res => setRooms(res.data))
    }, [id])

    const [room, setRoom] = React.useState(null)

    // Get initial queue data
    const [queues, setQueues] = React.useState([])
    React.useEffect(() => {
        if (room === null) {
            return;
        }
        Axios.get(`/api/queues/${room._id}`).then(res => setQueues(res.data))
    }, [room])

    // TODO remove
    // console.log('id:', id)
    // console.log('rooms', rooms)
    // console.log(room)

    return (
        <div>
            <div className={styles.titleBar}>
                <h2>{id}: </h2>
                <RoomSelector room={room} rooms={rooms} setRoom={setRoom} course={id} />
            </div>
            <br></br>
            <Container maxWidth='xl'>
                <Grid container spacing={3}>
                    {queues.map((queue) => (
                        <Grid item xs={12} md={6} key={queue.name}>
                            <Queue queue={queue} name={queue.name} isTutor={true}></Queue>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </div>
    )
}

Course.propTypes = {

}

export default Course;
