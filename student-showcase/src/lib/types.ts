export interface Project {
  id: string
  name: string
  creator: string
  creatorAvatar: string
  description: string
  shortDescription: string
  category: string
  gradient: string
  accentColor: string
  icon: string
  tags: string[]
}

export interface ProjectCardProps {
  project: Project
  isActive: boolean
  onClick: () => void
}

export interface AppViewProps {
  onClose: () => void
}
