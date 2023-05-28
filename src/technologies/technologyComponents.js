import React from 'react';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

import '../index.css';

export { TechnologySelect }

class TechnologySelect extends React.Component {
  render() {
    const menuItems = []
    for (let i = 0; i < this.props.technologies.length; i++) {
      menuItems.push(<MenuItem value={this.props.technologies[i]} dense={true} key={i}>{this.props.technologies[i]}</MenuItem>)
    }
    return (
      <FormControl style={{width: "30%"}} size="small" className="topMargin">
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
