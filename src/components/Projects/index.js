import {Component} from 'react'
import Loader from 'react-loader-spinner'
import ProjectCard from '../ProjectCard'

import './index.css'

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Projects extends Component {
  state = {
    activeId: categoriesList[0].id,
    apiStatus: apiStatusConstants.initial,
    projectsList: [],
  }

  componentDidMount() {
    this.getProjects()
  }

  getProjects = async () => {
    const {activeId} = this.state
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const url = `https://apis.ccbp.in/ps/projects?category=${activeId.toUpperCase()}`
    const response = await fetch(url)
    if (response.ok === true) {
      const data = await response.json()
      const updated = data.projects.map(each => ({
        id: each.id,
        name: each.name,
        imageUrl: each.image_url,
      }))
      this.setState({
        projectsList: updated,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  onChangeId = event => {
    const {activeId, projectsList} = this.state
    const filtered = categoriesList.filter(
      each => each.id === activeId.toUpperCase(),
    )

    this.setState(
      {activeId: event.target.value, projectsList: filtered},
      this.getProjects,
    )
    return projectsList
  }

  renderSelect = () => (
    <div className="select-container">
      <select id="projects" onChange={this.onChangeId} className="select">
        {categoriesList.map(each => (
          <option name="projects" key={each.id} value={each.id}>
            {each.displayText}
          </option>
        ))}
      </select>
    </div>
  )

  renderProjects = () => {
    const {projectsList} = this.state

    return (
      <div className="projects">
        <ul className="unordered">
          {projectsList.map(each => (
            <ProjectCard key={each.id} projectDetails={each} />
          ))}
        </ul>
      </div>
    )
  }

  renderLoader = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  onClickButton = () => {
    this.getProjects()
  }

  renderFailure = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt="failure view"
        height={100}
        width={100}
        className="failure-image"
      />
      <h1 className="heading">Oops! Something Went Wrong</h1>
      <p className="para">
        We cannot seem to find the page you are looking for
      </p>
      <button type="button" onClick={this.onClickButton} className="retry">
        Retry
      </button>
    </div>
  )

  renderAll = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProjects()
      case apiStatusConstants.failure:
        return this.renderFailure()
      case apiStatusConstants.inProgress:
        return this.renderLoader()
      default:
        return ''
    }
  }

  render() {
    return (
      <div className="app">
        <div className="header">
          <img
            src="https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png"
            alt="website logo"
            className="logo"
          />
        </div>
        <div className="container">
          {this.renderSelect()}
          {this.renderAll()}
        </div>
      </div>
    )
  }
}

export default Projects
