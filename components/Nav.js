import { AppBar, Toolbar, Button, Typography, IconButton, Menu, MenuItem, Container } from '@material-ui/core'
import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import styles from '../styles/Nav.module.css'

import AccountCircle from '@material-ui/icons/AccountCircle';
import Link from 'next/link';


export default function Nav() {

    const [anchorEl, setAnchorEl] = React.useState(null);
    const isMenuOpen = Boolean(anchorEl);

    const renderMenu = () => {
        return (
            <Menu
                anchorEl={anchorEl}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                id="account-menu"
                keepMounted
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                open={isMenuOpen}
                onClose={handleMenuClose}
            >
                <a href='https://api.uqcloud.net/auth/consent/https://uqueue.uqcloud.net/'>
                    <MenuItem>
                        Reset Permissions
                    </MenuItem>
                </a>
                <a href='https://api.uqcloud.net/logout/'>
                    <MenuItem>
                        Sign out
                    </MenuItem>
                </a>
            </Menu>
        );
    }

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    return (
        <div style={{ flexGrow: 1 }}>
            <AppBar position="static" style={{ background: '#0070f3' }}>
                <Container maxWidth='lg'>
                    <Toolbar>

                        {/* <IconButton edge="start" color="inherit" aria-label="menu">
                        <MenuIcon />
                    </IconButton> */}
                        <Link href="/">
                            <a className={styles.title}>
                                UQueue
                            </a>

                        </Link>

                        <div style={{ flexGrow: 1 }} />
                        <div style={{ display: "flex" }}>
                            <IconButton
                                edge="end"
                                aria-label="account of current user"
                                aria-controls="account-menu"
                                aria-haspopup="true"
                                onClick={handleProfileMenuOpen}
                                color="inherit"
                            >
                                <AccountCircle />
                            </IconButton>
                        </div>

                    </Toolbar>
                </Container>
            </AppBar>
            {renderMenu()}
        </div>

    )
}
