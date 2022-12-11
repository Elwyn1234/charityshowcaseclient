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

class CharityProject extends React.Component {
  constructor(props) {
    super(props)

    let charityProjectName = window.location.pathname.split("/")[2]
    let charityProject = this.props.v.find((charityProject) => {
      return charityProject.Name === charityProjectName
    })

    this.state = {
      charityProject: charityProject
    }
  }

  render() {
    return (
      <div style={{width: "85%", margin: "auto", ...marginTop()}}>
            <CharityProjectCard v={this.state.charityProject} width={"100%"} showLongDescription={true}/>
        <Button href={`/editCharityProject/${this.state.charityProject.Name}`} variant="contained" style={marginTop()}>
          <Typography variant='body1'>Edit</Typography>
        </Button>
      </div>
    );
  }
}

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
    console.log(this.props.technologies)
    for (let i = 0; i < this.props.technologies.length; i++) {
      menuItems.push(<MenuItem value={this.props.technologies[i]} dense={true} key={i}>{this.props.technologies[i]}</MenuItem>)
    }
    return (
      <FormControl style={{...marginTop(), width: "30%"}} size="small">
        <InputLabel id="tech-stack-label1">{`Tech ${this.props.index + 1}`}</InputLabel>
        <Select
          labelId='tech-stack-label1'
          label={`Tech ${this.props.index + 1}`}
          value='go'
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

class ManageCharityProject extends React.Component {
  constructor(props) {
    super(props)

    let technologyCount = 3;
    let charityProject = {
      Name: '',
      ShortDescription: '',
      LongDescription: '',
      Technologies: []
    }
    for (let i = 0; i < 3; i++) {
      charityProject.Technologies.push({ name: '', error: false })
    }

    if (this.props.method === "put") {
      let charityProjectName = window.location.pathname.split("/")[2]
      charityProject = this.props.v.find((charityProject) => {
        return charityProject.Name === charityProjectName
      })
      charityProject.Technologies = charityProject.Technologies.map((technology) => {
        return { oldName: technology.Name, name: technology.Name, error: false }
      })
    }

    this.state = {
      technologyCount: technologyCount, // TODO: aksjfh
      technology: {
        name: {
          value: '',
          error: false,
        },
        image: null,
      },
      charityProject: {
        oldName: charityProject.Name,
        name: {
          value: charityProject.Name,
          error: false,
        },
        shortDescription: {
          value: charityProject.ShortDescription,
          error: false,
        },
        longDescription: charityProject.LongDescription,
        technologies: charityProject.Technologies,
      },
      technologies: null, // a list of all technologies from which the user can select from
    }

    axios.get('http://localhost:8743/technologies')
      .then((technologies) => {
        console.log(technologies.data)
        this.state.technologies = technologies.data
        this.setState(this.state)
      });
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
            value={this.state.charityProject.name.value}
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
            value={this.state.charityProject.shortDescription.value}
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
            value={this.state.charityProject.longDescription}
            onChange={(e) => {
              this.state.charityProject.longDescription = e.target.value
              this.setState(this.state)
            }}
          />
  
          { this.state.technologies && 
            <Stack direction="row" spacing="auto" justifyContent="center">
              {technologySelects}
            </Stack>
          }
  
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
            { this.props.method == "post" ? "Create" : "Update" }
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
      oldName: this.state.charityProject.oldName,
      name: this.state.charityProject.name.value,
      shortDescription: this.state.charityProject.shortDescription.value,
      longDescription: this.state.charityProject.longDescription,
      technologies: []
    }
    this.state.charityProject.technologies.forEach((technology) => {
      charityProject.technologies.push({oldName: technology.oldName, name: technology.name})
    })
    const createCharityProjectRequest = JSON.stringify(charityProject)

    console.log("createCharityProject: createCharityProjectRequest", createCharityProjectRequest)
    axios({method: this.props.method, url: 'http://localhost:8743/charity-projects', data: createCharityProjectRequest})
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
    axios.post('http://localhost:8743/technologies', createTechnologyRequest)
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
}
          //<Button variant="contained" style={{...fontSize(), ...{marginTop: "10px", width: "20%"}}}>Create</Button>

class CharityProjectCard extends React.Component {
  render() {
    console.log("PROPS.V.Technologies: ", this.props.v.Technologies)
    console.log("PROPS.V.Technologies.SVG: ", this.props.v.Technologies[0].SVG)
    return (
      <Card style={{width: this.props.width, cursor: "pointer"}} onClick={() => window.location.href=`/charityProject/${this.props.v.Name}`}>
        <CardContent>
          <Typography variant='h5'>{ this.props.v.Name }</Typography>
        </CardContent>
        <CardContent >
          <Typography variant='body1'>{ this.props.v.ShortDescription }</Typography>
        </CardContent>
        <CardContent style={{margin: "auto", width: "max-content"}}>
          <Tooltip title={this.props.v.Technologies[0].Name}>
            <IconButton onClick={this.handleClick} style={{padding: 0}} aria-label={this.props.v.Technologies[0].Name}>
              <img 
                src={this.props.v.Technologies[0].SVG !== '' ? this.props.v.Technologies[0].SVG : "/assets/icons/icons8-react.svg"}
                alt={this.props.v.Technologies[0].Name}
                width="50"
                height="50"
              />
            </IconButton>
          </Tooltip>
          <Tooltip title={this.props.v.Technologies[1].Name}>
            <IconButton onClick={this.handleClick} style={{padding: 0}} aria-label={this.props.v.Technologies[1].Name}>
              <img 
                src={this.props.v.Technologies[1].SVG !== '' ? this.props.v.Technologies[1].SVG : "/assets/icons/default-technology-icon.svg"}
                alt={this.props.v.Technologies[1].Name}
                width="50"
                height="50"
              />
            </IconButton>
          </Tooltip>
          <Tooltip title={this.props.v.Technologies[2].Name}>
            <IconButton onClick={this.handleClick} style={{padding: 0}} aria-label={this.props.v.Technologies[2].Name}>
              <img 
                src={this.props.v.Technologies[2].SVG !== '' ? this.props.v.Technologies[2].SVG : "/assets/icons/default-technology-icon.svg"}
                alt={this.props.v.Technologies[2].Name}
                width="50"
                height="50"
              />
            </IconButton>
          </Tooltip>
        </CardContent>
        { this.props.showLongDescription && 
          <CardContent >
            <Typography variant='body1'>{ this.props.v.ShortDescription }</Typography>
          </CardContent>
        }
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
                value.Technologies.find((technology) => {
                  if (technology.Name.toLowerCase().match(this.state.filter.toLowerCase()))
                    return true
                  return false
                })
              )
                return true
              return false
              /*
              value.Technologies.forEach((technology) => {
                if (technology.Name.match(this.state.filter))
                  match = true
              })
              return match
              */
            }).map((charityProject, i) => <CharityProjectCard v={charityProject} key={i} width={"32%"} showLongDescription={false}/>)
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
          <Route path="/createCharityProject" element={<ManageCharityProject method="post"/>}/>
          <Route path="/editCharityProject/:name" element={<ManageCharityProject v={this.props.v} method="put"/>}/>
          <Route path="/charityProject/:name" element={<CharityProject v={this.props.v}/>}/>
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

axios.get('http://localhost:8743/charity-projects', {params: {page: 0}})
  .then((charityProjects) => {
    root.render(<App v={charityProjects.data}/>)
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
//    add feedback on successful creation
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
