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
  `${prefix}-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 7)
    .toUpperCase()}`;

const today = () => new Date().toISOString().slice(0, 10);

const money = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN")}`;

const formatDate = (value) => {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const readStorage = (key, fallback) => {
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
    // Ignore localStorage errors.
  }
};

/* =========================================================
   DEFAULT DATA
========================================================= */

const defaultLeads = [
  {
    id: "LD-001",
    name: "Arjun Technologies",
    contact: "Arjun Menon",
    email: "arjun@arjuntech.com",
    phone: "+91 98765 10001",
    source: "Website",
    stage: "New",
    status: "Active",
    value: 450000,
    owner: "Saran Kumar",
    createdAt: "2026-09-01",
  },
  {
    id: "LD-002",
    name: "Bluewave Systems",
    contact: "Rahul Das",
    email: "rahul@bluewave.com",
    phone: "+91 98765 10002",
    source: "Referral",
    stage: "Qualified",
    status: "Active",
    value: 720000,
    owner: "Novitha",
    createdAt: "2026-09-03",
  },
  {
    id: "LD-003",
    name: "Nova Retail",
    contact: "Meera Nair",
    email: "meera@novaretail.com",
    phone: "+91 98765 10003",
    source: "LinkedIn",
    stage: "Proposal",
    status: "Active",
    value: 850000,
    owner: "Arun Kumar",
    createdAt: "2026-09-05",
  },
  {
    id: "LD-004",
    name: "Greenfield Foods",
    contact: "Vishnu Raj",
    email: "vishnu@greenfield.com",
    phone: "+91 98765 10004",
    source: "Campaign",
    stage: "Negotiation",
    status: "Active",
    value: 1250000,
    owner: "Priya",
    createdAt: "2026-09-06",
  },
  {
    id: "LD-005",
    name: "Alpha Manufacturing",
    contact: "Anil Kumar",
    email: "anil@alpha.com",
    phone: "+91 98765 10005",
    source: "Referral",
    stage: "Won",
    status: "Converted",
    value: 5000000,
    owner: "Saran Kumar",
    createdAt: "2026-09-08",
  },
  {
    id: "LD-006",
    name: "Cloud Matrix",
    contact: "Deepak S",
    email: "deepak@cloudmatrix.com",
    phone: "+91 98765 10006",
    source: "Website",
    stage: "Qualified",
    status: "Active",
    value: 680000,
    owner: "Karthik",
    createdAt: "2026-09-09",
  },
  {
    id: "LD-007",
    name: "Prime Logistics",
    contact: "Suresh Babu",
    email: "suresh@prime.com",
    phone: "+91 98765 10007",
    source: "Email",
    stage: "New",
    status: "Active",
    value: 390000,
    owner: "Novitha",
    createdAt: "2026-09-10",
  },
  {
    id: "LD-008",
    name: "Skyline Media",
    contact: "Nikhil Raj",
    email: "nikhil@skyline.com",
    phone: "+91 98765 10008",
    source: "LinkedIn",
    stage: "Proposal",
    status: "Active",
    value: 960000,
    owner: "Priya",
    createdAt: "2026-09-12",
  },
];

const defaultContacts = [
  {
    id: "CT-001",
    name: "Arjun Menon",
    company: "Arjun Technologies",
    email: "arjun@arjuntech.com",
    phone: "+91 98765 10001",
    status: "Active",
    owner: "Saran Kumar",
  },
  {
    id: "CT-002",
    name: "Rahul Das",
    company: "Bluewave Systems",
    email: "rahul@bluewave.com",
    phone: "+91 98765 10002",
    status: "Active",
    owner: "Novitha",
  },
  {
    id: "CT-003",
    name: "Meera Nair",
    company: "Nova Retail",
    email: "meera@novaretail.com",
    phone: "+91 98765 10003",
    status: "Active",
    owner: "Arun Kumar",
  },
  {
    id: "CT-004",
    name: "Anil Kumar",
    company: "Alpha Manufacturing",
    email: "anil@alpha.com",
    phone: "+91 98765 10005",
    status: "Customer",
    owner: "Saran Kumar",
  },
];

const defaultDeals = [
  {
    id: "DL-001",
    name: "Enterprise CRM License",
    company: "Bluewave Systems",
    value: 720000,
    stage: "Qualified",
    probability: 35,
    owner: "Novitha",
    expectedClose: "2026-10-10",
  },
  {
    id: "DL-002",
    name: "Retail Automation",
    company: "Nova Retail",
    value: 850000,
    stage: "Proposal",
    probability: 55,
    owner: "Arun Kumar",
    expectedClose: "2026-10-18",
  },
  {
    id: "DL-003",
    name: "Food Supply Platform",
    company: "Greenfield Foods",
    value: 1250000,
    stage: "Negotiation",
    probability: 75,
    owner: "Priya",
    expectedClose: "2026-10-22",
  },
  {
    id: "DL-004",
    name: "Cloud Migration",
    company: "Cloud Matrix",
    value: 680000,
    stage: "New",
    probability: 15,
    owner: "Karthik",
    expectedClose: "2026-11-04",
  },
  {
    id: "DL-005",
    name: "Manufacturing CRM",
    company: "Alpha Manufacturing",
    value: 5000000,
    stage: "Won",
    probability: 100,
    owner: "Saran Kumar",
    expectedClose: "2026-09-20",
  },
  {
    id: "DL-006",
    name: "Media Sales Suite",
    company: "Skyline Media",
    value: 960000,
    stage: "Proposal",
    probability: 55,
    owner: "Priya",
    expectedClose: "2026-11-12",
  },
];

const defaultActivities = [
  {
    id: "AC-001",
    type: "Call",
    title: "Follow-up call with Bluewave",
    contact: "Rahul Das",
    date: "2026-09-21",
    time: "10:30",
    owner: "Novitha",
    status: "Completed",
  },
  {
    id: "AC-002",
    type: "Meeting",
    title: "Proposal discussion",
    contact: "Meera Nair",
    date: "2026-09-22",
    time: "11:00",
    owner: "Arun Kumar",
    status: "Upcoming",
  },
  {
    id: "AC-003",
    type: "Email",
    title: "Send pricing document",
    contact: "Vishnu Raj",
    date: "2026-09-21",
    time: "14:00",
    owner: "Priya",
    status: "Upcoming",
  },
  {
    id: "AC-004",
    type: "Note",
    title: "Customer requirement updated",
    contact: "Anil Kumar",
    date: "2026-09-20",
    time: "16:30",
    owner: "Saran Kumar",
    status: "Completed",
  },
];

const defaultProfile = {
  name: "Saran Kumar",
  role: "Sales Administrator",
  email: "saran@crmcompany.com",
  phone: "+91 98765 43210",
  company: "CRM Sales Company",
  location: "Kerala, India",
};

const defaultNotifications = {
  newLead: true,
  dealUpdate: true,
  activityReminder: false,
  weeklyReport: true,
};

/* =========================================================
   ICON
========================================================= */

function Icon({ name, size = 18 }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.8",
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };

  const icons = {
    dashboard: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </>
    ),
    users: (
      <>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </>
    ),
    contacts: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M5 21a7 7 0 0 1 14 0" />
      </>
    ),
    deal: (
      <>
        <path d="M20 7h-9" />
        <path d="M20 12h-9" />
        <path d="M20 17h-9" />
        <path d="M5 7h.01" />
        <path d="M5 12h.01" />
        <path d="M5 17h.01" />
      </>
    ),
    pipeline: (
      <>
        <path d="M3 6h18" />
        <path d="M6 12h12" />
        <path d="M10 18h4" />
      </>
    ),
    activity: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
    analytics: (
      <>
        <path d="M4 19V5" />
        <path d="M4 19h17" />
        <path d="M8 16v-5" />
        <path d="M12 16V8" />
        <path d="M16 16v-9" />
        <path d="M20 16v-5" />
      </>
    ),
    settings: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-1.4 1.4-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1 1.55V21h-2v-.51a1.7 1.7 0 0 0-1-1.55 1.7 1.7 0 0 0-1.88.34l-.06.06-1.4-1.4.06-.06A1.7 1.7 0 0 0 8.6 15a1.7 1.7 0 0 0-1.55-1H6v-2h1.05a1.7 1.7 0 0 0 1.55-1 1.7 1.7 0 0 0-.34-1.88l-.06-.06 1.4-1.4.06.06a1.7 1.7 0 0 0 1.88.34 1.7 1.7 0 0 0 1-1.55V6h2v.51a1.7 1.7 0 0 0 1 1.55 1.7 1.7 0 0 0 1.88-.34l.06-.06 1.4 1.4-.06.06A1.7 1.7 0 0 0 19.4 11c.2.6.77 1 1.4 1H21v2h-.2a1.7 1.7 0 0 0-1.4 1Z" />
      </>
    ),
    bell: (
      <>
        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
        <path d="M10 21h4" />
      </>
    ),
    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-4-4" />
      </>
    ),
    menu: (
      <>
        <path d="M4 6h16" />
        <path d="M4 12h16" />
        <path d="M4 18h16" />
      </>
    ),
    plus: (
      <>
        <path d="M12 5v14" />
        <path d="M5 12h14" />
      </>
    ),
    eye: (
      <>
        <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" />
        <circle cx="12" cy="12" r="2.5" />
      </>
    ),
    edit: (
      <>
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" />
      </>
    ),
    trash: (
      <>
        <path d="M3 6h18" />
        <path d="M8 6V4h8v2" />
        <path d="M19 6l-1 15H6L5 6" />
        <path d="M10 11v6" />
        <path d="M14 11v6" />
      </>
    ),
    close: (
      <>
        <path d="m6 6 12 12" />
        <path d="m18 6-12 12" />
      </>
    ),
    arrow: (
      <>
        <path d="M5 12h14" />
        <path d="m13 6 6 6-6 6" />
      </>
    ),
    check: (
      <>
        <path d="m5 12 4 4L19 6" />
      </>
    ),
    calendar: (
      <>
        <rect x="3" y="4" width="18" height="17" rx="2" />
        <path d="M16 2v4" />
        <path d="M8 2v4" />
        <path d="M3 10h18" />
      </>
    ),
    logout: (
      <>
        <path d="M10 17l5-5-5-5" />
        <path d="M15 12H3" />
        <path d="M21 19V5a2 2 0 0 0-2-2h-6" />
      </>
    ),
  };

  return <svg {...common}>{icons[name] || icons.dashboard}</svg>;
}

/* =========================================================
   BASIC COMPONENTS
========================================================= */

function Button({
  children,
  variant = "primary",
  icon,
  onClick,
  type = "button",
}) {
  return (
    <button
      type={type}
      className={`btn btn-${variant}`}
      onClick={onClick}
    >
      {icon && <Icon name={icon} size={16} />}
      {children}
    </button>
  );
}

function Badge({ children, type = "default" }) {
  return <span className={`badge badge-${type}`}>{children}</span>;
}

function Avatar({ name = "User", size = "medium" }) {
  const initials = name
    .split(" ")
    .map((item) => item[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className={`avatar avatar-${size}`}>
      {initials || "U"}
    </div>
  );
}

function EmptyState({ title, text }) {
  return (
    <div className="empty-state">
      <div className="empty-icon">
        <Icon name="search" size={24} />
      </div>
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  );
}

function Modal({ title, children, onClose, width = "620px" }) {
  return (
    <div className="modal-overlay" onMouseDown={onClose}>
      <div
        className="modal-box"
        style={{ maxWidth: width }}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div>
            <h2>{title}</h2>
          </div>

          <button className="modal-close" onClick={onClose}>
            <Icon name="close" size={18} />
          </button>
        </div>

        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}

function ConfirmModal({
  title,
  message,
  onCancel,
  onConfirm,
}) {
  return (
    <Modal title={title} onClose={onCancel} width="430px">
      <div className="confirm-content">
        <div className="confirm-icon">
          <Icon name="trash" size={22} />
        </div>

        <p>{message}</p>

        <div className="modal-actions">
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>

          <Button variant="danger" onClick={onConfirm}>
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
}

function Toast({ toast }) {
  if (!toast) return null;

  return (
    <div className={`toast toast-${toast.type}`}>
      <div className="toast-icon">
        <Icon
          name={toast.type === "error" ? "close" : "check"}
          size={16}
        />
      </div>

      <span>{toast.message}</span>
    </div>
  );
}

/* =========================================================
   STAT CARD
========================================================= */

function StatCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  onClick,
}) {
  return (
    <div
      className={`stat-card ${onClick ? "stat-clickable" : ""}`}
      onClick={onClick}
    >
      <div className="stat-card-top">
        <div className={`stat-icon stat-${icon}`}>
          <Icon name={icon} size={20} />
        </div>

        <span className="stat-trend">{trend}</span>
      </div>

      <div className="stat-value">{value}</div>

      <div className="stat-title">{title}</div>

      <div className="stat-subtitle">{subtitle}</div>
    </div>
  );
}

/* =========================================================
   SIDEBAR
========================================================= */

function Sidebar({
  activePage,
  navigate,
  mobileOpen,
  setMobileOpen,
  leadCount,
  profile,
}) {
  const menu = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: "dashboard",
    },
    {
      id: "leads",
      label: "Leads",
      icon: "users",
      count: leadCount,
    },
    {
      id: "contacts",
      label: "Contacts",
      icon: "contacts",
    },
    {
      id: "deals",
      label: "Deals",
      icon: "deal",
    },
    {
      id: "pipeline",
      label: "Sales Pipeline",
      icon: "pipeline",
    },
    {
      id: "activities",
      label: "Activities",
      icon: "activity",
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: "analytics",
    },
  ];

  return (
    <>
      {mobileOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside className={`sidebar ${mobileOpen ? "sidebar-open" : ""}`}>
        <div className="brand">
          <div className="brand-logo">C</div>

          <div>
            <strong>CRM Sales</strong>
            <span>Management Suite</span>
          </div>

          <button
            className="mobile-sidebar-close"
            onClick={() => setMobileOpen(false)}
          >
            <Icon name="close" size={18} />
          </button>
        </div>

        <div className="sidebar-section-title">
          MAIN MENU
        </div>

        <nav className="sidebar-nav">
          {menu.map((item) => (
            <button
              key={item.id}
              className={
                activePage === item.id
                  ? "sidebar-item active"
                  : "sidebar-item"
              }
              onClick={() => {
                navigate(item.id);
                setMobileOpen(false);
              }}
            >
              <Icon name={item.icon} size={18} />

              <span>{item.label}</span>

              {item.count !== undefined && (
                <b>{item.count}</b>
              )}
            </button>
          ))}
        </nav>

        <div className="sidebar-section-title settings-title">
          SYSTEM
        </div>

        <nav className="sidebar-nav">
          <button
            className={
              activePage === "settings"
                ? "sidebar-item active"
                : "sidebar-item"
            }
            onClick={() => {
              navigate("settings");
              setMobileOpen(false);
            }}
          >
            <Icon name="settings" size={18} />
            <span>Settings</span>
          </button>
        </nav>

        <div className="sidebar-user">
          <Avatar name={profile.name} size="medium" />

          <div>
            <strong>{profile.name}</strong>
            <span>{profile.role}</span>
          </div>
        </div>
      </aside>
    </>
  );
}

/* =========================================================
   TOPBAR
========================================================= */

function Topbar({
  title,
  subtitle,
  onMenu,
  onProfile,
  profile,
  notificationCount,
}) {
  const [notificationOpen, setNotificationOpen] =
    useState(false);

  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button className="mobile-menu" onClick={onMenu}>
          <Icon name="menu" size={21} />
        </button>

        <div>
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>
      </div>

      <div className="topbar-right">
        <div className="topbar-dropdown-wrapper">
          <button
            className="topbar-icon-btn"
            onClick={() => {
              setNotificationOpen(!notificationOpen);
              setProfileOpen(false);
            }}
          >
            <Icon name="bell" size={19} />

            {notificationCount > 0 && (
              <span className="notification-dot">
                {notificationCount}
              </span>
            )}
          </button>

          {notificationOpen && (
            <div className="topbar-dropdown notification-dropdown">
              <div className="dropdown-title">
                <strong>Notifications</strong>
                <span>{notificationCount} active</span>
              </div>

              <div className="notification-item">
                <div className="notification-circle blue">
                  <Icon name="users" size={14} />
                </div>

                <div>
                  <strong>New lead activity</strong>
                  <span>Review your latest leads</span>
                </div>
              </div>

              <div className="notification-item">
                <div className="notification-circle green">
                  <Icon name="deal" size={14} />
                </div>

                <div>
                  <strong>Deal updated</strong>
                  <span>Manufacturing CRM was won</span>
                </div>
              </div>

              <div className="notification-item">
                <div className="notification-circle purple">
                  <Icon name="activity" size={14} />
                </div>

                <div>
                  <strong>Upcoming activity</strong>
                  <span>You have scheduled activities</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="topbar-dropdown-wrapper">
          <button
            className="profile-trigger"
            onClick={() => {
              setProfileOpen(!profileOpen);
              setNotificationOpen(false);
            }}
          >
            <Avatar name={profile.name} size="small" />

            <div>
              <strong>{profile.name}</strong>
              <span>{profile.role}</span>
            </div>

            <span className="profile-chevron">⌄</span>
          </button>

          {profileOpen && (
            <div className="topbar-dropdown profile-dropdown">
              <div className="profile-dropdown-head">
                <Avatar name={profile.name} size="large" />

                <div>
                  <strong>{profile.name}</strong>
                  <span>{profile.role}</span>
                </div>
              </div>

              <div className="profile-info">
                <div>
                  <span>Email</span>
                  <strong>{profile.email}</strong>
                </div>

                <div>
                  <span>Phone</span>
                  <strong>{profile.phone}</strong>
                </div>

                <div>
                  <span>Company</span>
                  <strong>{profile.company}</strong>
                </div>
              </div>

              <button
                className="profile-settings-btn"
                onClick={() => {
                  onProfile();
                  setProfileOpen(false);
                }}
              >
                <Icon name="settings" size={16} />
                Profile Settings
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

/* =========================================================
   FORM FIELD
========================================================= */

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
  options,
}) {
  return (
    <label className="form-field">
      <span>
        {label}
        {required && <em>*</em>}
      </span>

      {options ? (
        <select value={value} onChange={onChange}>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
        />
      )}
    </label>
  );
}

/* =========================================================
   LEAD FORM
========================================================= */

function LeadForm({
  lead,
  onSave,
  onClose,
}) {
  const [form, setForm] = useState(
    lead || {
      name: "",
      contact: "",
      email: "",
      phone: "",
      source: "Website",
      stage: "New",
      status: "Active",
      value: "",
      owner: "Saran Kumar",
    }
  );

  const [error, setError] = useState("");

  const update = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const submit = (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      setError("Company name is required.");
      return;
    }

    if (!form.contact.trim()) {
      setError("Contact name is required.");
      return;
    }

    if (!form.email.trim()) {
      setError("Email is required.");
      return;
    }

    onSave({
      ...form,
      id: form.id || uid("LD"),
      value: Number(form.value || 0),
      createdAt: form.createdAt || today(),
    });
  };

  return (
    <form onSubmit={submit}>
      {error && <div className="form-error">{error}</div>}

      <div className="form-grid">
        <Field
          label="Company Name"
          value={form.name}
          required
          placeholder="Enter company"
          onChange={(e) => update("name", e.target.value)}
        />

        <Field
          label="Contact Name"
          value={form.contact}
          required
          placeholder="Enter contact"
          onChange={(e) =>
            update("contact", e.target.value)
          }
        />

        <Field
          label="Email"
          value={form.email}
          required
          type="email"
          placeholder="email@example.com"
          onChange={(e) => update("email", e.target.value)}
        />

        <Field
          label="Phone"
          value={form.phone}
          placeholder="+91"
          onChange={(e) => update("phone", e.target.value)}
        />

        <Field
          label="Source"
          value={form.source}
          options={[
            "Website",
            "Referral",
            "LinkedIn",
            "Campaign",
            "Email",
            "Cold Call",
          ]}
          onChange={(e) => update("source", e.target.value)}
        />

        <Field
          label="Stage"
          value={form.stage}
          options={[
            "New",
            "Qualified",
            "Proposal",
            "Negotiation",
            "Won",
          ]}
          onChange={(e) => update("stage", e.target.value)}
        />

        <Field
          label="Status"
          value={form.status}
          options={[
            "Active",
            "Converted",
            "Inactive",
          ]}
          onChange={(e) => update("status", e.target.value)}
        />

        <Field
          label="Deal Value"
          value={form.value}
          type="number"
          placeholder="0"
          onChange={(e) => update("value", e.target.value)}
        />

        <Field
          label="Owner"
          value={form.owner}
          options={[
            "Saran Kumar",
            "Novitha",
            "Arun Kumar",
            "Priya",
            "Karthik",
          ]}
          onChange={(e) => update("owner", e.target.value)}
        />
      </div>

      <div className="modal-actions">
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>

        <Button type="submit" variant="primary">
          {lead ? "Update Lead" : "Create Lead"}
        </Button>
      </div>
    </form>
  );
}

/* =========================================================
   CONTACT FORM
========================================================= */

function ContactForm({
  contact,
  onSave,
  onClose,
}) {
  const [form, setForm] = useState(
    contact || {
      name: "",
      company: "",
      email: "",
      phone: "",
      status: "Active",
      owner: "Saran Kumar",
    }
  );

  const [error, setError] = useState("");

  const update = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const submit = (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      setError("Contact name is required.");
      return;
    }

    if (!form.email.trim()) {
      setError("Email is required.");
      return;
    }

    onSave({
      ...form,
      id: form.id || uid("CT"),
    });
  };

  return (
    <form onSubmit={submit}>
      {error && <div className="form-error">{error}</div>}

      <div className="form-grid">
        <Field
          label="Full Name"
          value={form.name}
          required
          onChange={(e) => update("name", e.target.value)}
        />

        <Field
          label="Company"
          value={form.company}
          onChange={(e) =>
            update("company", e.target.value)
          }
        />

        <Field
          label="Email"
          value={form.email}
          required
          type="email"
          onChange={(e) => update("email", e.target.value)}
        />

        <Field
          label="Phone"
          value={form.phone}
          onChange={(e) => update("phone", e.target.value)}
        />

        <Field
          label="Status"
          value={form.status}
          options={["Active", "Customer", "Inactive"]}
          onChange={(e) =>
            update("status", e.target.value)
          }
        />

        <Field
          label="Owner"
          value={form.owner}
          options={[
            "Saran Kumar",
            "Novitha",
            "Arun Kumar",
            "Priya",
            "Karthik",
          ]}
          onChange={(e) =>
            update("owner", e.target.value)
          }
        />
      </div>

      <div className="modal-actions">
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>

        <Button type="submit">
          {contact ? "Update Contact" : "Create Contact"}
        </Button>
      </div>
    </form>
  );
}

/* =========================================================
   DEAL FORM
========================================================= */

function DealForm({
  deal,
  onSave,
  onClose,
}) {
  const [form, setForm] = useState(
    deal || {
      name: "",
      company: "",
      value: "",
      stage: "New",
      probability: 15,
      owner: "Saran Kumar",
      expectedClose: today(),
    }
  );

  const [error, setError] = useState("");

  const update = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const changeStage = (stage) => {
    const probabilityMap = {
      New: 15,
      Qualified: 35,
      Proposal: 55,
      Negotiation: 75,
      Won: 100,
    };

    setForm((prev) => ({
      ...prev,
      stage,
      probability: probabilityMap[stage],
    }));
  };

  const submit = (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      setError("Deal name is required.");
      return;
    }

    if (!form.company.trim()) {
      setError("Company is required.");
      return;
    }

    if (!form.value || Number(form.value) <= 0) {
      setError("Deal value must be greater than zero.");
      return;
    }

    onSave({
      ...form,
      id: form.id || uid("DL"),
      value: Number(form.value),
      probability: Number(form.probability || 0),
    });
  };

  return (
    <form onSubmit={submit}>
      {error && <div className="form-error">{error}</div>}

      <div className="form-grid">
        <Field
          label="Deal Name"
          value={form.name}
          required
          placeholder="Enter deal name"
          onChange={(e) => update("name", e.target.value)}
        />

        <Field
          label="Company"
          value={form.company}
          required
          placeholder="Enter company"
          onChange={(e) =>
            update("company", e.target.value)
          }
        />

        <Field
          label="Deal Value"
          value={form.value}
          required
          type="number"
          onChange={(e) => update("value", e.target.value)}
        />

        <Field
          label="Stage"
          value={form.stage}
          options={[
            "New",
            "Qualified",
            "Proposal",
            "Negotiation",
            "Won",
          ]}
          onChange={(e) => changeStage(e.target.value)}
        />

        <Field
          label="Owner"
          value={form.owner}
          options={[
            "Saran Kumar",
            "Novitha",
            "Arun Kumar",
            "Priya",
            "Karthik",
          ]}
          onChange={(e) =>
            update("owner", e.target.value)
          }
        />

        <Field
          label="Expected Close"
          value={form.expectedClose}
          type="date"
          onChange={(e) =>
            update("expectedClose", e.target.value)
          }
        />
      </div>

      <div className="probability-preview">
        <div>
          <span>Probability</span>
          <strong>{form.probability}%</strong>
        </div>

        <div className="probability-track">
          <div
            style={{
              width: `${form.probability}%`,
            }}
          />
        </div>
      </div>

      <div className="modal-actions">
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>

        <Button type="submit">
          {deal ? "Update Deal" : "Create Deal"}
        </Button>
      </div>
    </form>
  );
}

/* =========================================================
   DASHBOARD
========================================================= */

function Dashboard({
  leads,
  deals,
  contacts,
  activities,
  navigate,
}) {
  const revenue = deals
    .filter((deal) => deal.stage === "Won")
    .reduce(
      (sum, deal) => sum + Number(deal.value || 0),
      0
    );

  const pipeline = deals
    .filter((deal) => deal.stage !== "Won")
    .reduce(
      (sum, deal) => sum + Number(deal.value || 0),
      0
    );

  const wonLeads = leads.filter(
    (lead) => lead.stage === "Won"
  ).length;

  const conversion =
    leads.length > 0
      ? Math.round((wonLeads / leads.length) * 100)
      : 0;

  const stageCounts = [
    "New",
    "Qualified",
    "Proposal",
    "Negotiation",
    "Won",
  ].map((stage) => ({
    stage,
    count: leads.filter(
      (lead) => lead.stage === stage
    ).length,
  }));

  const revenueMonths = [
    { month: "Jan", value: 42 },
    { month: "Feb", value: 56 },
    { month: "Mar", value: 48 },
    { month: "Apr", value: 68 },
    { month: "May", value: 76 },
    { month: "Jun", value: 92 },
    { month: "Jul", value: 84 },
    { month: "Aug", value: 108 },
    { month: "Sep", value: 96 },
    { month: "Oct", value: 118 },
    { month: "Nov", value: 132 },
    { month: "Dec", value: 148 },
  ];

  return (
    <div className="page-content">
      <div className="stats-grid">
        <StatCard
          title="Won Revenue"
          value={money(revenue)}
          subtitle="Closed sales"
          icon="deal"
          trend="+12.8%"
        />

        <StatCard
          title="Active Pipeline"
          value={money(pipeline)}
          subtitle="Open opportunities"
          icon="pipeline"
          trend="+8.4%"
        />

        <StatCard
          title="Total Leads"
          value={leads.length}
          subtitle="All active leads"
          icon="users"
          trend="+15.2%"
          onClick={() => navigate("leads")}
        />

        <StatCard
          title="Conversion Rate"
          value={`${conversion}%`}
          subtitle="Lead to customer"
          icon="analytics"
          trend="+4.6%"
        />
      </div>

      <div className="dashboard-grid">
        {/* REVENUE */}

        <section className="panel revenue-panel">
          <div className="panel-header revenue-panel-header">
            <div>
              <h2>Revenue Overview</h2>
              <p>Monthly revenue performance</p>
            </div>

            <select className="small-select">
              <option>Last 12 Months</option>
              <option>Last 6 Months</option>
              <option>Last 3 Months</option>
            </select>
          </div>

          <div className="revenue-summary">
            <div className="revenue-total">
              <span>Total Revenue</span>
              <strong>{money(revenue)}</strong>
            </div>

            <div className="revenue-growth">
              <span className="growth-icon">↑</span>

              <div>
                <strong>18.6%</strong>
                <span>vs last year</span>
              </div>
            </div>
          </div>

          <div className="revenue-chart">
            {revenueMonths.map((item, index) => (
              <div
                className="revenue-column"
                key={item.month}
              >
                <div className="revenue-tooltip">
                  ₹{item.value}K
                </div>

                <div className="revenue-bar-area">
                  <div
                    className="revenue-bar"
                    style={{
                      height: `${(item.value / 150) * 100}%`,
                      animationDelay: `${index * 0.05}s`,
                    }}
                  />
                </div>

                <span className="revenue-month">
                  {item.month}
                </span>
              </div>
            ))}
          </div>

          <div className="revenue-bottom">
            <div className="revenue-legend">
              <span className="revenue-legend-dot" />
              <span>Revenue</span>
            </div>

            <div className="revenue-stats">
              <div>
                <span>Highest</span>
                <strong>₹148K</strong>
              </div>

              <div>
                <span>Average</span>
                <strong>₹86.5K</strong>
              </div>

              <div>
                <span>Target</span>
                <strong>₹12L</strong>
              </div>
            </div>
          </div>
        </section>

        {/* LEAD FUNNEL */}

        <section className="panel">
          <div className="panel-header">
            <div>
              <h2>Lead Funnel</h2>
              <p>Lead progression by stage</p>
            </div>
          </div>

          <div className="funnel">
            {stageCounts.map((item, index) => {
              const widths = [100, 82, 65, 48, 32];

              return (
                <div className="funnel-row" key={item.stage}>
                  <div className="funnel-label">
                    <span>{item.stage}</span>
                    <strong>{item.count}</strong>
                  </div>

                  <div className="funnel-track">
                    <div
                      className={`funnel-fill funnel-${index}`}
                      style={{
                        width: `${widths[index]}%`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <button
            className="panel-link"
            onClick={() => navigate("leads")}
          >
            View all leads
            <Icon name="arrow" size={15} />
          </button>
        </section>
      </div>

      <div className="dashboard-grid lower">
        {/* ACTIVITIES */}

        <section className="panel">
          <div className="panel-header">
            <div>
              <h2>Recent Activities</h2>
              <p>Your latest sales activities</p>
            </div>

            <button
              className="panel-link"
              onClick={() => navigate("activities")}
            >
              View all
            </button>
          </div>

          <div className="activity-list">
            {activities.slice(0, 4).map((activity) => (
              <div
                className="activity-row"
                key={activity.id}
              >
                <div className="activity-icon">
                  <Icon
                    name={
                      activity.type === "Call"
                        ? "users"
                        : activity.type === "Meeting"
                        ? "calendar"
                        : "activity"
                    }
                    size={15}
                  />
                </div>

                <div className="activity-content">
                  <strong>{activity.title}</strong>
                  <span>
                    {activity.contact} •{" "}
                    {formatDate(activity.date)}
                  </span>
                </div>

                <Badge
                  type={
                    activity.status === "Completed"
                      ? "success"
                      : "warning"
                  }
                >
                  {activity.status}
                </Badge>
              </div>
            ))}
          </div>
        </section>

        {/* SALES SUMMARY */}

        <section className="panel">
          <div className="panel-header">
            <div>
              <h2>Sales Summary</h2>
              <p>Current sales performance</p>
            </div>
          </div>

          <div className="summary-list">
            <div className="summary-item">
              <div>
                <span>Total Contacts</span>
                <strong>{contacts.length}</strong>
              </div>

              <div className="summary-icon blue">
                <Icon name="contacts" size={17} />
              </div>
            </div>

            <div className="summary-item">
              <div>
                <span>Total Deals</span>
                <strong>{deals.length}</strong>
              </div>

              <div className="summary-icon purple">
                <Icon name="deal" size={17} />
              </div>
            </div>

            <div className="summary-item">
              <div>
                <span>Won Deals</span>
                <strong>
                  {
                    deals.filter(
                      (deal) => deal.stage === "Won"
                    ).length
                  }
                </strong>
              </div>

              <div className="summary-icon green">
                <Icon name="check" size={17} />
              </div>
            </div>

            <div className="summary-item">
              <div>
                <span>Open Opportunities</span>
                <strong>
                  {
                    deals.filter(
                      (deal) => deal.stage !== "Won"
                    ).length
                  }
                </strong>
              </div>

              <div className="summary-icon orange">
                <Icon name="pipeline" size={17} />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

/* =========================================================
   LEADS PAGE
========================================================= */

function LeadsPage({
  leads,
  navigate,
  onAdd,
  onEdit,
  onDelete,
  onView,
}) {
  const [search, setSearch] = useState("");
  const [stage, setStage] = useState("All");
  const [status, setStatus] = useState("All");
  const [page, setPage] = useState(1);

  const perPage = 5;

  const filtered = useMemo(() => {
    return leads.filter((lead) => {
      const query = search.toLowerCase();

      const matchesSearch =
        lead.name.toLowerCase().includes(query) ||
        lead.contact.toLowerCase().includes(query) ||
        lead.email.toLowerCase().includes(query);

      const matchesStage =
        stage === "All" || lead.stage === stage;

      const matchesStatus =
        status === "All" || lead.status === status;

      return (
        matchesSearch &&
        matchesStage &&
        matchesStatus
      );
    });
  }, [leads, search, stage, status]);

  const totalPages = Math.max(
    1,
    Math.ceil(filtered.length / perPage)
  );

  const visible = filtered.slice(
    (page - 1) * perPage,
    page * perPage
  );

  useEffect(() => {
    setPage(1);
  }, [search, stage, status]);

  return (
    <div className="page-content">
      <div className="page-heading">
        <div>
          <h1>Leads</h1>
          <p>Manage and convert your sales leads</p>
        </div>

        <Button icon="plus" onClick={onAdd}>
          Add Lead
        </Button>
      </div>

      <div className="filter-panel">
        <div className="search-box">
          <Icon name="search" size={17} />
          <input
            value={search}
            placeholder="Search leads..."
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          value={stage}
          onChange={(e) => setStage(e.target.value)}
        >
          <option value="All">All Stages</option>
          <option>New</option>
          <option>Qualified</option>
          <option>Proposal</option>
          <option>Negotiation</option>
          <option>Won</option>
        </select>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="All">All Status</option>
          <option>Active</option>
          <option>Converted</option>
          <option>Inactive</option>
        </select>
      </div>

      <div className="panel table-panel">
        {visible.length === 0 ? (
          <EmptyState
            title="No leads found"
            text="Try changing your search or filters."
          />
        ) : (
          <>
            <div className="table-scroll">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Lead</th>
                    <th>Contact</th>
                    <th>Stage</th>
                    <th>Value</th>
                    <th>Owner</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {visible.map((lead) => (
                    <tr key={lead.id}>
                      <td>
                        <div className="table-person">
                          <Avatar name={lead.name} size="small" />
                          <div>
                            <strong>{lead.name}</strong>
                            <span>{lead.id}</span>
                          </div>
                        </div>
                      </td>

                      <td>
                        <div className="table-contact">
                          <strong>{lead.contact}</strong>
                          <span>{lead.email}</span>
                        </div>
                      </td>

                      <td>
                        <Badge
                          type={lead.stage
                            .toLowerCase()
                            .replace(" ", "-")}
                        >
                          {lead.stage}
                        </Badge>
                      </td>

                      <td>
                        <strong>{money(lead.value)}</strong>
                      </td>

                      <td>{lead.owner}</td>

                      <td>{formatDate(lead.createdAt)}</td>

                      <td>
                        <div className="table-actions">
                          <button
                            className="action-btn view"
                            onClick={() => onView(lead)}
                            title="View"
                          >
                            <Icon name="eye" size={15} />
                          </button>

                          <button
                            className="action-btn edit"
                            onClick={() => onEdit(lead)}
                            title="Edit"
                          >
                            <Icon name="edit" size={15} />
                          </button>

                          <button
                            className="action-btn delete"
                            onClick={() => onDelete(lead)}
                            title="Delete"
                          >
                            <Icon name="trash" size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Pagination
              page={page}
              totalPages={totalPages}
              setPage={setPage}
              total={filtered.length}
            />
          </>
        )}
      </div>
    </div>
  );
}

/* =========================================================
   CONTACTS PAGE
========================================================= */

function ContactsPage({
  contacts,
  onAdd,
  onEdit,
  onDelete,
  onView,
}) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [page, setPage] = useState(1);

  const perPage = 5;

  const filtered = useMemo(() => {
    return contacts.filter((contact) => {
      const query = search.toLowerCase();

      return (
        (
          contact.name +
          contact.company +
          contact.email
        )
          .toLowerCase()
          .includes(query) &&
        (status === "All" || contact.status === status)
      );
    });
  }, [contacts, search, status]);

  const totalPages = Math.max(
    1,
    Math.ceil(filtered.length / perPage)
  );

  const visible = filtered.slice(
    (page - 1) * perPage,
    page * perPage
  );

  useEffect(() => {
    setPage(1);
  }, [search, status]);

  return (
    <div className="page-content">
      <div className="page-heading">
        <div>
          <h1>Contacts</h1>
          <p>Manage your customer contacts</p>
        </div>

        <Button icon="plus" onClick={onAdd}>
          Add Contact
        </Button>
      </div>

      <div className="filter-panel">
        <div className="search-box">
          <Icon name="search" size={17} />
          <input
            value={search}
            placeholder="Search contacts..."
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option>All</option>
          <option>Active</option>
          <option>Customer</option>
          <option>Inactive</option>
        </select>
      </div>

      <div className="panel table-panel">
        {visible.length === 0 ? (
          <EmptyState
            title="No contacts found"
            text="Try changing your search or filters."
          />
        ) : (
          <>
            <div className="table-scroll">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Contact</th>
                    <th>Company</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Status</th>
                    <th>Owner</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {visible.map((contact) => (
                    <tr key={contact.id}>
                      <td>
                        <div className="table-person">
                          <Avatar
                            name={contact.name}
                            size="small"
                          />
                          <div>
                            <strong>{contact.name}</strong>
                            <span>{contact.id}</span>
                          </div>
                        </div>
                      </td>

                      <td>{contact.company}</td>

                      <td>{contact.email}</td>

                      <td>{contact.phone}</td>

                      <td>
                        <Badge
                          type={
                            contact.status === "Customer"
                              ? "success"
                              : contact.status === "Active"
                              ? "info"
                              : "default"
                          }
                        >
                          {contact.status}
                        </Badge>
                      </td>

                      <td>{contact.owner}</td>

                      <td>
                        <div className="table-actions">
                          <button
                            className="action-btn view"
                            onClick={() => onView(contact)}
                          >
                            <Icon name="eye" size={15} />
                          </button>

                          <button
                            className="action-btn edit"
                            onClick={() => onEdit(contact)}
                          >
                            <Icon name="edit" size={15} />
                          </button>

                          <button
                            className="action-btn delete"
                            onClick={() => onDelete(contact)}
                          >
                            <Icon name="trash" size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Pagination
              page={page}
              totalPages={totalPages}
              setPage={setPage}
              total={filtered.length}
            />
          </>
        )}
      </div>
    </div>
  );
}

/* =========================================================
   DEALS PAGE
========================================================= */

function DealsPage({
  deals,
  onAdd,
  onEdit,
  onDelete,
  onView,
}) {
  const [search, setSearch] = useState("");
  const [stage, setStage] = useState("All");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);

  const perPage = 5;

  const filtered = useMemo(() => {
    let result = deals.filter((deal) => {
      const query = search.toLowerCase();

      return (
        (
          deal.name +
          deal.company +
          deal.owner
        )
          .toLowerCase()
          .includes(query) &&
        (stage === "All" || deal.stage === stage)
      );
    });

    if (sort === "value-high") {
      result.sort(
        (a, b) => Number(b.value) - Number(a.value)
      );
    }

    if (sort === "value-low") {
      result.sort(
        (a, b) => Number(a.value) - Number(b.value)
      );
    }

    if (sort === "name") {
      result.sort((a, b) =>
        a.name.localeCompare(b.name)
      );
    }

    return result;
  }, [deals, search, stage, sort]);

  const totalPages = Math.max(
    1,
    Math.ceil(filtered.length / perPage)
  );

  const visible = filtered.slice(
    (page - 1) * perPage,
    page * perPage
  );

  useEffect(() => {
    setPage(1);
  }, [search, stage, sort]);

  return (
    <div className="page-content">
      <div className="page-heading">
        <div>
          <h1>Deals</h1>
          <p>Track opportunities and revenue</p>
        </div>

        <Button icon="plus" onClick={onAdd}>
          Add Deal
        </Button>
      </div>

      <div className="filter-panel">
        <div className="search-box">
          <Icon name="search" size={17} />
          <input
            value={search}
            placeholder="Search deals..."
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          value={stage}
          onChange={(e) => setStage(e.target.value)}
        >
          <option>All</option>
          <option>New</option>
          <option>Qualified</option>
          <option>Proposal</option>
          <option>Negotiation</option>
          <option>Won</option>
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="newest">Newest</option>
          <option value="value-high">
            Value: High to Low
          </option>
          <option value="value-low">
            Value: Low to High
          </option>
          <option value="name">Name</option>
        </select>
      </div>

      <div className="panel table-panel">
        {visible.length === 0 ? (
          <EmptyState
            title="No deals found"
            text="Try changing your search or filters."
          />
        ) : (
          <>
            <div className="table-scroll">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Deal</th>
                    <th>Company</th>
                    <th>Stage</th>
                    <th>Value</th>
                    <th>Probability</th>
                    <th>Close Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {visible.map((deal) => (
                    <tr key={deal.id}>
                      <td>
                        <div className="table-person">
                          <Avatar
                            name={deal.name}
                            size="small"
                          />
                          <div>
                            <strong>{deal.name}</strong>
                            <span>{deal.id}</span>
                          </div>
                        </div>
                      </td>

                      <td>{deal.company}</td>

                      <td>
                        <Badge
                          type={deal.stage
                            .toLowerCase()
                            .replace(" ", "-")}
                        >
                          {deal.stage}
                        </Badge>
                      </td>

                      <td>
                        <strong>{money(deal.value)}</strong>
                      </td>

                      <td>
                        <div className="table-progress">
                          <div>
                            <span
                              style={{
                                width: `${deal.probability}%`,
                              }}
                            />
                          </div>
                          <b>{deal.probability}%</b>
                        </div>
                      </td>

                      <td>
                        {formatDate(deal.expectedClose)}
                      </td>

                      <td>
                        <div className="table-actions">
                          <button
                            className="action-btn view"
                            onClick={() => onView(deal)}
                          >
                            <Icon name="eye" size={15} />
                          </button>

                          <button
                            className="action-btn edit"
                            onClick={() => onEdit(deal)}
                          >
                            <Icon name="edit" size={15} />
                          </button>

                          <button
                            className="action-btn delete"
                            onClick={() => onDelete(deal)}
                          >
                            <Icon name="trash" size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Pagination
              page={page}
              totalPages={totalPages}
              setPage={setPage}
              total={filtered.length}
            />
          </>
        )}
      </div>
    </div>
  );
}

/* =========================================================
   PAGINATION
========================================================= */

function Pagination({
  page,
  totalPages,
  setPage,
  total,
}) {
  return (
    <div className="pagination">
      <span>
        Showing page {page} of {totalPages} • {total} records
      </span>

      <div className="pagination-buttons">
        <button
          disabled={page === 1}
          onClick={() =>
            setPage((current) =>
              Math.max(1, current - 1)
            )
          }
        >
          Previous
        </button>

        {Array.from(
          { length: totalPages },
          (_, index) => index + 1
        )
          .slice(0, 5)
          .map((number) => (
            <button
              key={number}
              className={
                page === number ? "active" : ""
              }
              onClick={() => setPage(number)}
            >
              {number}
            </button>
          ))}

        <button
          disabled={page === totalPages}
          onClick={() =>
            setPage((current) =>
              Math.min(totalPages, current + 1)
            )
          }
        >
          Next
        </button>
      </div>
    </div>
  );
}

/* =========================================================
   PIPELINE PAGE
========================================================= */

function PipelinePage({
  deals,
  setDeals,
  onAdd,
  onEdit,
  onDelete,
  onView,
  setToast,
}) {
  const stages = [
    "New",
    "Qualified",
    "Proposal",
    "Negotiation",
    "Won",
  ];

  const [draggedDeal, setDraggedDeal] = useState(null);

  const probabilityMap = {
    New: 15,
    Qualified: 35,
    Proposal: 55,
    Negotiation: 75,
    Won: 100,
  };

  const stageClass = {
    New: "pipeline-new",
    Qualified: "pipeline-qualified",
    Proposal: "pipeline-proposal",
    Negotiation: "pipeline-negotiation",
    Won: "pipeline-won",
  };

  const handleDrop = (stage) => {
    if (!draggedDeal) return;

    if (draggedDeal.stage === stage) {
      setDraggedDeal(null);
      return;
    }

    setDeals((prev) =>
      prev.map((deal) =>
        deal.id === draggedDeal.id
          ? {
              ...deal,
              stage,
              probability: probabilityMap[stage],
            }
          : deal
      )
    );

    setToast({
      type: "success",
      message: `${draggedDeal.name} moved to ${stage}`,
    });

    setDraggedDeal(null);
  };

  return (
    <div className="page-content pipeline-page">
      <div className="page-heading">
        <div>
          <h1>Sales Pipeline</h1>
          <p>
            Drag and drop deals between pipeline stages
          </p>
        </div>

        <Button icon="plus" onClick={onAdd}>
          Add Deal
        </Button>
      </div>

      <div className="pipeline-board">
        {stages.map((stage) => {
          const stageDeals = deals.filter(
            (deal) => deal.stage === stage
          );

          const totalValue = stageDeals.reduce(
            (sum, deal) => sum + Number(deal.value || 0),
            0
          );

          return (
            <div
              className={`pipeline-column ${stageClass[stage]}`}
              key={stage}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(stage)}
            >
              <div className="pipeline-column-header">
                <div>
                  <div className="pipeline-title-row">
                    <span className="pipeline-stage-dot" />
                    <h3>{stage}</h3>
                    <span className="pipeline-count">
                      {stageDeals.length}
                    </span>
                  </div>

                  <span className="pipeline-total">
                    {money(totalValue)}
                  </span>
                </div>

                <button
                  className="pipeline-add-btn"
                  onClick={onAdd}
                >
                  +
                </button>
              </div>

              <div
                className={`pipeline-drop-zone ${
                  draggedDeal ? "drag-active" : ""
                }`}
              >
                {stageDeals.length === 0 ? (
                  <div className="pipeline-empty">
                    <div className="pipeline-empty-icon">
                      ↓
                    </div>

                    <span>Drop deal here</span>
                  </div>
                ) : (
                  stageDeals.map((deal) => (
                    <div
                      className={`deal-card ${
                        draggedDeal?.id === deal.id
                          ? "is-dragging"
                          : ""
                      }`}
                      key={deal.id}
                      draggable
                      onDragStart={() =>
                        setDraggedDeal(deal)
                      }
                      onDragEnd={() =>
                        setDraggedDeal(null)
                      }
                    >
                      <div className="deal-card-top">
                        <span className="deal-id">
                          {deal.id}
                        </span>

                        <span className="drag-handle">
                          ⋮⋮
                        </span>
                      </div>

                      <h4>{deal.name}</h4>

                      <p className="deal-company">
                        {deal.company}
                      </p>

                      <div className="deal-value-row">
                        <strong>
                          {money(deal.value)}
                        </strong>

                        <span className="probability">
                          {deal.probability}%
                        </span>
                      </div>

                      <div className="deal-progress">
                        <div
                          style={{
                            width: `${deal.probability}%`,
                          }}
                        />
                      </div>

                      <div className="deal-card-footer">
                        <div className="deal-owner">
                          <Avatar
                            name={deal.owner}
                            size="small"
                          />

                          <span>{deal.owner}</span>
                        </div>

                        <div className="deal-card-actions">
                          <button
                            className="pipeline-view-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              onView(deal);
                            }}
                          >
                            View
                          </button>

                          <button
                            className="pipeline-edit-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              onEdit(deal);
                            }}
                          >
                            <Icon name="edit" size={13} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
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
   ACTIVITIES PAGE
========================================================= */

function ActivitiesPage({
  activities,
  onAdd,
}) {
  const [filter, setFilter] = useState("All");

  const filtered =
    filter === "All"
      ? activities
      : activities.filter(
          (activity) => activity.type === filter
        );

  return (
    <div className="page-content">
      <div className="page-heading">
        <div>
          <h1>Activities</h1>
          <p>Track calls, meetings, emails and notes</p>
        </div>

        <Button icon="plus" onClick={onAdd}>
          Add Activity
        </Button>
      </div>

      <div className="activity-filters">
        {["All", "Call", "Meeting", "Email", "Note"].map(
          (item) => (
            <button
              key={item}
              className={
                filter === item ? "active" : ""
              }
              onClick={() => setFilter(item)}
            >
              {item}
            </button>
          )
        )}
      </div>

      <div className="panel">
        <div className="full-activity-list">
          {filtered.length === 0 ? (
            <EmptyState
              title="No activities"
              text="There are no activities for this filter."
            />
          ) : (
            filtered.map((activity) => (
              <div
                className="full-activity-item"
                key={activity.id}
              >
                <div className="activity-timeline-dot">
                  <Icon
                    name={
                      activity.type === "Meeting"
                        ? "calendar"
                        : activity.type === "Call"
                        ? "users"
                        : "activity"
                    }
                    size={15}
                  />
                </div>

                <div className="full-activity-content">
                  <div>
                    <span className="activity-type">
                      {activity.type}
                    </span>

                    <h3>{activity.title}</h3>

                    <p>
                      {activity.contact} •{" "}
                      {formatDate(activity.date)} •{" "}
                      {activity.time}
                    </p>
                  </div>

                  <Badge
                    type={
                      activity.status === "Completed"
                        ? "success"
                        : "warning"
                    }
                  >
                    {activity.status}
                  </Badge>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   ANALYTICS PAGE
========================================================= */

function AnalyticsPage({ leads, deals }) {
  const wonRevenue = deals
    .filter((deal) => deal.stage === "Won")
    .reduce(
      (sum, deal) => sum + Number(deal.value || 0),
      0
    );

  const pipeline = deals
    .filter((deal) => deal.stage !== "Won")
    .reduce(
      (sum, deal) => sum + Number(deal.value || 0),
      0
    );

  const weighted = deals
    .filter((deal) => deal.stage !== "Won")
    .reduce(
      (sum, deal) =>
        sum +
        Number(deal.value || 0) *
          (Number(deal.probability || 0) / 100),
      0
    );

  const stages = [
    "New",
    "Qualified",
    "Proposal",
    "Negotiation",
    "Won",
  ];

  const stageData = stages.map((stage) => ({
    stage,
    count: leads.filter(
      (lead) => lead.stage === stage
    ).length,
  }));

  const maxCount = Math.max(
    1,
    ...stageData.map((item) => item.count)
  );

  return (
    <div className="page-content">
      <div className="page-heading">
        <div>
          <h1>Analytics</h1>
          <p>Sales performance and pipeline insights</p>
        </div>
      </div>

      <div className="analytics-cards">
        <div className="analytics-card">
          <span>Won Revenue</span>
          <strong>{money(wonRevenue)}</strong>
          <small>Closed opportunities</small>
        </div>

        <div className="analytics-card">
          <span>Pipeline Value</span>
          <strong>{money(pipeline)}</strong>
          <small>Open opportunities</small>
        </div>

        <div className="analytics-card">
          <span>Weighted Pipeline</span>
          <strong>{money(weighted)}</strong>
          <small>Probability adjusted</small>
        </div>

        <div className="analytics-card">
          <span>Total Leads</span>
          <strong>{leads.length}</strong>
          <small>Current lead base</small>
        </div>
      </div>

      <div className="analytics-grid">
        <section className="panel">
          <div className="panel-header">
            <div>
              <h2>Lead Stage Performance</h2>
              <p>Distribution of leads</p>
            </div>
          </div>

          <div className="analytics-bars">
            {stageData.map((item) => (
              <div
                className="analytics-bar-row"
                key={item.stage}
              >
                <div className="analytics-bar-label">
                  <span>{item.stage}</span>
                  <strong>{item.count}</strong>
                </div>

                <div className="analytics-track">
                  <div
                    style={{
                      width: `${
                        (item.count / maxCount) * 100
                      }%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="panel">
          <div className="panel-header">
            <div>
              <h2>Deal Distribution</h2>
              <p>Deals by current stage</p>
            </div>
          </div>

          <div className="deal-distribution">
            {stages.map((stage) => {
              const count = deals.filter(
                (deal) => deal.stage === stage
              ).length;

              return (
                <div
                  className="distribution-row"
                  key={stage}
                >
                  <div>
                    <span
                      className={`distribution-dot ${stage
                        .toLowerCase()
                        .replace(" ", "-")}`}
                    />

                    <span>{stage}</span>
                  </div>

                  <strong>{count}</strong>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}

/* =========================================================
   SETTINGS
========================================================= */

function SettingsPage({
  profile,
  setProfile,
  notifications,
  setNotifications,
  setToast,
}) {
  const [form, setForm] = useState(profile);

  const update = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const saveProfile = () => {
    setProfile(form);

    setToast({
      type: "success",
      message: "Profile updated successfully.",
    });
  };

  const toggleNotification = (key) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="page-content">
      <div className="page-heading">
        <div>
          <h1>Settings</h1>
          <p>Manage your profile and notifications</p>
        </div>
      </div>

      <div className="settings-grid">
        <section className="panel settings-profile">
          <div className="panel-header">
            <div>
              <h2>Profile Information</h2>
              <p>Update your personal information</p>
            </div>
          </div>

          <div className="settings-avatar">
            <Avatar name={form.name} size="large" />

            <div>
              <strong>{form.name}</strong>
              <span>{form.role}</span>
            </div>
          </div>

          <div className="form-grid">
            <Field
              label="Full Name"
              value={form.name}
              onChange={(e) =>
                update("name", e.target.value)
              }
            />

            <Field
              label="Role"
              value={form.role}
              onChange={(e) =>
                update("role", e.target.value)
              }
            />

            <Field
              label="Email"
              value={form.email}
              type="email"
              onChange={(e) =>
                update("email", e.target.value)
              }
            />

            <Field
              label="Phone"
              value={form.phone}
              onChange={(e) =>
                update("phone", e.target.value)
              }
            />

            <Field
              label="Company"
              value={form.company}
              onChange={(e) =>
                update("company", e.target.value)
              }
            />

            <Field
              label="Location"
              value={form.location}
              onChange={(e) =>
                update("location", e.target.value)
              }
            />
          </div>

          <div className="settings-save">
            <Button onClick={saveProfile}>
              Save Changes
            </Button>
          </div>
        </section>

        <section className="panel">
          <div className="panel-header">
            <div>
              <h2>Notifications</h2>
              <p>Choose what notifications you receive</p>
            </div>
          </div>

          <div className="notification-settings">
            <NotificationToggle
              title="New Lead Notifications"
              text="Receive alerts when new leads are created."
              checked={notifications.newLead}
              onChange={() =>
                toggleNotification("newLead")
              }
            />

            <NotificationToggle
              title="Deal Updates"
              text="Receive notifications when deals change."
              checked={notifications.dealUpdate}
              onChange={() =>
                toggleNotification("dealUpdate")
              }
            />

            <NotificationToggle
              title="Activity Reminders"
              text="Get reminders for upcoming activities."
              checked={notifications.activityReminder}
              onChange={() =>
                toggleNotification(
                  "activityReminder"
                )
              }
            />

            <NotificationToggle
              title="Weekly Report"
              text="Receive your weekly sales report."
              checked={notifications.weeklyReport}
              onChange={() =>
                toggleNotification("weeklyReport")
              }
            />
          </div>
        </section>
      </div>
    </div>
  );
}

function NotificationToggle({
  title,
  text,
  checked,
  onChange,
}) {
  return (
    <div className="notification-setting">
      <div>
        <strong>{title}</strong>
        <span>{text}</span>
      </div>

      <button
        className={`switch ${checked ? "checked" : ""}`}
        onClick={onChange}
      >
        <span />
      </button>
    </div>
  );
}

/* =========================================================
   DETAIL VIEW
========================================================= */

function DetailsView({
  item,
  type,
  onClose,
}) {
  if (!item) return null;

  return (
    <Modal
      title={
        type === "lead"
          ? "Lead Details"
          : type === "contact"
          ? "Contact Details"
          : "Deal Details"
      }
      onClose={onClose}
      width="650px"
    >
      <div className="details-header">
        <Avatar
          name={
            item.name ||
            item.company ||
            item.contact ||
            "User"
          }
          size="large"
        />

        <div>
          <h3>{item.name || item.company}</h3>
          <span>{item.id}</span>
        </div>
      </div>

      <div className="details-grid">
        {Object.entries(item)
          .filter(
            ([key]) =>
              key !== "id" &&
              key !== "probability"
          )
          .map(([key, value]) => (
            <div className="detail-item" key={key}>
              <span>
                {key
                  .replace(/([A-Z])/g, " $1")
                  .replace(/^./, (char) =>
                    char.toUpperCase()
                  )}
              </span>

              <strong>
                {key.toLowerCase().includes("value")
                  ? money(value)
                  : key.toLowerCase().includes("date")
                  ? formatDate(value)
                  : String(value)}
              </strong>
            </div>
          ))}
      </div>

      {type === "deal" && (
        <div className="detail-probability">
          <div>
            <span>Probability</span>
            <strong>{item.probability}%</strong>
          </div>

          <div className="probability-track">
            <div
              style={{
                width: `${item.probability}%`,
              }}
            />
          </div>
        </div>
      )}

      <div className="modal-actions">
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      </div>
    </Modal>
  );
}

/* =========================================================
   ACTIVITY FORM
========================================================= */

function ActivityForm({
  onSave,
  onClose,
}) {
  const [form, setForm] = useState({
    type: "Call",
    title: "",
    contact: "",
    date: today(),
    time: "10:00",
    owner: "Saran Kumar",
    status: "Upcoming",
  });

  const [error, setError] = useState("");

  const update = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const submit = (e) => {
    e.preventDefault();

    if (!form.title.trim()) {
      setError("Activity title is required.");
      return;
    }

    onSave({
      ...form,
      id: uid("AC"),
    });
  };

  return (
    <form onSubmit={submit}>
      {error && <div className="form-error">{error}</div>}

      <div className="form-grid">
        <Field
          label="Type"
          value={form.type}
          options={[
            "Call",
            "Meeting",
            "Email",
            "Note",
          ]}
          onChange={(e) =>
            update("type", e.target.value)
          }
        />

        <Field
          label="Status"
          value={form.status}
          options={["Upcoming", "Completed"]}
          onChange={(e) =>
            update("status", e.target.value)
          }
        />

        <Field
          label="Activity Title"
          value={form.title}
          required
          onChange={(e) =>
            update("title", e.target.value)
          }
        />

        <Field
          label="Contact"
          value={form.contact}
          onChange={(e) =>
            update("contact", e.target.value)
          }
        />

        <Field
          label="Date"
          value={form.date}
          type="date"
          onChange={(e) =>
            update("date", e.target.value)
          }
        />

        <Field
          label="Time"
          value={form.time}
          type="time"
          onChange={(e) =>
            update("time", e.target.value)
          }
        />

        <Field
          label="Owner"
          value={form.owner}
          options={[
            "Saran Kumar",
            "Novitha",
            "Arun Kumar",
            "Priya",
            "Karthik",
          ]}
          onChange={(e) =>
            update("owner", e.target.value)
          }
        />
      </div>

      <div className="modal-actions">
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>

        <Button type="submit">
          Create Activity
        </Button>
      </div>
    </form>
  );
}

/* =========================================================
   MAIN APP
========================================================= */

export default function App() {
  const [activePage, setActivePage] =
    useState("dashboard");

  const [mobileOpen, setMobileOpen] =
    useState(false);

  const [leads, setLeads] = useState(() =>
    readStorage(STORAGE.leads, defaultLeads)
  );

  const [contacts, setContacts] = useState(() =>
    readStorage(STORAGE.contacts, defaultContacts)
  );

  const [deals, setDeals] = useState(() =>
    readStorage(STORAGE.deals, defaultDeals)
  );

  const [activities, setActivities] = useState(() =>
    readStorage(
      STORAGE.activities,
      defaultActivities
    )
  );

  const [profile, setProfile] = useState(() =>
    readStorage(STORAGE.profile, defaultProfile)
  );

  const [notifications, setNotifications] =
    useState(() =>
      readStorage(
        STORAGE.notifications,
        defaultNotifications
      )
    );

  const [modal, setModal] = useState(null);

  const [toast, setToast] = useState(null);

  const [deleteItem, setDeleteItem] =
    useState(null);

  const [viewItem, setViewItem] =
    useState(null);

  useEffect(() => {
    writeStorage(STORAGE.leads, leads);
  }, [leads]);

  useEffect(() => {
    writeStorage(STORAGE.contacts, contacts);
  }, [contacts]);

  useEffect(() => {
    writeStorage(STORAGE.deals, deals);
  }, [deals]);

  useEffect(() => {
    writeStorage(STORAGE.activities, activities);
  }, [activities]);

  useEffect(() => {
    writeStorage(STORAGE.profile, profile);
  }, [profile]);

  useEffect(() => {
    writeStorage(
      STORAGE.notifications,
      notifications
    );
  }, [notifications]);

  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(() => {
      setToast(null);
    }, 3200);

    return () => clearTimeout(timer);
  }, [toast]);

  const notify = (message, type = "success") => {
    setToast({
      message,
      type,
    });
  };

  const navigate = (page) => {
    setActivePage(page);
    setMobileOpen(false);
  };

  const getPageTitle = () => {
    const titles = {
      dashboard: [
        "Dashboard",
        "Welcome back, Saran. Here's your sales overview.",
      ],
      leads: [
        "Leads",
        "Manage and convert your sales leads.",
      ],
      contacts: [
        "Contacts",
        "Manage your customer relationships.",
      ],
      deals: [
        "Deals",
        "Track opportunities and revenue.",
      ],
      pipeline: [
        "Sales Pipeline",
        "Manage deals across every pipeline stage.",
      ],
      activities: [
        "Activities",
        "Stay on top of your sales activities.",
      ],
      analytics: [
        "Analytics",
        "Understand your sales performance.",
      ],
      settings: [
        "Settings",
        "Manage your profile and preferences.",
      ],
    };

    return titles[activePage] || titles.dashboard;
  };

  const [title, subtitle] = getPageTitle();

  /* =======================================================
     MODAL HANDLERS
  ======================================================= */

  const openAddLead = () =>
    setModal({
      type: "lead",
      mode: "add",
    });

  const openEditLead = (lead) =>
    setModal({
      type: "lead",
      mode: "edit",
      data: lead,
    });

  const saveLead = (lead) => {
    setLeads((prev) => {
      const exists = prev.some(
        (item) => item.id === lead.id
      );

      if (exists) {
        return prev.map((item) =>
          item.id === lead.id ? lead : item
        );
      }

      return [lead, ...prev];
    });

    setModal(null);

    notify(
      lead.createdAt && leads.some(
        (item) => item.id === lead.id
      )
        ? "Lead updated successfully."
        : "Lead created successfully."
    );
  };

  const openAddContact = () =>
    setModal({
      type: "contact",
      mode: "add",
    });

  const openEditContact = (contact) =>
    setModal({
      type: "contact",
      mode: "edit",
      data: contact,
    });

  const saveContact = (contact) => {
    setContacts((prev) => {
      const exists = prev.some(
        (item) => item.id === contact.id
      );

      if (exists) {
        return prev.map((item) =>
          item.id === contact.id ? contact : item
        );
      }

      return [contact, ...prev];
    });

    setModal(null);

    notify(
      contacts.some(
        (item) => item.id === contact.id
      )
        ? "Contact updated successfully."
        : "Contact created successfully."
    );
  };

  const openAddDeal = () =>
    setModal({
      type: "deal",
      mode: "add",
    });

  const openEditDeal = (deal) =>
    setModal({
      type: "deal",
      mode: "edit",
      data: deal,
    });

  const saveDeal = (deal) => {
    setDeals((prev) => {
      const exists = prev.some(
        (item) => item.id === deal.id
      );

      if (exists) {
        return prev.map((item) =>
          item.id === deal.id ? deal : item
        );
      }

      return [deal, ...prev];
    });

    setModal(null);

    notify(
      deals.some((item) => item.id === deal.id)
        ? "Deal updated successfully."
        : "Deal created successfully."
    );
  };

  const saveActivity = (activity) => {
    setActivities((prev) => [
      activity,
      ...prev,
    ]);

    setModal(null);

    notify("Activity created successfully.");
  };

  /* =======================================================
     DELETE
  ======================================================= */

  const requestDelete = (item, type) => {
    setDeleteItem({
      item,
      type,
    });
  };

  const confirmDelete = () => {
    if (!deleteItem) return;

    const { item, type } = deleteItem;

    if (type === "lead") {
      setLeads((prev) =>
        prev.filter((lead) => lead.id !== item.id)
      );
    }

    if (type === "contact") {
      setContacts((prev) =>
        prev.filter(
          (contact) => contact.id !== item.id
        )
      );
    }

    if (type === "deal") {
      setDeals((prev) =>
        prev.filter((deal) => deal.id !== item.id)
      );
    }

    setDeleteItem(null);

    notify(
      `${item.name || item.company} deleted successfully.`
    );
  };

  /* =======================================================
     RENDER PAGE
  ======================================================= */

  const renderPage = () => {
    switch (activePage) {
      case "leads":
        return (
          <LeadsPage
            leads={leads}
            navigate={navigate}
            onAdd={openAddLead}
            onEdit={openEditLead}
            onDelete={(lead) =>
              requestDelete(lead, "lead")
            }
            onView={(lead) =>
              setViewItem({
                item: lead,
                type: "lead",
              })
            }
          />
        );

      case "contacts":
        return (
          <ContactsPage
            contacts={contacts}
            onAdd={openAddContact}
            onEdit={openEditContact}
            onDelete={(contact) =>
              requestDelete(contact, "contact")
            }
            onView={(contact) =>
              setViewItem({
                item: contact,
                type: "contact",
              })
            }
          />
        );

      case "deals":
        return (
          <DealsPage
            deals={deals}
            onAdd={openAddDeal}
            onEdit={openEditDeal}
            onDelete={(deal) =>
              requestDelete(deal, "deal")
            }
            onView={(deal) =>
              setViewItem({
                item: deal,
                type: "deal",
              })
            }
          />
        );

      case "pipeline":
        return (
          <PipelinePage
            deals={deals}
            setDeals={setDeals}
            onAdd={openAddDeal}
            onEdit={openEditDeal}
            onDelete={(deal) =>
              requestDelete(deal, "deal")
            }
            onView={(deal) =>
              setViewItem({
                item: deal,
                type: "deal",
              })
            }
            setToast={setToast}
          />
        );

      case "activities":
        return (
          <ActivitiesPage
            activities={activities}
            onAdd={() =>
              setModal({
                type: "activity",
                mode: "add",
              })
            }
          />
        );

      case "analytics":
        return (
          <AnalyticsPage
            leads={leads}
            deals={deals}
          />
        );

      case "settings":
        return (
          <SettingsPage
            profile={profile}
            setProfile={setProfile}
            notifications={notifications}
            setNotifications={setNotifications}
            setToast={setToast}
          />
        );

      case "dashboard":
      default:
        return (
          <Dashboard
            leads={leads}
            deals={deals}
            contacts={contacts}
            activities={activities}
            navigate={navigate}
          />
        );
    }
  };

  return (
    <div className="app-shell">
      <Sidebar
        activePage={activePage}
        navigate={navigate}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        leadCount={leads.length}
        profile={profile}
      />

      <main className="main-content">
        <Topbar
          title={title}
          subtitle={subtitle}
          onMenu={() => setMobileOpen(true)}
          onProfile={() => navigate("settings")}
          profile={profile}
          notificationCount={
            Object.values(notifications).filter(Boolean)
              .length
          }
        />

        {renderPage()}
      </main>

      {/* ===================================================
          LEAD MODAL
      =================================================== */}

      {modal?.type === "lead" && (
        <Modal
          title={
            modal.mode === "edit"
              ? "Edit Lead"
              : "Create New Lead"
          }
          onClose={() => setModal(null)}
        >
          <LeadForm
            lead={modal.data}
            onSave={saveLead}
            onClose={() => setModal(null)}
          />
        </Modal>
      )}

      {/* ===================================================
          CONTACT MODAL
      =================================================== */}

      {modal?.type === "contact" && (
        <Modal
          title={
            modal.mode === "edit"
              ? "Edit Contact"
              : "Create New Contact"
          }
          onClose={() => setModal(null)}
        >
          <ContactForm
            contact={modal.data}
            onSave={saveContact}
            onClose={() => setModal(null)}
          />
        </Modal>
      )}

      {/* ===================================================
          DEAL MODAL
      =================================================== */}

      {modal?.type === "deal" && (
        <Modal
          title={
            modal.mode === "edit"
              ? "Edit Deal"
              : "Create New Deal"
          }
          onClose={() => setModal(null)}
        >
          <DealForm
            deal={modal.data}
            onSave={saveDeal}
            onClose={() => setModal(null)}
          />
        </Modal>
      )}

      {/* ===================================================
          ACTIVITY MODAL
      =================================================== */}

      {modal?.type === "activity" && (
        <Modal
          title="Create New Activity"
          onClose={() => setModal(null)}
        >
          <ActivityForm
            onSave={saveActivity}
            onClose={() => setModal(null)}
          />
        </Modal>
      )}

      {/* ===================================================
          DELETE MODAL
      =================================================== */}

      {deleteItem && (
        <ConfirmModal
          title="Delete Record"
          message={`Are you sure you want to delete "${
            deleteItem.item.name ||
            deleteItem.item.company
          }"? This action cannot be undone.`}
          onCancel={() => setDeleteItem(null)}
          onConfirm={confirmDelete}
        />
      )}

      {/* ===================================================
          VIEW MODAL
      =================================================== */}

      {viewItem && (
        <DetailsView
          item={viewItem.item}
          type={viewItem.type}
          onClose={() => setViewItem(null)}
        />
      )}

      <Toast toast={toast} />
    </div>
  );
}
