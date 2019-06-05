import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

const Container = styled.div`
  h3 {
    color: white;
    font-weight: 500;
    text-transform: uppercase;
    font-size: 20px;
    margin-bottom: ${props => props.hasSubheading ? '8px' : '20px'} !important;
  }
  p {
    margin-bottom: 20px !important;
    font-size: 16px;
    color: #72767d;
  }
`

const Main = styled.div`
  display: flex;
  justify-content: space-between;
`

class PageHeader extends React.PureComponent {
  render () {
    return (
      <Container hasSubheading={!!this.props.subheading}>
        <Main>
          <div>
            {this.props.heading ? <h3>{this.props.heading}</h3> : null}
            {this.props.subheading ? <p>{this.props.subheading}</p> : null}
          </div>
          {this.props.sideComponent ? <div><h3>{this.props.sideComponent}</h3></div> : null}
        </Main>
      </Container>
    )
  }
}

PageHeader.propTypes = {
  heading: PropTypes.string,
  subheading: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node
  ]),
  sideComponent: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.string
  ])
}

export default PageHeader
