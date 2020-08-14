import React from 'react'
import PropTypes from 'prop-types'

import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';


function ZoneSelector(props) {

    const { zone, zones, setZone } = props

    const handleChange = (event) => {
        setZone(event.target.value)
    }

    return (
        <div>
            <FormControl variant="outlined" style={{ minWidth: '120px' }}>
                <InputLabel id="demo-simple-select-outlined-label">Zone</InputLabel>
                <Select
                    labelId="demo-simple-select-outlined-label"
                    id="demo-simple-select-outlined"
                    value={zone}
                    onChange={handleChange}
                    label="Age"
                >
                    <MenuItem value="">
                        <em>None</em>
                    </MenuItem>

                    {zones.map((zone) => (
                        <MenuItem key={zone.id} value={zone.name}>{zone.name}</MenuItem>
                    ))}

                </Select>
            </FormControl>
        </div>
    )
}


ZoneSelector.propTypes = {
    zones: PropTypes.array.isRequired,
    setZone: PropTypes.func.isRequired,
    zone: PropTypes.string.isRequired
}

export default ZoneSelector