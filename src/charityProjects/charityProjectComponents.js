import { userRole, Role } from '../role.js';
import { theme } from "../theme.js"

import React from 'react';
import { Edit, Home as HomeIcon, Place, GroupWork, VolunteerActivism, Engineering, LocationOn, Code, Person, Archive, Logout, Login as LoginIcon, AddDarkMode, LightMode, Search, Sort, FilterList, Clear, Unarchive, Delete } from '@mui/icons-material';
import { Button, Card, CardHeader, CardActions, CardContent, CircularProgress, FormControl, FormGroup, IconButton, InputLabel, MenuItem, Select, TextField, Tooltip, Typography, Divider, CardActionArea} from '@mui/material';
import axios from 'axios';

export { CharityProjectCardLarge, CharityProjectCardMedium }

class CharityProjectCardLarge extends React.Component {
  render() {
    return (
      <Card variant="outlined" style={{ width: this.props.width, margin: "auto" }}>
        <CardHeader title={this.props.charityProject.Name} subheader={this.props.charityProject.CharityName} />
        <CardContent>
          <Typography variant='body1' >{ this.props.charityProject.ShortDescription }</Typography>

          { this.props.charityProject.Location &&
            <div style={{ marginTop: theme.smallMargin, display: "flex" }}>
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
          <CharityProjectCardTechnologies technologies={this.props.charityProject.Technologies} />
        </CardContent>

        <CardContent >
          <Typography variant='body1'>{ this.props.charityProject.LongDescription }</Typography>
          <Divider sx={{ marginTop: theme.smallMargin }}/>
        </CardContent>
        <CharityProjectCardActions charityProject={this.props.charityProject}/>
      </Card>
    );
  }
}

class CharityProjectCardMedium extends React.Component {
  render() {
    return ( // Styling has to be applied here on the Card instead of on the CharityProjectCard
      <Card variant="outlined" sx={{width: this.props.width, marginTop: theme.mediumMargin, display: "flex", flexDirection: "column", flexGrow: 1 }}>

        <CardActionArea href={`/charity-project/${this.props.charityProject.Name}`} style={{flexGrow: 1}} >
          <CardHeader title={this.props.charityProject.Name} subheader={this.props.charityProject.CharityName} />
          <CardContent >
            <Typography variant='body1' >{ this.props.charityProject.ShortDescription }</Typography>
          </CardContent>

          <CharityProjectCardTechnologies technologies={this.props.charityProject.Technologies} />
        </CardActionArea>

        <Divider />
        <CharityProjectCardActions charityProject={this.props.charityProject}/>
      </Card>
    );
  }
}

class CharityProjectCardTechnologies extends React.Component {
  render() {
    return (
      <CardContent>
        <TechnologyIcon technology={this.props.technologies[0]} style={{ marginTop: theme.smallMargin }} />
        <TechnologyIcon technology={this.props.technologies[1]} style={{marginLeft: 5, marginTop: theme.smallMargin }} />
        <TechnologyIcon technology={this.props.technologies[2]} style={{marginLeft: 5, marginTop: theme.smallMargin }} />
      </CardContent>
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
              <IconButton value={this.props.charityProject.Name} onClick={this.toggleArchiveCharityProject}>
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

  toggleArchiveCharityProject = (e, charityProjectName = this.props.charityProject.Name) => {
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
}

