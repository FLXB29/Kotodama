import { Settings2, type LucideIcon } from 'lucide-react'

export default function PageHeader({
  eyebrow,
  title,
  description,
  icon: Icon = Settings2,
}: {
  eyebrow: string
  title: string
  description: string
  icon?: LucideIcon
}) {
  return (
    <header className="page-header">
      <div className="page-header__eyebrow">
        <Icon aria-hidden="true" size={15} strokeWidth={2.25} />
        {eyebrow}
      </div>
      <h1>{title}</h1>
      <p>{description}</p>
    </header>
  )
}
