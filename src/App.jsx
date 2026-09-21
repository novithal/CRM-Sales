import React, { useEffect, useMemo, useState } from "react";
import "./App.css";

/* =========================================================
   STORAGE
========================================================= */

const STORAGE = {
  leads: "crm_sales_leads",
  contacts: "crm_sales_contacts",
  deals: "crm_sales_deals",
  activities: "crm_sales_activities",
  profile: "crm_sales_profile",
  notifications: "crm_sales_notifications",
};

/* =========================================================
   HELPERS
========================================================= */

const uid = (prefix = "ID") =>
  `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const readStorage = (key, fallback = []) => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

const writeStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage errors
  }
};

const money = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);

/* =========================================================
   DEFAULT DATA
========================================================= */

const defaultLeads = [
  {
    id: "LD-001",
    name: "BrightStack CRM",
    company: "BrightStack Technologies",
    email: "hello@brightstack.com",
    phone: "+1 555 201 4001",
    source: "Website",
    status: "New",
    value: 42000,
    owner: "Saran Kumar",
  },
  {
    id: "LD-002",
    name: "Vertex CRM",
    company: "Vertex Solutions",
    email: "sales@vertex.com",
    phone: "+1 555 201 4002",
    source: "Referral",
    status: "Contacted",
    value: 58000,
    owner: "Novitha",
  },
  {
    id: "LD-003",
    name: "CloudNova",
    company: "CloudNova Inc.",
    email: "contact@cloudnova.com",
    phone: "+1 555 201 4003",
    source: "LinkedIn",
    status: "Qualified",
    value: 76000,
    owner: "Arun Kumar",
  },
  {
    id: "LD-004",
    name: "Nexora Labs",
    company: "Nexora Labs",
    email: "team@nexora.com",
    phone: "+1 555 201 4004",
    source: "Campaign",
    status: "New",
    value: 35000,
    owner: "Priya",
  },
  {
    id: "LD-005",
    name: "PixelForge",
    company: "PixelForge Studio",
    email: "sales@pixelforge.com",
    phone: "+1 555 201 4005",
    source: "Website",
    status: "Contacted",
    value: 29000,
    owner: "Karthik",
  },
];

const defaultContacts = [
  {
    id: "CT-001",
    name: "John Carter",
    company: "BrightStack Technologies",
    email: "john@brightstack.com",
    phone: "+1 555 300 1001",
    role: "CEO",
  },
  {
    id: "CT-002",
    name: "Emma Wilson",
    company: "Vertex Solutions",
    email: "emma@vertex.com",
    phone: "+1 555 300 1002",
    role: "Sales Director",
  },
  {
    id: "CT-003",
    name: "David Miller",
    company: "CloudNova Inc.",
    email: "david@cloudnova.com",
    phone: "+1 555 300 1003",
    role: "CTO",
  },
];

const defaultDeals = [
  {
    id: "DL-001",
    title: "BrightStack CRM Enterprise",
    company: "BrightStack Technologies",
    value: 85000,
    stage: "Proposal",
    owner: "Saran Kumar",
    probability: 70,
  },
  {
    id: "DL-002",
    title: "Vertex CRM Upgrade",
    company: "Vertex Solutions",
    value: 62000,
    stage: "Negotiation",
    owner: "Novitha",
    probability: 80,
  },
  {
    id: "DL-003",
    title: "CloudNova Platform",
    company: "CloudNova Inc.",
    value: 94000,
    stage: "Qualified",
    owner: "Arun Kumar",
    probability: 45,
  },
  {
    id: "DL-004",
    title: "Nexora CRM Package",
    company: "Nexora Labs",
    value: 48000,
    stage: "Lead",
    owner: "Priya",
    probability: 25,
  },
];

const defaultActivities = [
  {
    id: "AC-001",
    title: "Demo scheduled",
    company: "BrightStack Technologies",
    type: "Meeting",
    date: "Today",
    owner: "Saran Kumar",
  },
  {
    id: "AC-002",
    title: "Follow-up email sent",
    company: "Vertex Solutions",
    type: "Email",
    date: "Yesterday",
    owner: "Novitha",
  },
  {
    id: "AC-003",
    title: "Proposal shared",
    company: "CloudNova Inc.",
    type: "Task",
    date: "Sep 19",
    owner: "Arun Kumar",
  },
];

/* =========================================================
   COMPONENTS
========================================================= */

function Icon({ name }) {
  const icons = {
    dashboard: "⌂",
    leads: "♙",
    contacts: "♧",
    deals: "◇",
    pipeline: "▥",
    activity: "◷",
    reports: "▦",
    settings: "⚙",
    search: "⌕",
    plus: "+",
    menu: "☰",
    close: "×",
    bell: "♢",
    user: "●",
    eye: "◉",
    trash: "♲",
    arrow: "→",
  };

  return <span className="icon">{icons[name] || "•"}</span>;
}

/* =========================================================
   SIDEBAR
========================================================= */

function Sidebar({
  activePage,
  setActivePage,
  sidebarOpen,
  setSidebarOpen,
}) {
  const menu = [
    ["dashboard", "Dashboard"],
    ["leads", "Leads"],
    ["contacts", "Contacts"],
    ["deals", "Deals"],
    ["pipeline", "Pipeline"],
    ["activity", "Activities"],
    ["reports", "Reports"],
    ["settings", "Settings"],
  ];

  const navigate = (page) => {
    setActivePage(page);
    setSidebarOpen(false);
  };

  return (
    <>
      <aside className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
        <div className="sidebar-inner">
          <div className="brand">
            <div className="brand-logo">C</div>
            <div className="brand-text">
              <strong>CRM Sales</strong>
              <span>Dashboard</span>
            </div>
          </div>

          <nav className="sidebar-nav">
            <div className="nav-title">MAIN MENU</div>

            {menu.map(([icon, label]) => {
              const page = label.toLowerCase();

              return (
                <button
                  key={label}
                  className={`nav-item ${
                    activePage === page ? "active" : ""
                  }`}
                  onClick={() => navigate(page)}
                >
                  <Icon name={icon} />
                  <span className="nav-text">{label}</span>
                </button>
              );
            })}
          </nav>

          <div className="sidebar-bottom">
            <div className="sidebar-profile">
              <div className="profile-avatar">SK</div>
              <div className="profile-info">
                <strong>Saran Kumar</strong>
                <span>Administrator</span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  );
}

/* =========================================================
   TOPBAR
========================================================= */

function Topbar({ setSidebarOpen, onProfile }) {
  return (
    <header className="topbar">
      <div className="topbar-left">
        <button
          className="mobile-menu-btn"
          onClick={() => setSidebarOpen((prev) => !prev)}
          aria-label="Open menu"
        >
          <span />
          <span />
          <span />
        </button>

        <div>
          <h1>Sales CRM</h1>
          <p>Manage your sales and customer relationships</p>
        </div>
      </div>

      <div className="topbar-actions">
        <button className="icon-btn">
          <Icon name="bell" />
          <span className="notification-dot" />
        </button>

        <button className="top-profile" onClick={onProfile}>
          <div className="profile-avatar small">SK</div>
          <div className="top-profile-text">
            <strong>Saran Kumar</strong>
            <span>Administrator</span>
          </div>
        </button>
      </div>
    </header>
  );
}

/* =========================================================
   MODAL
========================================================= */

function Modal({ title, children, onClose }) {
  return (
    <div className="modal-overlay" onMouseDown={onClose}>
      <div
        className="modal"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="modal-header">
          <div>
            <h2>{title}</h2>
          </div>

          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}

/* =========================================================
   DASHBOARD
========================================================= */

function Dashboard({
  leads,
  contacts,
  deals,
  activities,
  openLead,
  setActivePage,
}) {
  const revenue = deals.reduce((sum, deal) => sum + Number(deal.value), 0);

  const pipelineValue = deals
    .filter((deal) => deal.stage !== "Closed Won")
    .reduce((sum, deal) => sum + Number(deal.value), 0);

  const qualifiedLeads = leads.filter(
    (lead) => lead.status === "Qualified"
  ).length;

  return (
    <div className="page">
      <div className="page-heading">
        <div>
          <h2>Sales Dashboard</h2>
          <p>Welcome back, Saran. Here is your sales overview.</p>
        </div>

        <button
          className="primary-btn"
          onClick={() => setActivePage("leads")}
        >
          <Icon name="plus" />
          Add Lead
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue">◈</div>
          <div>
            <span>Total Revenue</span>
            <strong>{money(revenue)}</strong>
            <small>+18.4% this month</small>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green">◇</div>
          <div>
            <span>Pipeline Value</span>
            <strong>{money(pipelineValue)}</strong>
            <small>Active opportunities</small>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon orange">♙</div>
          <div>
            <span>Total Leads</span>
            <strong>{leads.length}</strong>
            <small>{qualifiedLeads} qualified leads</small>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon purple">♧</div>
          <div>
            <span>Contacts</span>
            <strong>{contacts.length}</strong>
            <small>Customer contacts</small>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <section className="panel">
          <div className="panel-header">
            <div>
              <h3>Recent Leads</h3>
              <p>Your latest sales opportunities</p>
            </div>

            <button
              className="text-btn"
              onClick={() => setActivePage("leads")}
            >
              View all →
            </button>
          </div>

          <div className="lead-list">
            {leads.slice(0, 5).map((lead) => (
              <div className="lead-row" key={lead.id}>
                <div className="company-avatar">
                  {lead.company.charAt(0)}
                </div>

                <div className="lead-main">
                  <strong>{lead.name}</strong>
                  <span>{lead.company}</span>
                </div>

                <div className="lead-value">{money(lead.value)}</div>

                <span className={`status ${lead.status.toLowerCase()}`}>
                  {lead.status}
                </span>

                <button
                  className="view-btn"
                  onClick={() => openLead(lead)}
                >
                  View
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="panel">
          <div className="panel-header">
            <div>
              <h3>Recent Activities</h3>
              <p>Latest sales activities</p>
            </div>
          </div>

          <div className="activity-list">
            {activities.map((activity) => (
              <div className="activity-row" key={activity.id}>
                <div className="activity-icon">
                  {activity.type === "Meeting"
                    ? "◷"
                    : activity.type === "Email"
                    ? "✉"
                    : "✓"}
                </div>

                <div className="activity-content">
                  <strong>{activity.title}</strong>
                  <span>{activity.company}</span>
                </div>

                <small>{activity.date}</small>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

/* =========================================================
   LEADS
========================================================= */

function LeadsPage({ leads, setLeads, openLead }) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [showAdd, setShowAdd] = useState(false);

  const filtered = useMemo(() => {
    return leads.filter((lead) => {
      const query = search.toLowerCase();

      const matchesSearch =
        lead.name.toLowerCase().includes(query) ||
        lead.company.toLowerCase().includes(query) ||
        lead.email.toLowerCase().includes(query);

      const matchesStatus =
        status === "All" || lead.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [leads, search, status]);

  const deleteLead = (id) => {
    if (!window.confirm("Delete this lead?")) return;

    setLeads((current) => current.filter((lead) => lead.id !== id));
  };

  return (
    <div className="page">
      <div className="page-heading">
        <div>
          <h2>Leads</h2>
          <p>Manage and track your sales leads.</p>
        </div>

        <button
          className="primary-btn"
          onClick={() => setShowAdd(true)}
        >
          <Icon name="plus" />
          Add Lead
        </button>
      </div>

      <div className="panel">
        <div className="filter-bar">
          <div className="search-box">
            <Icon name="search" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search leads..."
            />
          </div>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option>All</option>
            <option>New</option>
            <option>Contacted</option>
            <option>Qualified</option>
          </select>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Lead</th>
                <th>Company</th>
                <th>Owner</th>
                <th>Value</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((lead) => (
                <tr key={lead.id}>
                  <td>
                    <div className="table-person">
                      <div className="company-avatar">
                        {lead.company.charAt(0)}
                      </div>

                      <div>
                        <strong>{lead.name}</strong>
                        <span>{lead.email}</span>
                      </div>
                    </div>
                  </td>

                  <td>{lead.company}</td>
                  <td>{lead.owner}</td>
                  <td>{money(lead.value)}</td>
                  <td>
                    <span className={`status ${lead.status.toLowerCase()}`}>
                      {lead.status}
                    </span>
                  </td>

                  <td>
                    <div className="table-actions">
                      <button
                        className="view-btn"
                        onClick={() => openLead(lead)}
                      >
                        View
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() => deleteLead(lead.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan="6">
                    <div className="empty-state">
                      No leads found.
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showAdd && (
        <AddLeadModal
          onClose={() => setShowAdd(false)}
          onSave={(lead) => {
            setLeads((current) => [lead, ...current]);
            setShowAdd(false);
          }}
        />
      )}
    </div>
  );
}

/* =========================================================
   ADD LEAD MODAL
========================================================= */

function AddLeadModal({ onClose, onSave }) {
  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    source: "Website",
    status: "New",
    value: "",
    owner: "Saran Kumar",
  });

  const update = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const submit = (e) => {
    e.preventDefault();

    if (!form.name || !form.company || !form.email) {
      alert("Please fill name, company and email.");
      return;
    }

    onSave({
      ...form,
      id: uid("LD"),
      value: Number(form.value) || 0,
    });
  };

  return (
    <Modal title="Add New Lead" onClose={onClose}>
      <form className="form-grid" onSubmit={submit}>
        <div className="form-group">
          <label>Lead Name</label>
          <input
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            placeholder="Enter lead name"
          />
        </div>

        <div className="form-group">
          <label>Company</label>
          <input
            value={form.company}
            onChange={(e) => update("company", e.target.value)}
            placeholder="Enter company"
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            placeholder="Enter email"
          />
        </div>

        <div className="form-group">
          <label>Phone</label>
          <input
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
            placeholder="Enter phone"
          />
        </div>

        <div className="form-group">
          <label>Value</label>
          <input
            type="number"
            value={form.value}
            onChange={(e) => update("value", e.target.value)}
            placeholder="0"
          />
        </div>

        <div className="form-group">
          <label>Status</label>
          <select
            value={form.status}
            onChange={(e) => update("status", e.target.value)}
          >
            <option>New</option>
            <option>Contacted</option>
            <option>Qualified</option>
          </select>
        </div>

        <div className="form-group full">
          <label>Source</label>
          <select
            value={form.source}
            onChange={(e) => update("source", e.target.value)}
          >
            <option>Website</option>
            <option>Referral</option>
            <option>LinkedIn</option>
            <option>Campaign</option>
          </select>
        </div>

        <div className="form-actions full">
          <button
            type="button"
            className="secondary-btn"
            onClick={onClose}
          >
            Cancel
          </button>

          <button type="submit" className="primary-btn">
            Add Lead
          </button>
        </div>
      </form>
    </Modal>
  );
}

/* =========================================================
   CONTACTS
========================================================= */

function ContactsPage({ contacts }) {
  const [search, setSearch] = useState("");

  const filtered = contacts.filter((contact) => {
    const q = search.toLowerCase();

    return (
      contact.name.toLowerCase().includes(q) ||
      contact.company.toLowerCase().includes(q) ||
      contact.email.toLowerCase().includes(q)
    );
  });

  return (
    <div className="page">
      <div className="page-heading">
        <div>
          <h2>Contacts</h2>
          <p>Manage your customer contacts.</p>
        </div>
      </div>

      <div className="panel">
        <div className="filter-bar">
          <div className="search-box">
            <Icon name="search" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search contacts..."
            />
          </div>
        </div>

        <div className="contact-grid">
          {filtered.map((contact) => (
            <div className="contact-card" key={contact.id}>
              <div className="contact-top">
                <div className="large-avatar">
                  {contact.name
                    .split(" ")
                    .map((word) => word[0])
                    .join("")
                    .slice(0, 2)}
                </div>

                <button className="more-btn">•••</button>
              </div>

              <h3>{contact.name}</h3>
              <p>{contact.role}</p>

              <div className="contact-company">
                {contact.company}
              </div>

              <div className="contact-details">
                <span>{contact.email}</span>
                <span>{contact.phone}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   DEALS
========================================================= */

function DealsPage({ deals }) {
  const [search, setSearch] = useState("");

  const filtered = deals.filter((deal) => {
    const q = search.toLowerCase();

    return (
      deal.title.toLowerCase().includes(q) ||
      deal.company.toLowerCase().includes(q)
    );
  });

  return (
    <div className="page">
      <div className="page-heading">
        <div>
          <h2>Deals</h2>
          <p>Track your sales opportunities and revenue.</p>
        </div>

        <button className="primary-btn">
          <Icon name="plus" />
          Add Deal
        </button>
      </div>

      <div className="panel">
        <div className="filter-bar">
          <div className="search-box">
            <Icon name="search" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search deals..."
            />
          </div>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Deal</th>
                <th>Company</th>
                <th>Stage</th>
                <th>Value</th>
                <th>Probability</th>
                <th>Owner</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((deal) => (
                <tr key={deal.id}>
                  <td>
                    <strong>{deal.title}</strong>
                  </td>
                  <td>{deal.company}</td>
                  <td>
                    <span className="deal-stage">{deal.stage}</span>
                  </td>
                  <td>{money(deal.value)}</td>
                  <td>
                    <div className="progress-cell">
                      <div className="progress-bar">
                        <span
                          style={{
                            width: `${deal.probability}%`,
                          }}
                        />
                      </div>
                      <small>{deal.probability}%</small>
                    </div>
                  </td>
                  <td>{deal.owner}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   PIPELINE
========================================================= */

function PipelinePage({ deals, setDeals, openDeal }) {
  const stages = [
    "Lead",
    "Qualified",
    "Proposal",
    "Negotiation",
    "Closed Won",
  ];

  const [draggedDeal, setDraggedDeal] = useState(null);

  const handleDrop = (stage) => {
    if (!draggedDeal) return;

    setDeals((current) =>
      current.map((deal) =>
        deal.id === draggedDeal
          ? {
              ...deal,
              stage,
              probability:
                stage === "Lead"
                  ? 25
                  : stage === "Qualified"
                  ? 45
                  : stage === "Proposal"
                  ? 70
                  : stage === "Negotiation"
                  ? 85
                  : 100,
            }
          : deal
      )
    );

    setDraggedDeal(null);
  };

  return (
    <div className="page">
      <div className="page-heading">
        <div>
          <h2>Sales Pipeline</h2>
          <p>Drag deals between stages to update progress.</p>
        </div>
      </div>

      <div className="pipeline">
        {stages.map((stage) => {
          const stageDeals = deals.filter(
            (deal) => deal.stage === stage
          );

          const total = stageDeals.reduce(
            (sum, deal) => sum + Number(deal.value),
            0
          );

          return (
            <div
              className="pipeline-column"
              key={stage}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(stage)}
            >
              <div className="pipeline-header">
                <div>
                  <h3>{stage}</h3>
                  <span>{stageDeals.length} deals</span>
                </div>

                <strong>{money(total)}</strong>
              </div>

              <div className="pipeline-cards">
                {stageDeals.map((deal) => (
                  <div
                    className="deal-card"
                    key={deal.id}
                    draggable
                    onDragStart={() => setDraggedDeal(deal.id)}
                    onDragEnd={() => setDraggedDeal(null)}
                  >
                    <div className="deal-card-top">
                      <span>{deal.id}</span>
                      <button
                        className="view-icon"
                        onClick={() => openDeal(deal)}
                      >
                        <Icon name="eye" />
                      </button>
                    </div>

                    <h4>{deal.title}</h4>
                    <p>{deal.company}</p>

                    <div className="deal-card-value">
                      {money(deal.value)}
                    </div>

                    <div className="deal-card-bottom">
                      <span>{deal.owner}</span>
                      <span>{deal.probability}%</span>
                    </div>
                  </div>
                ))}

                {stageDeals.length === 0 && (
                  <div className="drop-placeholder">
                    Drop deals here
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* =========================================================
   ACTIVITIES
========================================================= */

function ActivitiesPage({ activities }) {
  return (
    <div className="page">
      <div className="page-heading">
        <div>
          <h2>Activities</h2>
          <p>Track meetings, emails and sales tasks.</p>
        </div>

        <button className="primary-btn">
          <Icon name="plus" />
          Add Activity
        </button>
      </div>

      <div className="panel">
        <div className="timeline">
          {activities.map((activity) => (
            <div className="timeline-item" key={activity.id}>
              <div className="timeline-dot" />

              <div className="timeline-content">
                <div className="timeline-top">
                  <strong>{activity.title}</strong>
                  <span>{activity.date}</span>
                </div>

                <p>{activity.company}</p>

                <div className="timeline-meta">
                  <span>{activity.type}</span>
                  <span>{activity.owner}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   REPORTS
========================================================= */

function ReportsPage({ deals, leads }) {
  const totalRevenue = deals.reduce(
    (sum, deal) => sum + Number(deal.value),
    0
  );

  const stages = ["Lead", "Qualified", "Proposal", "Negotiation"];

  return (
    <div className="page">
      <div className="page-heading">
        <div>
          <h2>Reports & Analytics</h2>
          <p>Understand your sales performance.</p>
        </div>

        <button className="secondary-btn">Export Report</button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue">▦</div>
          <div>
            <span>Revenue</span>
            <strong>{money(totalRevenue)}</strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green">♙</div>
          <div>
            <span>Leads</span>
            <strong>{leads.length}</strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon purple">◇</div>
          <div>
            <span>Deals</span>
            <strong>{deals.length}</strong>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="panel">
          <div className="panel-header">
            <div>
              <h3>Pipeline Overview</h3>
              <p>Deals by stage</p>
            </div>
          </div>

          <div className="report-bars">
            {stages.map((stage) => {
              const count = deals.filter(
                (deal) => deal.stage === stage
              ).length;

              const percentage = Math.max(
                count * 25,
                count ? 15 : 3
              );

              return (
                <div className="report-bar-row" key={stage}>
                  <div className="report-label">
                    <span>{stage}</span>
                    <strong>{count}</strong>
                  </div>

                  <div className="report-bar">
                    <span style={{ width: `${percentage}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <div>
              <h3>Lead Sources</h3>
              <p>Where your leads come from</p>
            </div>
          </div>

          <div className="source-list">
            {["Website", "Referral", "LinkedIn", "Campaign"].map(
              (source, index) => (
                <div className="source-row" key={source}>
                  <span>{source}</span>
                  <div className="source-progress">
                    <span
                      style={{
                        width: `${80 - index * 15}%`,
                      }}
                    />
                  </div>
                  <strong>{80 - index * 15}%</strong>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   SETTINGS
========================================================= */

function SettingsPage() {
  return (
    <div className="page">
      <div className="page-heading">
        <div>
          <h2>Settings</h2>
          <p>Manage your CRM preferences.</p>
        </div>
      </div>

      <div className="settings-grid">
        <div className="settings-card">
          <div className="settings-avatar">SK</div>
          <h3>Saran Kumar</h3>
          <p>Administrator</p>

          <button className="secondary-btn">
            Edit Profile
          </button>
        </div>

        <div className="panel settings-panel">
          <h3>Account Settings</h3>

          <div className="setting-row">
            <div>
              <strong>Email Notifications</strong>
              <span>Receive important sales notifications.</span>
            </div>

            <input type="checkbox" defaultChecked />
          </div>

          <div className="setting-row">
            <div>
              <strong>Daily Summary</strong>
              <span>Get a daily sales performance summary.</span>
            </div>

            <input type="checkbox" defaultChecked />
          </div>

          <div className="setting-row">
            <div>
              <strong>Activity Reminders</strong>
              <span>Receive reminders for upcoming activities.</span>
            </div>

            <input type="checkbox" defaultChecked />
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   MAIN APP
========================================================= */

export default function App() {
  const [activePage, setActivePage] = useState("dashboard");

  /* MOBILE SIDEBAR STATE */
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [leads, setLeads] = useState(() =>
    readStorage(STORAGE.leads, defaultLeads)
  );

  const [contacts] = useState(() =>
    readStorage(STORAGE.contacts, defaultContacts)
  );

  const [deals, setDeals] = useState(() =>
    readStorage(STORAGE.deals, defaultDeals)
  );

  const [activities] = useState(() =>
    readStorage(STORAGE.activities, defaultActivities)
  );

  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedType, setSelectedType] = useState("");

  /* SAVE DATA */
  useEffect(() => {
    writeStorage(STORAGE.leads, leads);
  }, [leads]);

  useEffect(() => {
    writeStorage(STORAGE.deals, deals);
  }, [deals]);

  useEffect(() => {
    writeStorage(STORAGE.contacts, contacts);
  }, [contacts]);

  /* PREVENT BACKGROUND SCROLL WHEN MOBILE SIDEBAR IS OPEN */
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  /* CLOSE SIDEBAR WHEN SCREEN BECOMES DESKTOP */
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const openLead = (lead) => {
    setSelectedItem(lead);
    setSelectedType("lead");
  };

  const openDeal = (deal) => {
    setSelectedItem(deal);
    setSelectedType("deal");
  };

  const closeDetails = () => {
    setSelectedItem(null);
    setSelectedType("");
  };

  const renderPage = () => {
    switch (activePage) {
      case "dashboard":
        return (
          <Dashboard
            leads={leads}
            contacts={contacts}
            deals={deals}
            activities={activities}
            openLead={openLead}
            setActivePage={setActivePage}
          />
        );

      case "leads":
        return (
          <LeadsPage
            leads={leads}
            setLeads={setLeads}
            openLead={openLead}
          />
        );

      case "contacts":
        return <ContactsPage contacts={contacts} />;

      case "deals":
        return <DealsPage deals={deals} />;

      case "pipeline":
        return (
          <PipelinePage
            deals={deals}
            setDeals={setDeals}
            openDeal={openDeal}
          />
        );

      case "activities":
        return <ActivitiesPage activities={activities} />;

      case "reports":
        return <ReportsPage deals={deals} leads={leads} />;

      case "settings":
        return <SettingsPage />;

      default:
        return (
          <Dashboard
            leads={leads}
            contacts={contacts}
            deals={deals}
            activities={activities}
            openLead={openLead}
            setActivePage={setActivePage}
          />
        );
    }
  };

  return (
    <div className="crm-app">
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className="main-area">
        <Topbar
          setSidebarOpen={setSidebarOpen}
          onProfile={() => setActivePage("settings")}
        />

        <main className="content-area">{renderPage()}</main>
      </div>

      {/* DETAILS MODAL */}
      {selectedItem && (
        <Modal
          title={
            selectedType === "lead"
              ? "Lead Details"
              : "Deal Details"
          }
          onClose={closeDetails}
        >
          {selectedType === "lead" && (
            <div className="details-content">
              <div className="details-company">
                <div className="large-avatar">
                  {selectedItem.company.charAt(0)}
                </div>

                <div>
                  <h3>{selectedItem.name}</h3>
                  <p>{selectedItem.company}</p>
                </div>
              </div>

              <div className="details-grid">
                <div>
                  <span>Email</span>
                  <strong>{selectedItem.email}</strong>
                </div>

                <div>
                  <span>Phone</span>
                  <strong>{selectedItem.phone}</strong>
                </div>

                <div>
                  <span>Lead Status</span>
                  <strong>{selectedItem.status}</strong>
                </div>

                <div>
                  <span>Lead Value</span>
                  <strong>{money(selectedItem.value)}</strong>
                </div>

                <div>
                  <span>Source</span>
                  <strong>{selectedItem.source}</strong>
                </div>

                <div>
                  <span>Owner</span>
                  <strong>{selectedItem.owner}</strong>
                </div>
              </div>
            </div>
          )}

          {selectedType === "deal" && (
            <div className="details-content">
              <div className="details-company">
                <div className="large-avatar">
                  {selectedItem.company.charAt(0)}
                </div>

                <div>
                  <h3>{selectedItem.title}</h3>
                  <p>{selectedItem.company}</p>
                </div>
              </div>

              <div className="details-grid">
                <div>
                  <span>Deal Value</span>
                  <strong>{money(selectedItem.value)}</strong>
                </div>

                <div>
                  <span>Stage</span>
                  <strong>{selectedItem.stage}</strong>
                </div>

                <div>
                  <span>Probability</span>
                  <strong>{selectedItem.probability}%</strong>
                </div>

                <div>
                  <span>Owner</span>
                  <strong>{selectedItem.owner}</strong>
                </div>
              </div>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}