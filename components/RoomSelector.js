import React from 'react'
import PropTypes from 'prop-types'

import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';


function RoomSelector(props) {

    const { room, rooms, setRoom } = props

    const handleChange = (event) => {
        var nextRoom = rooms.find((room) => room.name === event.target.value)
        if (nextRoom !== undefined) setRoom(nextRoom)
    }

    return (
        <div>
            <FormControl variant="outlined" style={{ minWidth: '120px' }}>
                <InputLabel id="demo-simple-select-outlined-label">Room</InputLabel>
                <Select
                    labelId="demo-simple-select-outlined-label"
                    id="demo-simple-select-outlined"
                    value={room ? room.name : ''}
                    onChange={handleChange}
                    label="Age"
                >
                    <MenuItem value={null}>
                        <em>None</em>
                    </MenuItem>

                    {rooms.map((room) => (
                        <MenuItem key={room._id} value={room.name}>{room.name}</MenuItem>
                    ))}

                </Select>
            </FormControl>
        </div>
    )
}


RoomSelector.propTypes = {
    rooms: PropTypes.array.isRequired,
    setRoom: PropTypes.func.isRequired,
    room: PropTypes.object
}

export default RoomSelector