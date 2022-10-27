import React, { useEffect, useState, ReactNode } from 'react';
import IconButton from '@material-ui/core/IconButton';
import { Home, Chat, Forum, Group, Login, PersonAdd } from '@mui/icons-material';
import { Drawer as MuiDrawer } from '@material-ui/core';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { Link, useHistory } from "react-router-dom";

function Drawer(props: any): React.ReactElement {

    return (
        
        <MuiDrawer
            className={props.classes.drawer}
            variant='persistent'
            anchor="left"
            open={props.open}
            classes={{
            paper: props.classes.drawerPaper,
        }}
        >
        <div className={props.classes.drawerHeader}>
            <IconButton onClick={props.handleDrawerOpen}>
                {props.theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            </IconButton>
        </div>
        <Divider />
        <List>
            <ListItem button component={Link} to='/' style={{ textDecoration: 'none', color: "inherit" }}>
                <ListItemIcon><Home /></ListItemIcon>
                <ListItemText primary='Home'></ListItemText>
            </ListItem>
            <ListItem button component={Link} to='/chat' style={{ textDecoration: 'none', color: "inherit" }}>
                <ListItemIcon><Chat /></ListItemIcon>
                <ListItemText primary='Chat'></ListItemText>
            </ListItem>
            <ListItem button component={Link} to='/privatechat/waonpad' style={{ textDecoration: 'none', color: "inherit" }}>
                <ListItemIcon><Forum /></ListItemIcon>
                <ListItemText primary='Private Chat'></ListItemText>
            </ListItem>
            <ListItem button component={Link} to='/groupchat/test' style={{ textDecoration: 'none', color: "inherit" }}>
                <ListItemIcon><Group /></ListItemIcon>
                <ListItemText primary='Group Chat'></ListItemText>
            </ListItem>


            {/* {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
            <ListItem button key={text}>
                <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
                <ListItemText primary={text} />
            </ListItem>
            ))}
        </List>
        <Divider />
        <List>
            {['All mail', 'Trash', 'Spam'].map((text, index) => (
            <ListItem button key={text}>
                <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
                <ListItemText primary={text} />
            </ListItem>
            ))} */}
        </List>
        </MuiDrawer>
    )
};

export default Drawer;