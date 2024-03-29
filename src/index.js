import { CharityProjectList, CharityProject, ManageCharityProject } from './charityProjects/charityProjectViews.js';
import { userRole, Role, stringToRole, roleToString } from './role.js';
import { NavigationDrawer } from './navigationDrawer.js';
import { UsersView } from './users/UsersViews.js';

import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter, Route, Routes} from 'react-router-dom';

import { Edit, Home as HomeIcon, Place, GroupWork, VolunteerActivism, Engineering, LocationOn, Code, Person, Archive, Logout, Login as LoginIcon, AddDarkMode, LightMode, Search, Sort, FilterList, Clear, Unarchive, Delete } from '@mui/icons-material';
import { Button, Card, CardContent, CircularProgress, FormControl, FormGroup, IconButton, InputLabel, MenuItem, Select, TextField, Tooltip, Typography, Divider, CardActionArea, CssBaseline, List, ListItemButton, ListItem, ListItemIcon, Checkbox, ListItemText, ListItemSecondaryAction, Box, Container, Paper, ListItemAvatar, Avatar, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions} from '@mui/material';

import axios from 'axios';
import { cloneDeep } from 'lodash';

import {ThemeProvider} from '@emotion/react';
import {darkTheme, lightTheme, theme} from './theme.js';
import { paths } from './constants.js';

const fontSize = () => ({
    fontSize: "0.5rem"
})

class Register extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      username: {
        value: "",
        error: false,
      },
      password: {
        value: "",
        error: false,
      },
    }
  }

  register = () => {
    if (this.state.username.value === null || this.state.username.value === "")
      this.state.username.error = true
    if (this.state.password.value === null || this.state.password.value === "")
      this.state.password.error = true
    if (this.state.username.error || this.state.password.error) {
      this.setState(this.state)
      return
    }

    let user = {
      username: this.state.username.value,
      password: this.state.password.value,
      role: "user"
    }
    const registerRequest = JSON.stringify(user)

    axios.post('http://localhost:8743/register', registerRequest)
      .then((response) => {
        window.location.href = "/login"
      });
  }

  render() {
    return (
      <FormGroup style={{width: "50%", border: "1px solid #aaa", borderRadius: "10px", padding: "15px", margin: "auto", marginTop: theme.mediumMargin }} >
        <h2>Register</h2>
        <TextField
          label="Username"
          size="small"
          required
          error={this.state.username.error}
          onChange={(e) => {
            if (e.target.value !== null && e.target.value !== '') {
              this.state.username.error = false
            }
            this.state.username.value = e.target.value
            this.setState(this.state)
          }}
        />
        <TextField
          label="Password"
          type='password'
          sx={{ marginTop: theme.smallMargin }}
          size="small"
          required
          error={this.state.password.error}
          onChange={(e) => {
            if (e.target.value !== null && e.target.value !== '') {
              this.state.password.error = false
            }
            this.state.password.value = e.target.value
            this.setState(this.state)
          }}
        />
        <Button
          onClick={this.register}
          variant="contained"
          size='small'
          sx={{ marginTop: theme.smallMargin }}
        >
          Register
        </Button>
        <Button
          href="/login"
          size='small'
          style={{width: "max-content"}}
          sx={{ marginTop: theme.smallMargin }}
        >
          Login
        </Button>
      </FormGroup>
    )
  }
}

class Login extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      username: {
        value: "",
        error: false,
      },
      password: {
        value: "",
        error: false,
      },
    }
  }

  login = () => {
    if (this.state.username.value === null || this.state.username.value === "")
      this.state.username.error = true
    if (this.state.password.value === null || this.state.password.value === "")
      this.state.password.error = true
    if (this.state.username.error || this.state.password.error) {
      this.setState(this.state)
      return
    }

    let user = {
      username: this.state.username.value,
      password: this.state.password.value,
    }
    const loginRequest = JSON.stringify(user)

    axios.post('http://localhost:8743/login', loginRequest, { withCredentials: true }) // withCredentials must be true so that the response header can hold cookies
      .then((response) => {
        if (response.data.success) { // TODO: else
          window.location.href = "/"
        }
      });
  }

  render() {
    return (
      <FormGroup style={{width: "50%", border: "1px solid #aaa", borderRadius: "10px", padding: "15px", margin: "auto", marginTop: theme.mediumMargin }} >
        <h2>Login</h2>
        <TextField
          label="Username"
          size="small"
          required
          error={this.state.username.error}
          onChange={(e) => {
            if (e.target.value !== null && e.target.value !== '') {
              this.state.username.error = false
            }
            this.state.username.value = e.target.value
            this.setState(this.state)
          }}
        />
        <TextField
          label="Password"
          type='password'
          sx={{ marginTop: theme.smallMargin }}
          size="small"
          required
          error={this.state.password.error}
          onChange={(e) => {
            if (e.target.value !== null && e.target.value !== '') {
              this.state.password.error = false
            }
            this.state.password.value = e.target.value
            this.setState(this.state)
          }}
        />
        <Button
          onClick={this.login}
          variant="contained"
          size='small'
          style={{width: "max-content"}}
          sx={{ marginTop: theme.smallMargin }}
        >
          Login
        </Button>
        <Button
          href="/register"
          size='small'
          style={{width: "max-content"}}
          sx={{ marginTop: theme.smallMargin }}
        >
          Register
        </Button>
      </FormGroup>
    )
  }
}

class App extends React.Component {
  constructor() {
    super()
    let darkThemePreferenceExists = localStorage.getItem("isDarkTheme") !== null
    let darkThemePreferred = false;
    if (darkThemePreferenceExists) {
      darkThemePreferred = localStorage.getItem("isDarkTheme") === "true"
    }
    this.state = {
      isDarkTheme: darkThemePreferred,
    }
  }

  render() {
    return (
      <ThemeProvider theme={this.state.isDarkTheme ? darkTheme : lightTheme}>
      <CssBaseline />
      <div style={{display: "flex"}}>
        <NavigationDrawer isDarkTheme={this.state.isDarkTheme} onThemeToggled={this.handleThemeToggled} />

      <BrowserRouter>
        <Routes>
          <Route path={paths.charityProjectList} element={<CharityProjectList archive="notArchived"/>}/>
          <Route path={paths.archivedCharityProjectList} element={<CharityProjectList archive="archived"/>}/>
          <Route path={paths.charityProjectCreate} element={<ManageCharityProject method="post"/>}/>
          <Route path={paths.charityProjectsAmend} element={<ManageCharityProject method="put"/>}/>
          <Route path={paths.charityProject} element={<CharityProject/>}/>
          <Route path={paths.userList} element={<UsersView/>}/>
          <Route path={paths.login} element={<Login/>}/>
          <Route path={paths.register} element={<Register/>}/>
        </Routes>
      </BrowserRouter>
      </div>
      </ThemeProvider>
    )
  }

  handleThemeToggled = (e) => {
    localStorage.setItem("isDarkTheme", e.target.checked)
    this.setState({ isDarkTheme: localStorage.getItem("isDarkTheme") === "true" })
  }
}


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />)

//  TODO:
//  REQUIRED
//    View Charities and Filters/search functions
//    Auth and Users
//    Add/Edit/Delete Items (Creators)
//      For each detail, update the existing flow (form, endpoints, database) to account for each field
//        People who worked on the project (optionally linked to a user account)
//    CSV Reports
//      Query charity-projects and generate a csv from this
//      project name and/or id
//      short description
//      long description
//      charity
//      charity email
//      accenture/project contact email
//      list of technologies
//      list of people
//      location
//    Archive

//  SHOULD HAVE
//    BEFORE TAKING THIS TOO FAR, ASK FOR REQUIREMENTS
//    View Charities and Filters/search functions
//      Review the Charity List's appearance
//      Select fields to filter by such as technology or location
//      Add pagination if the number of charity projects is going to be large
//        Update search to be server-side to account for pagination (this is only a concern for large datasets that are actually paginated)
//    Auth and Users
//      Each user should have an associated email
//      Roles: creators can add items whilst editors can edit items (maybe this will be revised after my assignment)
//      Refactor Login, Register (and maybe EditUser) into UsersView component (only if it speeds up development)
//    Add/Edit/Delete Items
//      how is validation for all user entrypoints
//      Before taking this too far, ask for requirements
//      We want an endpoint for each of the resources and for each endpoint, we want a GET, POST, AND PUT method. For some endpoints, we want a DELETE method whilst for others, we want a PUT method that archives the endpoint. We want to be able to create these resources in a new webpage and then select these resources from a dropdown when creating charity projects etc
//        Technologies
//        Locations
//        Person/User
//        Charities
//          name
//          description
//          email
//          location
//        Create a document defining the endpoints (http methods for each), and the database tables that we want to maintain.
//    CSV Reports
//      Define filters and sorts before generating a report
//    Archive
//
//    responsive (mobile friendly)

//TODO
//  NICE TO HAVE
//    View Charities and Filters/search functions
//      sort options
//    Auth and Users
//      server: hash passwords
//      server side role checking to prevent privelige escelation
//    Add/Edit/Delete Items
//      Feedback on successful creation/update
//      Feedback on failed creation/update
//      Support displaying images as part of the description (support markup?) or as their own field
//      Allow admins to edit/remove user details / accounts. Currently, only the user's role can be edited.
//      Allow creators to delete or archive items other than charity projects (such as technologies)
//      Consider moving technology creation into its own webpage
//    CSV Reports
//      Support generating reports for other formats such as json
//    Archive
//
//    Make the website more responsive
//    Lets keep the API callable from anyone (even via a curl request), therefore we must have server side validation as well as client side (how to handle duplicated validation across multiple programs)
//    Don't use the default Go logger
//    Maybe we should change getCharityProjects function to not return technologies as well. What does gitlab do for their pipelines endpoint
//      charity-projects/:name/technologies
//    Use transactions for sql queries
//    Get SQL passwords for root and "ejoh" from a file or other more secure location
//    sql Scan() error checking and variable assignment
//    In the axios response handlers, have success/error popups
//    Apply length validation based on database table rules
//    Display something even if the Go server is unavailable
//    Put aside the file uploading for now as it may be hard
//    Consider how feasible it is to use SVGs
//    Add tooltip on icon hover
//    error handling
//    close sql connections
//    Abstract update, create, and delete technologies into one function (was this todo for the server or client?)



//DONE:
//  REQUIRED
//    View Charities and Filters/search functions
//      A webpage that displays a list of charity projects with limited information for each list entry
//      A webpage for displaying the charity project's full details
//      Make Charity List look better and Wrap charity project cards, three per row
//      Use a default icon if the image path string is empty, otherwise, display the image provided for each technology
//      For each charity project fetch the relevant information from the database via the Go server
//    Auth and Users
//      Roles: creators can add and archive charity projects whilst editors can edit items (maybe this will be revised after my assignment)
//      Creator/admin page: authorised users can assign other users the editor/creator roles
//      Registration page
//        server: Create User table
//        server: Query for registration
//      Generate keypair
//      Add a login endpoint that will generate a JWT using the keypair and make client store the token in a cookie
//      make the server validate each request
//      Add a logout endpoint that will clear the client's JWT cookie
//      Redirect to login if not logged in
//    Add/Edit/Delete Items
//      Charity Project Fields:
//        Name
//        Short Description
//        Long Description
//        The location of the project (for now, probably just a string, not a selection/drop-down)
//        Charity name
//        Charity email
//        Project contact (such as email or homepage (eg. github))
//        Technologies
//      Client validation (charity project):
//        the same technology cannot be selected twice
//        at least three technologies must be selected
//        name must not be empty
//        short description must not be empty
//      Client validation (technology):
//        name must not be null or an empty string
//      Editors and Creators can update or add new charity projects respectively
//        endpoint that writes to database
//      Creators can add new technologies
//        endpoint that writes to database
//      implement charity-projects/:id
//      Request technology list from server and display it in a drop down in the create charity page
//    Reports
//    Archive
//      Update the existing charity-projects/ PUT endpoint to only update the parameters provided so that we can call it with the charity project's name and archived=true
//      Make the edit charity webpage's archive button call the endpoint and add an archive button to each charity project displayed on the home page
//      Make the getcharities endpoint return archived or non-archived items or both 
//      Add front end for displaying a list of archived charities
//      Display an unarchive button for archived items
//      Make React update the charity project list when items are archived/unarchived


//    Simple install.py script for setting an admin user, and setting up the db
//    Add test data
//    A DEMONSTRATION OF THE PROJECT
//    Navbar with tabs for Home, Archive, Login/Logout, and User Management
//    Write drop database script
//    Create tables as root user. Only give the Go server the limited priveliges that it needs


//  SHOULD HAVE
//    View Charities and Filters/search functions
//    Auth and Users
//    Add/Edit/Delete Items
//    CSV Reports
//    Archive

//  NICE TO HAVE
//    View Charities and Filters/search functions
//    Auth and Users
//    Add/Edit/Delete Items
//    CSV Reports
//    Archive
//
//    Script to change the width and height of an SVG

