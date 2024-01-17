import './index.css'

const ProjectCard = props => {
  const {projectDetails} = props
  const {imageUrl, name} = projectDetails
  return (
    <li className="list-projects">
      <img src={imageUrl} alt={name} className="list-image" />
      <p className="list-name">{name}</p>
    </li>
  )
}

export default ProjectCard
