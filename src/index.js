import { userRole, Role, stringToRole, roleToString } from './role.js';
import { NavigationDrawer } from './navigationDrawer.js';

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { Edit, Home as HomeIcon, Place, GroupWork, VolunteerActivism, Engineering, LocationOn, Code, Person, Archive, Logout, Login as LoginIcon, AddDarkMode, LightMode, Search, Sort, FilterList, Clear, Unarchive, Delete } from '@mui/icons-material';
import {} from '@mui/icons-material';
import { Box, Button, Card, CardHeader, CardActions, CardContent, CircularProgress, FormControl, FormGroup, IconButton, InputLabel, MenuItem, Select, TextField, Tooltip, Typography, Divider, CardActionArea} from '@mui/material';
import axios from 'axios';
import {Stack} from '@mui/system';
import {BrowserRouter, Route, Routes} from 'react-router-dom';

import './index.css';

const marginTop = () => ({
  marginTop: "20px"
})
const marginLeft = () => ({
  marginLeft: "20px"
})
const fontSize = () => ({
    fontSize: "0.5rem"
})

class UserManagement extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      loading: true,
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
      <div style={{display: "flex", flexDirection: "column", minWidth: "max-content", width: "50%", margin: "auto", ...marginTop()}}>
        {
          this.state.users.map((user, i) =>
            <Card style={{...marginTop(), display: "flex", gap: "3rem", padding: "1rem"}} variant="outlined" key={i}>
              <CardContent style={{flexGrow: 1, margin: "auto", padding: 0}}>
                <Typography>{ user.Username }</Typography>
              </CardContent>
              <div style={{margin: "auto"}}>
                <FormControl size="small">
                  <InputLabel id="user-select-label">Role</InputLabel>
                  <Select
                    labelId='user-select-label'
                    label={`Role`}
                    value={user.Role}
                    required
                    onChange={(e) => {
                      if (e.target.value !== null && e.target.value !== '') { // TODO: is this condition redundant
                        this.state.users[i].Role = e.target.value
                        this.setState(this.state)
                        // TODO: do we need to setState here
                      }
                    }}
                  >
                    <MenuItem value={Role.User} dense={true} key={0}>User</MenuItem>
                    <MenuItem value={Role.Editor} dense={true} key={1}>Editor</MenuItem>
                    <MenuItem value={Role.Creator} dense={true} key={2}>Creator</MenuItem>
                    <MenuItem value={Role.Admin} dense={true} key={3}>Admin</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <Button
                onClick={(e) => {
                  let jsonUser = JSON.stringify({
                    username: user.Username,
                    role: roleToString(this.state.users[i].Role)
                  })
                  axios.put('http://localhost:8743/users/', jsonUser, { withCredentials: true })
                    .then((users) => {
                    }).catch((err) => { 
                      if (err.response && err.response.status === 401) // TODO: implement else
                        window.location.replace("/login")
                    });
                }}
                variant="contained"
                size='small'
                style={{height: "2.5rem", width: "max-content", margin: "auto"}}
              >
                Save
              </Button>
            </Card>
        )}
      </div>
    );
  }
}

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
      <div style={{width: "85%", margin: "auto", ...marginTop()}}>
        <CharityProjectCardLarge charityProject={this.state.charityProject} width={"80%"} showLongDescription={true}/>
        { userRole() >= Role.Editor && 
          <Button href={`/edit-charity-project/${this.state.charityProject.Name}`} variant="contained" style={marginTop()}>
            <Typography variant='body1'>Edit</Typography>
          </Button>
        }
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

    axios.post('http://localhost:8743/login', loginRequest, { withCredentials: true }) // withCredentials must be true so that the response header can hold cookies
      .then((response) => {
        if (response.data.success) { // TODO: else
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
        charityName: '',
        charityEmail: '',
        projectEmail: {
          value: '',
          error: false,
        },
        location: {
          value: '',
          error: false,
        },
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
        this.state.loading = false
        this.state.technologies = technologies

        if (charityProject) {
          this.state.charityProject.oldName = charityProject.Name
          this.state.charityProject.name.value = charityProject.Name
          this.state.charityProject.shortDescription.value = charityProject.ShortDescription
          this.state.charityProject.longDescription = charityProject.LongDescription
          this.state.charityProject.charityName = charityProject.CharityName
          this.state.charityProject.charityEmail = charityProject.CharityEmail
          this.state.charityProject.projectEmail.value = charityProject.ProjectEmail
          this.state.charityProject.location.value = charityProject.Location
          this.state.charityProject.archived = charityProject.Archived
          this.state.charityProject.technologies = charityProject.Technologies.map((technology) => {
            return { oldName: technology.Name, name: technology.Name, error: false }
          })
        }
        this.setState(this.state)
      }).catch((err) => {
        if (err.response && err.response.status === 401) // TODO: implement else
          window.location.replace("/login")
      });
  }

  render() {
    if (this.state.loading)
      return (<CircularProgress style={{margin: "auto", display: 'flex', marginTop: "100px"}}/>)

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
          <TextField
            label="Charity Name"
            style={marginTop()}
            size="small"
            value={this.state.charityProject.charityName}
            onChange={(e) => {
              this.state.charityProject.charityName = e.target.value
              this.setState(this.state)
            }}
          />
          <TextField
            label="Charity Email"
            style={marginTop()}
            size="small"
            value={this.state.charityProject.charityEmail}
            onChange={(e) => {
              this.state.charityProject.charityEmail = e.target.value
              this.setState(this.state)
            }}
          />
          <TextField
            label="Project Email"
            style={marginTop()}
            size="small"
            required
            value={this.state.charityProject.projectEmail.value}
            error={this.state.charityProject.projectEmail.error}
            onChange={(e) => {
              if (e.target.value !== null && e.target.value !== '') {
                this.state.charityProject.projectEmail.error = false
              }
              this.state.charityProject.projectEmail.value = e.target.value
              this.setState(this.state)
            }}
          />
          <TextField
            label="Location"
            style={marginTop()}
            size="small"
            required
            value={this.state.charityProject.location.value}
            error={this.state.charityProject.location.error}
            onChange={(e) => {
              if (e.target.value !== null && e.target.value !== '') {
                this.state.charityProject.location.error = false
              }
              this.state.charityProject.location.value = e.target.value
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

          { 
            // this.props.method === "put" &&
            // <Button
            //   variant="contained"
            //   size='small'
            //   style={{...marginTop(), width: "max-content"}}
            //   // onClick={this.createCharityProject} // TODO: make work
            // >
            //   {this.state.charityProject.archived ? "Remove from Archive" : "Archive"}
            // </Button>
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
    if (this.state.charityProject.projectEmail.value === null || this.state.charityProject.projectEmail.value === "") {
      this.state.charityProject.projectEmail.error = true
      valid = false
    }
    if (this.state.charityProject.location.value === null || this.state.charityProject.location.value === "") {
      this.state.charityProject.location.error = true
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
      charityName: this.state.charityProject.charityName,
      charityEmail: this.state.charityProject.charityEmail,
      projectEmail: this.state.charityProject.projectEmail.value,
      location: this.state.charityProject.location.value,
      technologies: []
    }
    this.state.charityProject.technologies.forEach((technology) => {
      charityProject.technologies.push({oldName: technology.oldName, name: technology.name})
    })
    const createCharityProjectRequest = JSON.stringify(charityProject)

    axios({method: this.props.method, url: 'http://localhost:8743/charity-projects/', data: createCharityProjectRequest, withCredentials: true })
      .then(() => {
      }).catch((err) => { 
        if (err.response && err.response.status === 401) // TODO: implement else
          window.location.replace("/login")
      });;
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

    axios.post('http://localhost:8743/technologies', createTechnologyRequest, { withCredentials: true })
      .then(() => {
      }).catch((err) => { 
        if (err.response && err.response.status === 401) // TODO: implement else
          window.location.replace("/login")
      });;
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
class CharityProjectCardLarge extends React.Component {
  render() {
    return (
      <Card variant="outlined" style={{minWidth: this.props.width, maxWidth: this.props.width, margin: this.props.showLongDescription ? "auto" : "0", ...marginTop() }}>
        <CardContent style={{flexGrow: 1}}>
          { this.props.charityProject.Location &&
            <div style={{display: "flex"}}>
              <Place />
              <Typography variant='body1'>{ this.props.charityProject.Location }</Typography>
            </div>
          }
          { this.props.charityProject.CharityName &&
            <div>
              <p style={{marginBottom: 0}}>Charity Name</p>
              <Typography variant='body1'>{ this.props.charityProject.CharityName }</Typography>
            </div>
          }
          { this.props.charityProject.CharityEmail &&
            <div>
              <p style={{marginBottom: 0}}>Charity Email</p>
              <Typography variant='body1'>{ this.props.charityProject.CharityEmail }</Typography>
            </div>
          }
          { this.props.charityProject.ProjectEmail &&
            <div>
              <p style={{marginBottom: 0}}>Project Email</p>
              <Typography variant='body1'>{ this.props.charityProject.ProjectEmail }</Typography>
            </div>
          }
        </CardContent>

        <CardContent >
          <Typography variant='body1'>{ this.props.charityProject.LongDescription }</Typography>
        </CardContent>
      </Card>
    );
  }
}
class CharityProjectCardMedium extends React.Component {
  render() {
    return ( // Styling has to be applied here on the Card instead of on the CharityProjectCard
      <Card variant="outlined" style={{width: this.props.width, marginTop: 40, display: "flex", flexDirection: "column", flexGrow: 1 }}>

        <CardActionArea href={`/charity-project/${this.props.charityProject.Name}`} style={{flexGrow: 1}} >
          <CardHeader title={this.props.charityProject.Name} subheader={this.props.charityProject.CharityName} />
          <CardContent >
            <Typography variant='body1' >{ this.props.charityProject.ShortDescription }</Typography>
          </CardContent>

          <CardContent>
            <TechnologyIcon technology={this.props.charityProject.Technologies[0]} style={{...marginTop()}} />
            <TechnologyIcon technology={this.props.charityProject.Technologies[1]} style={{...marginTop(), marginLeft: 5}} />
            <TechnologyIcon technology={this.props.charityProject.Technologies[2]} style={{...marginTop(), marginLeft: 5}} />
          </CardContent>
        </CardActionArea >

        <Divider />
        <CharityProjectCardActions charityProject={this.props.charityProject}/>
      </Card>
    );
  }
}

class TechnologyIcon extends React.Component {
  render() {
    return (
      <Tooltip title={this.props.technology.Name} >
        <IconButton onClick={this.handleClick} style={{padding: 0, ...this.props.style}}>
          <img 
            width="50"
            height="50"
            src={this.props.technology.SVG !== '' ? this.props.technology.SVG : "/assets/icons/default-technology-icon.svg"}
          />
        </IconButton>
      </Tooltip>
    );
  }
}

class CharityProjectCardActions extends React.Component {
  render() {
    return (
          <CardActions >
        { userRole() >= Role.Creator &&
          <div >
            <Tooltip title={this.props.charityProject.Archived ? "Unarchive" : "Archive" }>
              <IconButton value={this.props.charityProject.Name} onClick={toggleArchiveCharityProject}>
                { this.props.charityProject.Archived ? <Unarchive /> : <Archive /> }
              </IconButton>
            </Tooltip>

            <Tooltip title="Edit">
              <IconButton href={`/edit-charity-project/${this.props.charityProject.Name}`}>
                <Edit />
              </IconButton>
            </Tooltip>

            <Tooltip title="Delete">
              <IconButton /* TODO: send DELETE request to server after a confirmation prompt */>
                <Delete />
              </IconButton>
            </Tooltip>
          </div>
        }
          </CardActions>
    );
  }
}

const toggleArchiveCharityProject = (e, charityProjectName = this.props.charityProject.Name) => {
          let charityProject = {
            oldName: charityProjectName,
            archived: this.props.charityProject.Archived ? false : true
          } // TODO: rename oldName to name and rename name to newName
          const updateCharityProjectRequest = JSON.stringify(charityProject)
            axios.put('http://localhost:8743/charity-projects/', updateCharityProjectRequest, {withCredentials: true }) // TODO: this endpoint should probably be /charity-projects/:name
              .then(() => {
                if (this.props.removeMe)
                  this.props.removeMe()
              }).catch((err) => { 
                if (err.response && err.response.status === 401) {
                  window.location.replace("/login")
                  return
                }// TODO: implement else
              });;
            e.stopPropagation()
          }

class Home extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      filter: "",
      loading: true,
    }

    axios.get('http://localhost:8743/charity-projects/?' + this.props.archive, { withCredentials: true }) // TODO: why is a slash needed before the query params, I remember this being a mystery
      .then((charityProjects) => {
        this.state.loading = false
        this.state.charityProjects = charityProjects.data
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
      <div>
        <Typography variant='h4' style={{ flexBasis: "100%", textAlign: "center", ...marginTop() }}>Charity Projects</Typography>
        <TextField
          label="Name"
          style={marginTop()}
          size="small"
          onChange={(e) => {
            this.state.filter = e.target.value
            this.setState(this.state)
          }}
        />
        <div style={{ display: "flex", flexWrap: "wrap", gap: "1%", justifyContent: "center", width: "90%", margin: "auto", ...marginTop()}}>
          {
            this.state.charityProjects.filter((value) => {
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
            }).map((charityProject, i) =>
              <CharityProjectCardMedium
                charityProject={charityProject}
                key={i}
                width={"19rem"}
                showLongDescription={false}
                removeMe={() => {
                  this.state.charityProjects = this.state.charityProjects.filter((val, nestedIndex) => nestedIndex !== i);
                  this.setState(this.state) }}
              />)
          }
        </div>
        { userRole() >= Role.Creator &&
          <Button href="/create-charity-project" variant="contained" style={marginTop()}>
            <Typography variant='body1'>New Charity Project</Typography>
          </Button>
        }
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
      <div style={{display: "flex"}}>
        <NavigationDrawer />

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home archive="notArchived"/>}/>
          <Route path="/archive" element={<Home archive="archived"/>}/>
          <Route path="/create-charity-project" element={<ManageCharityProject method="post"/>}/>
          <Route path="/edit-charity-project/:name" element={<ManageCharityProject method="put"/>}/>
          <Route path="/charity-project/:name" element={<CharityProject/>}/>
          <Route path="/user-management" element={<UserManagement/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/register" element={<Register/>}/>
        </Routes>
      </BrowserRouter>
      </div>
    )
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
//      Refactor Login, Register (and maybe EditUser) into UserManagement component (only if it speeds up development)
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

