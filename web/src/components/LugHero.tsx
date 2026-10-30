import { Link } from 'react-router-dom'

interface LugHeroProps {
  title: string
  lead: string
  actionLabel?: string
  actionTo?: string
}

export function LugHero({
  title,
  lead,
  actionLabel = '了解更多',
  actionTo = '/wiki',
}: LugHeroProps) {
  return (
    <section className="lug-hero">
      <div className="lug-hero__inner">
        <h1>{title}</h1>
        <p className="lug-hero__lead">{lead}</p>
        <p className="lug-hero__actions">
          <Link to={actionTo} className="lug-btn-light-outline">
            {actionLabel}
          </Link>
        </p>
      </div>
    </section>
  )
}
