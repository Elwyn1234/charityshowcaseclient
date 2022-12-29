import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Card from '@mui/material/Card';
import {AppBar, Box, Button, CardContent, CircularProgress, FormControl, FormGroup, IconButton, InputLabel, MenuItem, Select, TextField, Toolbar, Tooltip, Typography} from '@mui/material';
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

    this.state = {
      loading: true,
    }

    let charityProjectName = window.location.pathname.split("/")[2]
    axios.get(`http://localhost:8743/charity-projects/${charityProjectName}`, { withCredentials: true })
      .then((charityProject) => {
        this.state.loading = false
        this.state.charityProject = charityProject.data
        console.log(this.state)
        this.setState(this.state)
      }).catch((err) => {
        if (err.response.status === 401) // TODO: implement else
          window.location.replace("/login")
      });
  }

  render() {
    if (this.state.loading)
      return (<CircularProgress style={{margin: "auto", display: 'flex', marginTop: "100px"}}/>)

    return (
      <div style={{width: "85%", margin: "auto", ...marginTop()}}>
        <CharityProjectCard charityProject={this.state.charityProject} width={"100%"} showLongDescription={true}/>
        <Button href={`/edit-charity-project/${this.state.charityProject.Name}`} variant="contained" style={marginTop()}>
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
        window.location.href = "/login"
      });
  }

  render() {
    return (
      <FormGroup style={{width: "50%", border: "1px solid #aaa", borderRadius: "10px", padding: "15px", margin: "auto", ...marginTop()}}>
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

    console.log("login: loginRequest", loginRequest)
    axios.post('http://localhost:8743/login', loginRequest, { withCredentials: true }) // withCredentials must be true so that the response header can hold cookies
      .then((response) => {
        console.log("login Response handler: Request was successful!");
        console.log(response.data)
        if (response.data.success) { // TODO: else
          console.log(response.data)
          window.location.href = "/"
        }
      });
  }

  render() {
    return (
      <FormGroup style={{width: "50%", border: "1px solid #aaa", borderRadius: "10px", padding: "15px", margin: "auto", ...marginTop()}}>
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

class ManageCharityProject extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      loading: true,
      technologyCount: 3, // TODO: aksjfh
      technology: {
        name: {
          value: '',
          error: false,
        },
        image: null,
      },
      charityProject: {
        oldName: '',
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
      technologies: null, // a list of all technologies from which the user can select from
    }
    for (let i = 0; i < 3; i++) {
      this.state.charityProject.technologies.push({ name: '', error: false })
    }

    let promises = []
    promises.push(axios.get('http://localhost:8743/technologies', { withCredentials: true }))
    if (this.props.method === "put") {
      let charityProjectName = window.location.pathname.split("/")[2]
      promises.push(axios.get(`http://localhost:8743/charity-projects/${charityProjectName}`, { withCredentials: true }))
    }

    Promise.all(promises)
      .then((responses) => {
        let technologies = responses[0].data
        let charityProject = responses[1]?.data
        console.log("tech: ", technologies)
        if (charityProject) console.log("charProj: ", charityProject)
        this.state.loading = false
        this.state.technologies = technologies

        if (charityProject) {
          this.state.charityProject.oldName = charityProject.Name
          this.state.charityProject.name.value = charityProject.Name
          this.state.charityProject.shortDescription.value = charityProject.ShortDescription
          this.state.charityProject.longDescription = charityProject.LongDescription
          this.state.charityProject.technologies = charityProject.Technologies.map((technology) => {
            return { oldName: technology.Name, name: technology.Name, error: false }
          })
        }
        this.setState(this.state)
      }).catch((err) => {
        if (err.response.status === 401) // TODO: implement else
          window.location.replace("/login")
      });
  }

  render() {
    if (this.state.loading)
      return (<CircularProgress style={{margin: "auto", display: 'flex', marginTop: "100px"}}/>)

    let technologySelects = []
    console.log(this.state.charityProject)
    this.state.charityProject.technologies.forEach((technology, i) => {
      technologySelects.push(<TechnologySelect name={technology.name} error={technology.error} onChange={this.handleTechnologySelectChange} index={i} key={i} technologies={this.state.technologies}/>)
      console.log(technologySelects)
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
            { this.props.method === "post" ? "Create" : "Update" }
          </Button>

          { this.props.method === "put" &&
            <Button
              variant="contained"
              size='small'
              style={{...marginTop(), width: "max-content"}}
              // onClick={this.createCharityProject}
            >
              Archive
            </Button>
          }
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
    axios({method: this.props.method, url: 'http://localhost:8743/charity-projects/', data: createCharityProjectRequest, withCredentials: true })
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
    axios.post('http://localhost:8743/technologies', createTechnologyRequest, { withCredentials: true })
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
    return (
      <Card style={{width: this.props.width, cursor: "pointer"}} onClick={() => window.location.href=`/charity-project/${this.props.charityProject.Name}`}>
        <CardContent>
          <Typography variant='h5'>{ this.props.charityProject.Name }</Typography>
        </CardContent>
        <CardContent >
          <Typography variant='body1'>{ this.props.charityProject.ShortDescription }</Typography>
        </CardContent>
        <CardContent style={{margin: "auto", width: "max-content"}}>
          <Tooltip title={this.props.charityProject.Technologies[0].Name}>
            <IconButton onClick={this.handleClick} style={{padding: 0}} aria-label={this.props.charityProject.Technologies[0].Name}>
              <img 
                src={this.props.charityProject.Technologies[0].SVG !== '' ? this.props.charityProject.Technologies[0].SVG : "/assets/icons/default-technology-icon.svg"}
                alt={this.props.charityProject.Technologies[0].Name}
                width="50"
                height="50"
              />
            </IconButton>
          </Tooltip>
          <Tooltip title={this.props.charityProject.Technologies[1].Name}>
            <IconButton onClick={this.handleClick} style={{padding: 0}} aria-label={this.props.charityProject.Technologies[1].Name}>
              <img 
                src={this.props.charityProject.Technologies[1].SVG !== '' ? this.props.charityProject.Technologies[1].SVG : "/assets/icons/default-technology-icon.svg"}
                alt={this.props.charityProject.Technologies[1].Name}
                width="50"
                height="50"
              />
            </IconButton>
          </Tooltip>
          <Tooltip title={this.props.charityProject.Technologies[2].Name}>
            <IconButton onClick={this.handleClick} style={{padding: 0}} aria-label={this.props.charityProject.Technologies[2].Name}>
              <img 
                src={this.props.charityProject.Technologies[2].SVG !== '' ? this.props.charityProject.Technologies[2].SVG : "/assets/icons/default-technology-icon.svg"}
                alt={this.props.charityProject.Technologies[2].Name}
                width="50"
                height="50"
              />
            </IconButton>
          </Tooltip>
        </CardContent>
        { this.props.showLongDescription && 
          <CardContent >
            <Typography variant='body1'>{ this.props.charityProject.ShortDescription }</Typography>
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
      filter: "",
      loading: true,
    }

    axios.get('http://localhost:8743/charity-projects/', { withCredentials: true })
      .then((charityProjects) => {
        this.state.loading = false
        this.state.charityProjects = charityProjects.data
        this.setState(this.state)
      }).catch((err) => { 
        if (err.response.status === 401) // TODO: implement else
          window.location.replace("/login")
      });
  }

  render() {
    if (this.state.loading)
      return (<CircularProgress style={{margin: "auto", display: 'flex', marginTop: "100px"}}/>)

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
            this.state.charityProjects.filter((value) => {
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
            }).map((charityProject, i) => <CharityProjectCard charityProject={charityProject} key={i} width={"32%"} showLongDescription={false}/>)
          }
        </Stack>
        <Button href="/create-charity-project" variant="contained" style={marginTop()}>
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
            <Button color='inherit' style={marginLeft()} href="/user-management">User Management</Button>
            <Button color='inherit' style={marginLeft()} onClick={() => {
              if (document.cookie.match("loggedIn=true")) {
                // TODO: I think there is a more conventional method than post for login and logout
                axios.post('http://localhost:8743/logout', null, { withCredentials: true }) // withCredentials must be true so that the response header can hold cookies
                  .then(() => {
                    window.location.href = "/login"
                  });
              }
              window.location.href = "/login"
            }}>
              {document.cookie.match("loggedIn=true") ? "Logout" : "Login"}
            </Button>
          </Toolbar>
        </AppBar>
        <Routes>
          <Route path="/" element={<Home archive={false}/>}/>
          <Route path="/archive" element={<Home archive={true}/>}/>
          <Route path="/create-charity-project" element={<ManageCharityProject method="post"/>}/>
          <Route path="/edit-charity-project/:name" element={<ManageCharityProject method="put"/>}/>
          <Route path="/charity-project/:name" element={<CharityProject/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/register" element={<Register/>}/>
        </Routes>
      </BrowserRouter>
    )
  }
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />)

//  TODO:
//  REQUIRED
//    View Charities and Filters/search functions
//      for now, can we just download the entire list of charity projects?
//    Auth and Users
//      Roles: creators can add and archive charity projects whilst editors can edit items (maybe this will be revised after my assignment)
//      Each user should have an associated email
//      Creator/admin page: authorised users can assign other users the editor/creator roles
//    Add/Edit/Delete Items (Creators)
//      Remember that some of these details could simply be added to the description section instead of having a dedicated field for each detail
//      for now, the below can just be strings if time is short. Eventually we want them to be optionally or mandatorally linked to a database entry for location, charity, or person/user.
//      how is validation for all user entrypoints
//      For each detail, update the existing flow (form, endpoints, database) to account for each field
//        People who worked on the project (optionally linked to a user account)
//        The location of the project (for now, probably just a string, not a selection/drop-down)
//        The name of the charity and maybe email
//        Project contact (such as email or homepage (eg. github))
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
//      Add a post endpoint: charity-projects/:name/archive
//      Make the getcharities endpoint return archived or non-archived items or both 
//      Make the edit charity webpage's archive button call the endpoint
//      Add front end for displaying a list of archived charities
//
//    A DEMONSTRATION OF THE PROJECT

//  SHOULD HAVE
//    BEFORE TAKING THIS TOO FAR, ASK FOR REQUIREMENTS
//    View Charities and Filters/search functions
//      Make Charity List look better
//      Select fields to search such as technology or location
//      Update search to be server-side to account for pagination (this is only a concern for large datasets that are actually paginated)
//    Auth and Users
//      Roles: creators can add items whilst editors can edit items (maybe this will be revised after my assignment)
//      Refactor Login, Register (and maybe EditUser) into UserManagement component (only if it speeds up development)
//    Add/Edit/Delete Items
//      Before taking this too far, ask for requirements
//      We want an endpoint for each of the resources and for each endpoint, we want a GET, POST, AND PUT method. For some endpoints, we want a DELETE method whilst for others, we want a PUT method that archives the endpoint.
//        Create a document defining the endpoints (http methods for each), and the database tables that we want to maintain.
//      IMPORTANT: Add/edit charities and select a charity (or charities) when creating charity projects etc
//        name
//        description
//        email
//        location
//      Technologies
//      Locations
//    CSV Reports
//      Define filters and sorts before generating a report
//    Archive
//
//    Maybe setup the database in scripts folder and call it from install.sh or whatever my script will be called
//    responsive (mobile friendly)

//  NICE TO HAVE
//    View Charities and Filters/search functions
//      sort options
//    Auth and Users
//      server: hash passwords
//    Add/Edit/Delete Items
//      Feedback on successful creation/update
//      Feedback on failed creation/update
//      Images as part of the description (support markup?) or as their own field
//      Users? or allow creators to edit/remove account details / accounts
//      Allow creators to delete or archive items
//      Move technology creation into its own webpage?!
//    CSV Reports
//      other formats like json
//    Archive
//
//    close sql connections
//    Lets keep the API callable from anyone (even via a curl request), therefore we must have server side validation as well as client side (how to handle duplicated validation across multiple programs)
//    Don't use the default go logger
//    Maybe we should change getCharityProjects function to not return technologies as well. What does gitlab do for pipelines
//      charity-projects/:name/technologies
//    Abstract update, create, and delete technologies into one function (was this todo for the server or client?)
//    Use transactions for sql queries
//    Get SQL passwords for root and "ejoh" from a file or other more secure location
//    sql Scan() error checking and variable assignment
//    In the axios response handlers, have success/error popups
//    Apply length validation based on table rules
//    Put aside the file uploading for now as it may be hard
//    Display something even if the Go server is down
//    Consider how feasible it is to use SVGs
//    Add tooltip on icon hover
//    error handling



//DONE:
//  REQUIRED
//    View Charities and Filters/search functions
//      Use a default icon if the image path string is empty, otherwise, display the image provided for each technology
//      For each charity project fetch the relevant information from the database via the Go server
//    Auth and Users
//      Registration page
//        server: Create User table
//        server: Query for registration
//      Generate keypair
//      Add a login endpoint that will generate a JWT using the keypair
//      make client store the token
//      make client pass the token in for all requests
//      make the server validate each request
//      Add a logout endpoint that will clear the client's JWT cookie
//      Redirect to login if not logged in
//    Add/Edit/Delete Items
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

