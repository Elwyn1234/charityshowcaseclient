import { paths } from './constants.js';
import { userRole, Role } from './role.js';

import React, {useState} from 'react';
import { Home as HomeIcon, GroupWork, VolunteerActivism, Engineering, LocationOn, Code, Person, Archive, Logout, Login as LoginIcon, AppRegistration, DarkMode, LightMode } from '@mui/icons-material';
import {} from '@mui/icons-material';
import { Divider, Drawer, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, ListSubheader, Switch, Toolbar, Tooltip, Typography} from '@mui/material';
import axios from 'axios';

export { NavigationDrawer }

class NavigationDrawer extends React.Component {
  constructor(props) {
    super(props)
  }
  
  render() {
    /**************************************************************/
    /* List Items
    /**************************************************************/

    const homeListItem = 
      <ListItemButton href={paths.home} selected={ window.location.pathname === paths.home }>
        <ListItemIcon>
          <HomeIcon />
        </ListItemIcon>
        <ListItemText primary="Home" />
      </ListItemButton>

    const charityProjectsListItem = 
      <ListItemButton href={paths.charityProjectList} selected={ window.location.pathname === paths.charityProjectList }>
        <ListItemIcon>
          <GroupWork />
        </ListItemIcon>
        <ListItemText primary="Charity Projects" />
      </ListItemButton>
    
    const charitiesListItem = 
      <ListItemButton href={paths.charityList} selected={ window.location.pathname === paths.charityList}>
        <ListItemIcon>
          <VolunteerActivism />
        </ListItemIcon>
        <ListItemText primary="Charities" />
      </ListItemButton>

    const contributorsListItem = 
      <ListItemButton href={paths.contributorList} selected={ window.location.pathname === paths.contributorList}>
        <ListItemIcon>
          <Engineering />
        </ListItemIcon>
        <ListItemText primary="Contributors" />
      </ListItemButton>

    const locationsListItem =
      <ListItemButton href={paths.locationList} selected={ window.location.pathname === paths.locationList}>
        <ListItemIcon>
          <LocationOn />
        </ListItemIcon>
        <ListItemText primary="Locations" />
      </ListItemButton>

    const technologiesListItem =
      <ListItemButton href={paths.technologyList} selected={ window.location.pathname === paths.technologyList}>
        <ListItemIcon>
          <Code />
        </ListItemIcon>
        <ListItemText primary="Technologies" />
      </ListItemButton>

    const usersListItem =
      <ListItemButton href={paths.userList} selected={ window.location.pathname === paths.userList}>
        <ListItemIcon>
          <Person />
        </ListItemIcon>
        <ListItemText primary="Users" />
      </ListItemButton>

    const archiveListItem =
      <ListItemButton href={paths.archivedCharityProjectList} selected={ window.location.pathname === paths.archivedCharityProjectList}>
        <ListItemIcon>
          <Archive />
        </ListItemIcon>
        <ListItemText primary="Archive" />
      </ListItemButton>

    const loginListItem =
      <ListItemButton href={paths.login} selected={ window.location.pathname === paths.login}>
        <ListItemIcon>
          <LoginIcon />
        </ListItemIcon>
        <ListItemText>Login</ListItemText>
      </ListItemButton>

    const registerListItem =
      <ListItemButton href={paths.register} selected={ window.location.pathname === paths.register}>
        <ListItemIcon>
          <AppRegistration />
        </ListItemIcon>
        <ListItemText>Register</ListItemText>
      </ListItemButton>

    const logoutListItem =
      <ListItemButton onClick={logout} >
        <ListItemIcon>
          <Logout />
        </ListItemIcon>
        <ListItemText>Logout</ListItemText>
      </ListItemButton>

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
          { homeListItem }
          { charityProjectsListItem }
          { charitiesListItem }
          { contributorsListItem }
          { locationsListItem }
          { technologiesListItem }

          { userRole() >= Role.Creator && <Divider /> }
          { userRole() >= Role.Creator && <ListSubheader>Administration</ListSubheader> }
          { userRole() >= Role.Admin && usersListItem }
          { userRole() >= Role.Creator && archiveListItem }

          <Divider />
          { isLoggedIn() ? logoutListItem : loginListItem }
          { isLoggedIn() ? null : registerListItem }

          <ListItem>
            <ListItemIcon>
              <DarkMode />
            </ListItemIcon>
            <ListItemText primary="Dark Mode" />
            <Switch edge="end" onChange={this.props.onThemeToggled} checked={this.props.isDarkTheme} />
          </ListItem>
        </List>
      </Drawer>
    )
  }
}

/**************************************************************/
/* AAAAAAAAAAAA
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
