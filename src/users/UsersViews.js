import { userRole, Role, stringToRole, roleToString } from '../role.js';
import { EditUserDialog, DeleteUserDialog } from './UsersComponents.js';

import React from 'react';

import { Edit, Home as HomeIcon, Place, GroupWork, VolunteerActivism, Engineering, LocationOn, Code, Person, Archive, Logout, Login as LoginIcon, AddDarkMode, LightMode, Search, Sort, FilterList, Clear, Unarchive, Delete } from '@mui/icons-material';
import { Button, Card, CardContent, CircularProgress, FormControl, FormGroup, IconButton, InputLabel, MenuItem, Select, TextField, Tooltip, Typography, Divider, CardActionArea, CssBaseline, List, ListItemButton, ListItem, ListItemIcon, Checkbox, ListItemText, ListItemSecondaryAction, Box, Container, Paper, ListItemAvatar, Avatar, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions} from '@mui/material';

import axios from 'axios';
import { cloneDeep } from 'lodash';

import { theme } from '../theme.js';

export { UsersView }

class UsersView extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      loading: true,
      editing: false,
      deleting: false,
      currentUserIndex: 2
    }

    axios.get('http://localhost:8743/users/', { withCredentials: true }) // TODO: why is a slash needed before the query params, I remember this being a mystery
      .then((users) => {
        this.state.loading = false
        this.state.users = users.data.map((user) => {
          user.Role = stringToRole(user.Role)
          return user
        })
        this.setState(this.state)
      }).catch((err) => { 
        if (err.response && err.response.status === 401) // TODO: implement else
          window.location.replace("/login")
      });
  }

  render() {
    if (this.state.loading)
      return (<CircularProgress style={{margin: "auto", display: 'flex', marginTop: "100px"}}/>)

    return (
      <Box sx={{ width: "100%", maxWidth: "500px", margin: "auto" }}>
        <Typography variant='h4' sx={{ textAlign: "center", marginTop: theme.mediumMargin }} >Users</Typography>

        <Paper variant='outlined' sx={{ marginTop: theme.smallMargin }} >
          <List sx={{ marginTop: 0, padding: 0 }}>
            {
              this.state.users.map((user, i) => {
                return (
                  <ListItem key={i} >
                    <ListItemAvatar >
                      <Avatar alt={user.Username} src="/assets/icons/react2.svg" />
                    </ListItemAvatar>
                    <ListItemText primary={user.Username} secondary={roleToString(user.Role)} />
                    <ListItemIcon>
                      <IconButton aria-label="Edit" onClick={() => { this.setState({ ...this.state, editing: true, currentUserIndex: i }); }}>
                        <Edit />
                      </IconButton>
                    </ListItemIcon>
                    <ListItemIcon>
                      <IconButton aria-label="Delete" onClick={() => { this.setState({ ...this.state, deleting: true, currentUserIndex: i }); }}>
                        <Delete />
                      </IconButton>
                    </ListItemIcon>
                  </ListItem>
                )
              })
            }
          </List>
        </Paper>

        { 
          // Only create the component when the edit button is clicked because until then,
          // we do not know what user is to be edited (passed to the component).
          this.state.editing &&
            <EditUserDialog
                user={this.state.users[this.state.currentUserIndex]}
                open={this.state.editing}
                onConfirm={this.amendUser}
                onCancel={() => { this.setState({ ...this.state, editing: false }); }}/>
        }
        <DeleteUserDialog 
            username={this.state.users[this.state.currentUserIndex].Username}
            open={this.state.deleting}
            onConfirm={this.deleteUser}
            onCancel={() => { this.setState({ ...this.state, deleting: false }); }} />
      </Box>
    );
  }

  deleteUser = () => {
    this.setState({ ...this.state, deleting: false });
  }

  amendUser = (user) => {
    this.state.editing = false;
    this.state.users[this.state.currentUserIndex] = user
    this.setState(this.state);

    let jsonUser = JSON.stringify({
      username: user.Username,
      role: roleToString(user.Role)
    })
    axios.put('http://localhost:8743/users/', jsonUser, { withCredentials: true })
      .then((users) => {
      }).catch((err) => { 
        if (err.response && err.response.status === 401) // TODO: implement else
          window.location.replace("/login")
      });
  }
}

