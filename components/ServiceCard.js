import Link from "next/link"

export default function ServiceCard({ service }) {
  return (
    <article className="salon-card">
      <div className="salon-card-image">
        <img src={service.image} alt={service.serviceName} />
        <span>{service.category}</span>
      </div>

      <div className="salon-card-body">
        <h3>{service.serviceName}</h3>
        <p>{service.description}</p>

        <div className="salon-card-meta">
          <span>${Number(service.price).toFixed(2)}</span>
          <span>{service.duration} min</span>
        </div>

        <Link className="salon-card-link" href={`/services/${service._id}`}>
          View details <span aria-hidden="true">↗</span>
        </Link>
      </div>
    </article>
  )
}