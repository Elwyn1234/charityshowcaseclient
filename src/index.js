import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Card from '@mui/material/Card';
import {AppBar, Box, Button, CardContent, FormControl, FormGroup, IconButton, InputLabel, MenuItem, Select, TextField, Toolbar, Tooltip, Typography} from '@mui/material';
import axios from 'axios';
import {Stack} from '@mui/system';
import {BrowserRouter, Navigate, Route, Routes} from 'react-router-dom';

const marginTop = () => ({
  marginTop: "20px"
})
const marginLeft = () => ({
  marginLeft: "20px"
})
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
      authenticated: false
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

    console.log("register: registerRequest: ", registerRequest)
    axios.post('http://localhost:8743/register', registerRequest)
      .then((response) => {
        console.log("register Response handler: Request was successful!");
        console.log(response)
        if (response.status) {
          this.props.onRegistered(user)
          this.state.authenticated = true
          this.setState(this.state)
        }
      });
  }

  render() {
    return (
      <FormGroup style={{width: "50%", border: "1px solid #aaa", borderRadius: "10px", padding: "15px", margin: "auto", ...marginTop()}}>
        {this.state.authenticated && (<Navigate to="/"/>)}
        <h2>Register</h2>
        <TextField
          label="Username"
          style={marginTop()}
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
          style={marginTop()}
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
          style={{...marginTop(), width: "max-content"}}
        >
          Register
        </Button>
        <Button
          href="/register"
          size='small'
          style={{...marginTop(), width: "max-content"}}
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
      authenticated: false,
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
      name: this.state.username.value,
      password: this.state.password.value,
    }
    const loginRequest = JSON.stringify(user)

    console.log("login: loginRequest", loginRequest)
    axios.post('http://localhost:8743/login', loginRequest)
      .then((response) => {
        console.log("login Response handler: Request was successful!");
        if (true) {
          this.props.onAuthenticated(response.data.user)
          this.state.authenticated = true
          this.setState(this.state)
        }
      });
  }

  render() {
    return (
      <FormGroup style={{width: "50%", border: "1px solid #aaa", borderRadius: "10px", padding: "15px", margin: "auto", ...marginTop()}}>
        {this.state.authenticated && (<Navigate to="/"/>)}
        <h2>Login</h2>
        <TextField
          label="Username"
          style={marginTop()}
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
          style={marginTop()}
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
          style={{...marginTop(), width: "max-content"}}
        >
          Login
        </Button>
        <Button
          href="/register"
          size='small'
          style={{...marginTop(), width: "max-content"}}
        >
          Register
        </Button>
      </FormGroup>
    )
  }
}

class TechnologySelect extends React.Component {
  render() {
    const menuItems = []
    for (let i = 0; i < this.props.technologies.length; i++) {
      menuItems.push(<MenuItem value={this.props.technologies[i]} dense={true} key={i}>{this.props.technologies[i]}</MenuItem>)
    }
    return (
      <FormControl style={{...marginTop(), width: "30%"}} size="small">
        <InputLabel id="tech-stack-label1"> Tech 1</InputLabel>
        <Select
          labelId='tech-stack-label1'
          label="Tech 1"
          value={this.props.name}
          required
          error={this.props.error}
          onChange={(e) => {
            if (e.target.value !== null && e.target.value !== '') {
              this.props.onChange(e.target.value, false, this.props.index)
            }
          }}
        >
          {menuItems}
        </Select>
      </FormControl>
    )
  }
}

class CreateCharityProject extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      technologyCount: 3, // TODO: aksjfh
      technology: {
        name: {
          value: '',
          error: false,
        },
        image: null,
      },
      charityProject: {
        name: {
          value: '',
          error: false,
        },
        shortDescription: {
          value: '',
          error: false,
        },
        longDescription: '',
        technologies: [],
      },
      technologies: [],
    }

    axios.get('http://localhost:8743/getTechnologies')
      .then((technologies) => {
        console.log(technologies.data)
        this.state.technologies = technologies.data
        for (let i = 0; i < 3; i++) {
          this.state.charityProject.technologies.push({ name: '', error: false })
        }
        this.setState(this.state)
      });
  }

  createCharityProject = () => {
    let valid = true;
    if (this.state.charityProject.name.value === null || this.state.charityProject.name.value === "") {
      this.state.charityProject.name.error = true
      valid = false
    }
    if (this.state.charityProject.shortDescription.value === null || this.state.charityProject.shortDescription.value === "") {
      this.state.charityProject.shortDescription.error = true
      valid = false
    }
    this.state.charityProject.technologies.forEach((technology, i) => {
      if (technology.name === null || technology.name === '') {
        technology.error = true
        valid = false
      }
      this.state.charityProject.technologies.forEach((otherTechnology, j) => {
        if (i === j) return
        if (technology.name === otherTechnology.name) {
          technology.error = true
          otherTechnology.error = true
          valid = false
        }
      })
    })
    if (!valid) {
      this.setState(this.state)
      return
    }

    let charityProject = {
      name: this.state.charityProject.name.value,
      shortDescription: this.state.charityProject.shortDescription.value,
      longDescription: this.state.charityProject.longDescription,
      techStack: []
    }
    this.state.charityProject.technologies.forEach((technology) => {
      charityProject.techStack.push({name: technology.name})
    })
    const createCharityProjectRequest = JSON.stringify(charityProject)

    console.log("createCharityProject: createCharityProjectRequest", createCharityProjectRequest)
    axios.post('http://localhost:8743/createCharityProject', createCharityProjectRequest)
      .then(() => {
        console.log("createCharityProject Response handler: Request was successful!");
      });
  }

  createTechnology = () => { // TODO: image uploading is not implemented, currently the name is the only field used
    if (this.state.technology.name.value === null || this.state.technology.name.value === "") {
      this.state.technology.name.error = true
      this.setState(this.state)
      return
    }
    let technology = {
      name: this.state.technology.name.value
    }
    const createTechnologyRequest = JSON.stringify(technology)

    console.log("createTechnology: createTechnologyRequest", createTechnologyRequest)
    axios.post('http://localhost:8743/createTechnology', createTechnologyRequest)
      .then(() => {
        console.log("createTechnology Response handler: Request was successful!");
      });
  }

  handleTechnologySelectChange = (name, error, i) => {
    this.state.charityProject.technologies[i] = {
      name: name,
      error: error,
    }
    this.setState(this.state)
  }

  render() {
    let technologySelects = []
    this.state.charityProject.technologies.forEach((technology, i) => {
      technologySelects.push(<TechnologySelect name={technology.name} error={technology.error} onChange={this.handleTechnologySelectChange} index={i} key={i} technologies={this.state.technologies}/>)
    })
    return (
      <Stack direction="row" spacing={2} justifyContent="center" style={marginTop()}>
        <FormGroup style={{width: "60%", border: "1px solid #aaa", borderRadius: "10px", padding: "15px"}}>
          <h2>Charity Project</h2>
          <TextField
            label="Name"
            style={marginTop()}
            size="small"
            required
            error={this.state.charityProject.name.error}
            onChange={(e) => {
              if (e.target.value !== null && e.target.value !== '') {
                this.state.charityProject.name.error = false
              }
              this.state.charityProject.name.value = e.target.value
              this.setState(this.state)
            }}
          />
          <TextField
            label="Summary"
            style={marginTop()}
            size="small"
            required
            error={this.state.charityProject.shortDescription.error}
            onChange={(e) => {
              if (e.target.value !== null && e.target.value !== '') {
                this.state.charityProject.shortDescription.error = false
              }
              this.state.charityProject.shortDescription.value = e.target.value
              this.setState(this.state)
            }}
          />
          <TextField
            label="Description"
            style={marginTop()}
            size="small"
            onChange={(e) => {
              this.state.charityProject.longDescription = e.target.value
              this.setState(this.state)
            }}
          />
  
          <Stack direction="row" spacing="auto" justifyContent="center">
            {technologySelects}
          </Stack>
  
          <Button
            variant="contained"
            size='small'
            style={{...marginTop(), width: "max-content"}}
            onClick={() => {
              this.state.charityProject.technologies.push({ name: '', error: false, key: this.state.charityProject.technologies.length})
              this.setState(this.state)
            }}>
              Add Technology
          </Button>
  
          <Button
            variant="contained"
            size='small'
            style={{...marginTop(), width: "max-content"}}
            onClick={this.createCharityProject}
          >
            Create
          </Button>
        </FormGroup>

        <FormGroup style={{width: "20%", border: "1px solid #aaa", borderRadius: "10px", padding: "15px"}}>
          <h2>Technology</h2>
          <TextField
            label="Name"
            style={marginTop()}
            size="small"
            required
            error={this.state.technology.name.error}
            onChange={(e) => {
              if (e.target.value !== null && e.target.value !== '') {
                this.state.technology.name.error = false
              }
              this.state.technology.name.value = e.target.value
              this.setState(this.state)
            }}
          />
          <Button
            variant="contained"
            size='small'
            style={{...marginTop(), width: "max-content"}}
            component="label"
            onChange={() => this.setState({...this.state, technology: {...this.state.technology, image: document.getElementById('techFile').files[0]}})}
          >
            Upload Image
            <input id='techFile' type='file' hidden/>
          </Button>
          <Button
            variant="contained"
            size='small'
            style={{...marginTop(), width: "max-content"}}
            onClick={this.createTechnology}
          >
            Create
          </Button>
        </FormGroup>
      </Stack>
    )
  }
}
          //<Button variant="contained" style={{...fontSize(), ...{marginTop: "10px", width: "20%"}}}>Create</Button>

class CharityProjectCard extends React.Component {
  render() {
    console.log("PROPS.V.TechStack: ", this.props.v.TechStack)
    console.log("PROPS.V.TechStack.SVG: ", this.props.v.TechStack[0].SVG)
    return (
      <Card style={{width: "32%"}}>
        <CardContent>
          <Typography variant='h5'>{ this.props.v.Name }</Typography>
        </CardContent>
        <CardContent >
          <Typography variant='body1'>{ this.props.v.ShortDescription }</Typography>
        </CardContent>
        <CardContent style={{margin: "auto", width: "max-content"}}>
          <Tooltip title={this.props.v.TechStack[0].Name}>
            <IconButton onClick={this.handleClick} style={{padding: 0}} aria-label={this.props.v.TechStack[0].Name}>
              <img 
                src={this.props.v.TechStack[0].SVG !== '' ? this.props.v.TechStack[0].SVG : "assets/icons/icons8-react.svg"}
                alt={this.props.v.TechStack[0].Name}
                width="50"
                height="50"
              />
            </IconButton>
          </Tooltip>
          <Tooltip title={this.props.v.TechStack[1].Name}>
            <IconButton onClick={this.handleClick} style={{padding: 0}} aria-label={this.props.v.TechStack[1].Name}>
              <img 
                src={this.props.v.TechStack[1].SVG !== '' ? this.props.v.TechStack[1].SVG : "assets/icons/default-technology-icon.svg"}
                alt={this.props.v.TechStack[1].Name}
                width="50"
                height="50"
              />
            </IconButton>
          </Tooltip>
          <Tooltip title={this.props.v.TechStack[2].Name}>
            <IconButton onClick={this.handleClick} style={{padding: 0}} aria-label={this.props.v.TechStack[2].Name}>
              <img 
                src={this.props.v.TechStack[2].SVG !== '' ? this.props.v.TechStack[2].SVG : "assets/icons/default-technology-icon.svg"}
                alt={this.props.v.TechStack[2].Name}
                width="50"
                height="50"
              />
            </IconButton>
          </Tooltip>
        </CardContent>
      </Card>
    );
  }
}

class Home extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      filter: ""
    }
  }

  render() {
    return (
      <div style={{width: "85%", margin: "auto", ...marginTop()}}>
        <TextField
          label="Name"
          style={marginTop()}
          size="small"
          onChange={(e) => {
            this.state.filter = e.target.value
            this.setState(this.state)
          }}
        />
        <Stack direction="row" spacing={"2%"} justifyContent="center" style={marginTop()}>
          {
            this.props.v.filter((value) => {
              console.log(this.state.filter)
              //let match = false
              if (value.Name.toLowerCase().match(this.state.filter.toLowerCase()) ||
                value.ShortDescription.toLowerCase().match(this.state.filter.toLowerCase()) ||
                value.LongDescription.toLowerCase().match(this.state.filter.toLowerCase()) ||
                value.TechStack.find((technology) => {
                  if (technology.Name.toLowerCase().match(this.state.filter.toLowerCase()))
                    return true
                  return false
                })
              )
                return true
              return false
              /*
              value.TechStack.forEach((technology) => {
                if (technology.Name.match(this.state.filter))
                  match = true
              })
              return match
              */
            }).map((charityProject, i) => <CharityProjectCard v={charityProject} key={i}/>)
          }
        </Stack>
        <Button href="/createCharityProject" variant="contained" style={marginTop()}>
          <Typography variant='body1'>New Charity Project</Typography>
        </Button>
      </div>
    );
  }
}

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  render() {
    return (
      <BrowserRouter>
        <AppBar position='static'>
          <Toolbar>
            <div style={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            <Typography variant='h5' style={{cursor: "pointer", width: "max-content"}} onClick={() => window.location.href="/"}>Charity Showcase</Typography>
            </div>
            <Button color='inherit' style={marginLeft()} href="/archive">Archive</Button>
            <Button color='inherit' style={marginLeft()} href="/userManagement">User Management</Button>
            <Button color='inherit' style={marginLeft()} href="/login" onClick={() => {
              this.state.loggedInUser = undefined 
              this.setState(this.state)
            }}>
              {this.state.loggedInUser ? "Logout" : "Login"}
            </Button>
          </Toolbar>
        </AppBar>
        <Routes>
          <Route path="/" element={<Home v={this.props.v}/>}/>
          <Route path="/createCharityProject" element={<CreateCharityProject/>}/>
          <Route path="/login" element={<Login onAuthenticated={(user) => {
            this.state.loggedInUser = user
            this.setState(this.state)
          }}/>}/>
          <Route path="/register" element={<Register onRegistered={(user) => {
            this.state.loggedInUser = user
            this.setState(this.state)
          }}/>}/>
        </Routes>
      </BrowserRouter>
    )
  }
}

axios.get('http://localhost:8743/getCharityProjects', {params: {page: 0}})
  .then((charityProject) => {
    root.render(<App v={charityProject.data}/>)
  });

const root = ReactDOM.createRoot(document.getElementById("root"));

//  TODO:
//    Refactor Login, Register (and maybe EditUser) into UserManagement component
//    sql Scan() error checking and variable assignment
//    In the axios response handlers, have success/error popups
//    When two of the same technology are selected and are displayed as errors, both should be given error=false if one is changed
//    Apply length validation based on table rules
//    Put aside the file uploading for now as it may be hard
//    Display something even if the Go server is down
//    Consider how feasible it is to use SVGs
//    Make Charity List look nice
//    Add tooltip on icon hover
//    error handling
// 
//  DONE:
//    Use a default icon if the path string is empty
//    Add Filters/search functions
//    Write drop database script
//    Create tables as root user. Only give the Go server the limited priveliges that it needs
//    source title and description from server database 
//    Script to change the width and height of an SVG
//
//  createTechnology:
//  TODO:
//    close sql connections
//    image uploading not handled
//  DONE:
//    server writes to database when it receives a request
//  Client side name validation:
//    name must not be null or an empty string
//
//  Home:
//  TODO:
//  DONE:
//    Get charity projects from database
//
//  CreateCharityProject:
//  TODO:
//    Move technology creation into its own webpage?!
//  DONE:
//    Request technology list from server
//    Server handles request and writes to relevant databases
//    validation:
//      the same technology cannot be selected twice
//      at least three technologies must be selected
//      name must not be empty
//      short description must not be empty
// 
//  Login:
//  TODO:
//    lets not return the passwords on a successful request
//    server: hash passwords
//    Creator admin page: authorised users can assign other users the editor/creator roles
//    Redirect to login if not logged in
//    Use a token for this? for now, just do client side authorisation which is insecure but we can change that later
//    Users should have a role
//      User: Readonly
//      Editors: Update operations
//      Creators: Create items
//  DONE:
//    Registration page
//      server: Create User table
//      server: Query for registration
//    Login page
//      server: Query for authentication
//
//  Navbar/Appbar:
//  TODO:
//    Should have tab for Home, Archive, Login/Logout, and User Management
//  DONE:
