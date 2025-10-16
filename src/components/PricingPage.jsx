import React from "react";
import "./PricingPage.scss";

export default function PricingPage() {
  const plans = [
    {
      title: "Starter",
      desc: "Best for anyone who wants to sample Figma",
      seats: [
        { label: "Full seat", price: "Free" },
        { label: "Dev seat", price: "Free" },
        { label: "Collab seat", price: "Free" },
      ],
      details: [
        "3 files to work in",
        "Basic design, prototyping, and collaboration",
      ],
    },
    {
      title: "Professional",
      desc: "Best for small teams to create and collaborate",
      seats: [
        { label: "Full seat", price: "$16/mo" },
        { label: "Dev seat", price: "$12/mo" },
        { label: "Collab seat", price: "$3/mo" },
      ],
      details: [
        "Unlimited files and folders",
        "Advanced prototyping",
        "A team-wide design library for components, variables, and modes",
        "File handoff tools like annotation, statuses, and advanced inspection",
      ],
    },
    {
      title: "Organization",
      desc: "Best for teams who need org-wide libraries and easy admin control",
      seats: [
        { label: "Full seat", price: "$55/mo" },
        { label: "Dev seat", price: "$25/mo" },
        { label: "Collab seat", price: "$5/mo" },
      ],
      details: [
        "Everything in Professional, plus:",
        "Unlimited teams and design libraries",
        "Branching and merging files",
        "Powerful security features",
        "SCIM provisioning",
        "Extra customization tools for workspaces, plugins, and more",
      ],
    },
  ];

  return (
    <section className="eqs-pricing">
      <div className="pricing-intro">
        <h1 className="pricing-title">Which plan would you like?</h1>
        <p className="pricing-subtitle">
          Choose the plan that fits your team's needs and scale beautifully with your workflow.
        </p>
      </div>

      <div className="pricing-grid">
        {plans.map((plan, index) => (
          <div key={index} className={`plan-card ${plan.title.toLowerCase()}`}>
            <div className="plan-header">
              <h2>{plan.title}</h2>
              <p>{plan.desc}</p>
            </div>

            <div className="plan-seats">
              {plan.seats.map((seat, i) => (
                <div key={i} className="seat-row">
                  <span className="seat-label">{seat.label}</span>
                  <span className="seat-price">{seat.price}</span>
                </div>
              ))}
            </div>

            <ul className="plan-details">
              {plan.details.map((d, i) => (
                <li key={i}>{d}</li>
              ))}
            </ul>

            <div className="plan-select">
              <input type="radio" name="plan" id={`plan-${index}`} />
              <label htmlFor={`plan-${index}`} className="select-btn">
                Select Plan
              </label>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
