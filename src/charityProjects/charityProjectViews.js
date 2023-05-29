import { CharityProjectCardLarge, CharityProjectCardMedium } from "./charityProjectComponents";
import { TechnologySelect } from "../technologies/technologyComponents";
import { userRole, Role } from '../role.js';

import React from 'react';
import { Edit, Home as HomeIcon, Place, GroupWork, VolunteerActivism, Engineering, LocationOn, Code, Person, Archive, Logout, Login as LoginIcon, AddDarkMode, LightMode, Search, Sort, FilterList, Clear, Unarchive, Delete } from '@mui/icons-material';
import { Button, CircularProgress, FormGroup, TextField, Typography, } from '@mui/material';
import axios from 'axios';
import {Stack} from '@mui/system';
import {theme} from "../theme";

export { CharityProjectList, CharityProject, ManageCharityProject }

class CharityProjectList extends React.Component {
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
        <Typography variant='h4' sx={{ flexBasis: "100%", textAlign: "center", marginTop: theme.mediumMargin  }} >Charity Projects</Typography>
        <TextField
          label="Name"
          size="small"
          onChange={(e) => {
            this.state.filter = e.target.value
            this.setState(this.state)
          }}
        />
        <div style={{ display: "flex", flexWrap: "wrap", gap: "1%", justifyContent: "center", width: "90%", margin: "auto", marginTop: theme.mediumMargin }} >
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
          <Button href="/create-charity-project" variant="contained" >
            <Typography variant='body1'>New Charity Project</Typography>
          </Button>
        }
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
      <div style={{width: "85%", margin: "auto", marginTop: theme.mediumMargin }} >
        <CharityProjectCardLarge charityProject={this.state.charityProject} width={"80%"} showLongDescription={true}/>
      </div>
    );
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
      <Stack direction="row" spacing={2} justifyContent="center" sx={{ width: "80%", margin: "auto", marginTop: theme.mediumMargin }}>
        <FormGroup style={{width: "100%", border: "1px solid #aaa", borderRadius: "10px", padding: "15px"}}>
          <h2>Charity Project</h2>
          <TextField
            label="Name"
            sx={{ marginTop: theme.smallMargin }}
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
            sx={{ marginTop: theme.smallMargin }}
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
            sx={{ marginTop: theme.smalsmalln }}
            size="small"
            value={this.state.charityProject.longDescription}
            onChange={(e) => {
              this.state.charityProject.longDescription = e.target.value
              this.setState(this.state)
            }}
          />
          <TextField
            label="Charity Name"
            sx={{ marginTop: theme.smallMargin }}
            size="small"
            value={this.state.charityProject.charityName}
            onChange={(e) => {
              this.state.charityProject.charityName = e.target.value
              this.setState(this.state)
            }}
          />
          <TextField
            label="Charity Email"
            sx={{ marginTop: theme.smallMargin }}
            size="small"
            value={this.state.charityProject.charityEmail}
            onChange={(e) => {
              this.state.charityProject.charityEmail = e.target.value
              this.setState(this.state)
            }}
          />
          <TextField
            label="Project Email"
            sx={{ marginTop: theme.smallMargin }}
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
            sx={{ marginTop: theme.smallMargin }}
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
            style={{width: "max-content"}}
            sx={{ marginTop: theme.smallMargin }}
            onClick={() => {
              this.state.charityProject.technologies.push({ name: '', error: false, key: this.state.charityProject.technologies.length})
              this.setState(this.state)
            }}>
              Add Technology
          </Button>
  
          <Button
            variant="contained"
            size='small'
            style={{width: "max-content"}}
            sx={{ marginTop: theme.smallMargin }}
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

        <FormGroup style={{width: "100%", border: "1px solid #aaa", borderRadius: "10px", padding: "15px"}}>
          <h2>Technology</h2>
          <TextField
            label="Name"
            sx={{ marginTop: theme.smallMargin }}
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
            style={{width: "max-content"}}
            sx={{ marginTop: theme.smallMargin }}
            component="label"
            onChange={() => this.setState({...this.state, technology: {...this.state.technology, image: document.getElementById('techFile').files[0]}})}
          >
            Upload Image
            <input id='techFile' type='file' hidden/>
          </Button>
          <Button
            variant="contained"
            size='small'
            style={{width: "max-content"}}
            sx={{ marginTop: theme.smallMargin }}
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
