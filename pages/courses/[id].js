import React from 'react'
import PropTypes from 'prop-types'
import Axios from 'axios'


import styles from '../../styles/Course.module.css'

import { useRouter } from 'next/router'
import ZoneSelector from '../../components/ZoneSelector';
import Queue from '../../components/Queue';
import { Grid, Container } from '@material-ui/core';

function Course(props) {
    const router = useRouter()

    const { id } = router.query;
    const [zones, setZones] = React.useState([])

    React.useEffect(() => {
        Axios.get(`/api/zones/${id}/`).then(res => setZones(res.data))
    }, [])

    const [zone, setZone] = React.useState('')

    // Get initial queue data
    const [queues, setQueues] = React.useState([])
    React.useEffect(() => {
        if (zone === '') {
            return;
        }
        Axios.get(`/api/queues/${id}?zone=${zone}`).then(res => setQueues(res.data))
    }, [zone])

    // Get queues and connect to socket

    

    return (
        <div>
            <div className={styles.titleBar}>
                <h2>{id}: </h2>
                <ZoneSelector zone={zone} zones={zones} setZone={setZone} course={id} />
            </div>
            <br></br>
            <Container maxWidth='xl'>
                <Grid container spacing={3}>
                    {queues.map((queue) => (
                        <Grid item xs={12} md={6}>
                            <Queue course={id} zone={zone} name={queue.name} weighting={queue.weighting}></Queue>
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
