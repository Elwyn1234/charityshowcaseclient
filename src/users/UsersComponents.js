import { userRole, Role, stringToRole, roleToString } from '../role.js';

import React from 'react';

import { Button, Card, CardContent, CircularProgress, FormControl, FormGroup, IconButton, InputLabel, MenuItem, Select, TextField, Tooltip, Typography, Divider, CardActionArea, CssBaseline, List, ListItemButton, ListItem, ListItemIcon, Checkbox, ListItemText, ListItemSecondaryAction, Box, Container, Paper, ListItemAvatar, Avatar, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions} from '@mui/material';

import { cloneDeep } from 'lodash';

export { EditUserDialog, DeleteUserDialog }

class EditUserDialog extends React.Component {
  constructor(props) {
    super(props)
    // Deep clone avoids horrible bug where changing this.state (a reference), changes the 
    // object that the parent component passed to this component via props...
    // Note that this cloning has likely been done in other parts of the component as well.
    this.state = { user: cloneDeep(this.props.user) }
  }

  render() {
    return (
      // onFocus has to be used to pull the latest props value that is passed to the component.
      <Dialog open={this.props.open} onClose={this.props.onCancel} >
        <DialogTitle>Edit User's Details</DialogTitle>

        <DialogContent >
          <InputLabel id="user-select-label">Role</InputLabel>
          <Select
            labelId='user-select-label'
            label={`Role`}
            value={this.state.user.Role}
            required
            onChange={(e) => {
              if (e.target.value !== null && e.target.value !== '') { // TODO: is this condition redundant
                this.state.user.Role = e.target.value
                this.setState(this.state) // required to update UI
              }
            }}
          >
            <MenuItem value={Role.User} dense={true} key={0}>User</MenuItem>
            <MenuItem value={Role.Editor} dense={true} key={1}>Editor</MenuItem>
            <MenuItem value={Role.Creator} dense={true} key={2}>Creator</MenuItem>
            <MenuItem value={Role.Admin} dense={true} key={3}>Admin</MenuItem>
          </Select>
        </DialogContent >

        <DialogActions>
          <Button onClick={this.props.onCancel}>Cancel</Button>
          <Button onClick={() => this.props.onConfirm(cloneDeep(this.state.user))}>Submit</Button>
        </DialogActions>
      </Dialog>
    )
  }
}

class DeleteUserDialog extends React.Component {
  render() {
    return (
      <Dialog open={this.props.open} onClose={this.props.onCancel}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent >
          <DialogContentText >Are you sure you want to delete {this.props.username}?</DialogContentText >
        </DialogContent >
        <DialogActions>
          <Button onClick={this.props.onCancel}>Cancel</Button>
          <Button onClick={this.props.onConfirm}>Confirm</Button>
        </DialogActions>
      </Dialog>
    )
  }
}

