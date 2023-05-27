import { userRole, Role } from './role.js';

import React from 'react';
import { Home as HomeIcon, GroupWork, VolunteerActivism, Engineering, LocationOn, Code, Person, Archive, Logout, Login as LoginIcon } from '@mui/icons-material';
import {} from '@mui/icons-material';
import { Divider, Drawer, List, ListItemButton, ListItemIcon, ListItemText, ListSubheader, Toolbar, Typography} from '@mui/material';
import axios from 'axios';

import './index.css';

export { NavigationDrawer }

class NavigationDrawer extends React.Component {
  render() {
    return (
      <Drawer anchor='left' open={true} variant='permanent' sx={{
          width: 254,
          '& .MuiDrawer-paper': { width: 254 }
      }}>

        <Toolbar>
          <Typography variant='h6'>Charity Showcase</Typography>
        </Toolbar>
        <Divider />
        <List>
        <ListSubheader>General</ListSubheader>
          <HomeListItem />
          <CharityProjectsListItem />
          <CharitiesListItem />
          <ContributorsListItem />
          <LocationsListItem />
          <TechnologiesListItem />
          {
            userRole() >= Role.Creator &&
            <div>
              <Divider />
              <ListSubheader>Administration</ListSubheader>
            </div>
          }
          {
            userRole() >= Role.Admin && <UsersListItem />
          }
          {
            userRole() >= Role.Creator && <ArchiveListItem />
          }
        <Divider />
          {
            isLoggedIn() ? <LogoutListItem /> : <LoginListItem />
          }
        </List>
      </Drawer>
    )
  }
}

/**************************************************************/
/* List Items
/**************************************************************/

class HomeListItem extends React.Component {
  render() {
    return (
      <ListItemButton>
        <ListItemIcon>
          <HomeIcon />
        </ListItemIcon>
        <ListItemText primary="Home" />
      </ListItemButton>
    )
  }
}

class CharityProjectsListItem extends React.Component {
  render() {
    return (
      <ListItemButton href='/'>
        <ListItemIcon>
          <GroupWork />
        </ListItemIcon>
        <ListItemText primary="Charity Projects" />
      </ListItemButton>
    )
  }
}

class CharitiesListItem extends React.Component {
  render() {
    return (
      <ListItemButton>
        <ListItemIcon>
          <VolunteerActivism />
        </ListItemIcon>
        <ListItemText primary="Charities" />
      </ListItemButton>
    )
  }
}

class ContributorsListItem extends React.Component {
  render() {
    return (
      <ListItemButton>
        <ListItemIcon>
          <Engineering />
        </ListItemIcon>
        <ListItemText primary="Contributors" />
      </ListItemButton>
    )
  }
}

class LocationsListItem extends React.Component {
  render() {
    return (
      <ListItemButton>
        <ListItemIcon>
          <LocationOn />
        </ListItemIcon>
        <ListItemText primary="Locations" />
      </ListItemButton>
    )
  }
}

class TechnologiesListItem extends React.Component {
  render() {
    return (
      <ListItemButton>
        <ListItemIcon>
          <Code />
        </ListItemIcon>
        <ListItemText primary="Technologies" />
      </ListItemButton>
    )
  }
}

class UsersListItem extends React.Component {
  render() {
    return (
      <ListItemButton href="/user-management">
        <ListItemIcon>
          <Person />
        </ListItemIcon>
        <ListItemText primary="Users" />
      </ListItemButton>
    )
  }
}

class ArchiveListItem extends React.Component {
  render() {
    return (
    <ListItemButton href="/archive">
      <ListItemIcon>
        <Archive />
      </ListItemIcon>
      <ListItemText primary="Archive" />
    </ListItemButton>
    )
  }
}

class LoginListItem extends React.Component {
  render() {
    return (
    <ListItemButton href="/login">
      <ListItemIcon>
        <LoginIcon />
      </ListItemIcon>
      <ListItemText>Login</ListItemText>
    </ListItemButton>
    )
  }
}

class LogoutListItem extends React.Component {
  render() {
    return (
    <ListItemButton onClick={logout}>
      <ListItemIcon>
        <Logout />
      </ListItemIcon>
      <ListItemText>Logout</ListItemText>
    </ListItemButton>
    )
  }
}

/**************************************************************/
/* Functions
/**************************************************************/

const logout = () => {
  if (document.cookie.match("loggedIn=true")) {
    // TODO: I think there is a more conventional method than post for login and logout
    axios.post('http://localhost:8743/logout', null, { withCredentials: true }) // withCredentials must be true so that the response header can hold cookies
      .then(() => {
        window.location.href = "/login"
      });
  }
  window.location.href = "/login"
}
const isLoggedIn = () => {
  return document.cookie.match("loggedIn=true")
}
