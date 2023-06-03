import React from 'react';
import { Box, Chip, Checkbox, FormControl, InputLabel, ListItemText, MenuItem, Select } from '@mui/material';
import {theme} from '../theme';

export { TechnologySelect }

class TechnologySelect extends React.Component {
  render() {
    const renderValue = (selectedTechnologies) =>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
        {selectedTechnologies.map((value) => (
          <Chip key={value} label={value} />
        ))}
      </Box>

    return (
      <FormControl sx={{ width: "100%", marginTop: theme.mediumMargin }} size="small" >
        <InputLabel id="technologiesLabel">Technologies</InputLabel>
        <Select
          labelId='technologiesLabel'
          label={"Technologies"}
          multiple
          value={this.props.selectedTechnologies}
          renderValue={renderValue}
          required
          error={this.props.error}
          onChange={this.onChange} >
        
          {
            this.props.technologies.map((tech, i) => 
              <MenuItem value={tech} dense={true} key={tech} >
                <Checkbox checked={this.props.selectedTechnologies.includes(tech)} />
                <ListItemText primary={tech} />
              </MenuItem>)
          }

        </Select>
      </FormControl>
    )
  }

  onChange = (e) => {
    // onChange doesn't just get called with value set to our array
    if (e.target.value !== null && e.target.value !== '') {
      this.props.onChange(e.target.value)
    }
  }
}
