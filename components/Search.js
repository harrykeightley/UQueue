import React from 'react'
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Link from 'next/link';

import styles from '../styles/Search.module.css'


import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';
import Axios from 'axios';
import SearchIcon from '@material-ui/icons/Search';


const filter = createFilterOptions();

export default function Search(props) {


    const [value, setValue] = React.useState('');
    const [courses, setCourses] = React.useState([]);

    React.useEffect(() => {
        Axios.get('/api/courses').then(res => setCourses(res.data))
    }, [])

    const getCourse = (value) => {
        if (!value) {
            return ''
        }
        return value.code
    }

    return (
        <div style={{ marginTop: '1.2em' }}>
            <Autocomplete
                value={value}
                onChange={(event, newValue) => {
                    if (typeof newValue === 'string') {
                        setValue({
                            code: newValue,
                        });
                    } else if (newValue && newValue.inputValue) {
                        // Create a new value from the user input
                        setValue({
                            code: newValue.inputValue,
                        });
                    } else {
                        setValue(newValue);
                    }
                }}
                filterOptions={(options, params) => {
                    const filtered = filter(options, params);

                    // Suggest the creation of a new value
                    if (filtered.length === 0) {
                        filtered.push({
                            inputValue: params.inputValue,
                            code: `No results for "${params.inputValue}"`,
                        });
                    }

                    return filtered;
                }}
                selectOnFocus
                clearOnBlur
                handleHomeEndKeys
                id="free-solo-with-text-demo"
                options={courses}
                getOptionLabel={(option) => {
                    // Value selected with enter, right from the input
                    if (typeof option === 'string') {
                        return option;
                    }
                    // Add "xxx" option created dynamically
                    if (option.inputValue) {
                        return option.inputValue;
                    }
                    // Regular option
                    return option.code;
                }}
                renderOption={(option) => option.code}
                style={{ width: 300 }}
                freeSolo
                renderInput={(params) => (
                    <div className={styles.root}>

                        <Link href={`/courses/${getCourse(value)}`}>
                            <a>
                                <SearchIcon fontSize='large' style={{ marginRight: '0.5rem ' }} />
                            </a>
                        </Link>
                        <TextField  {...params} label="Enter Course Code" variant="outlined" />
                    </div>
                )}
            />
        </div>

    );
}


