const { useEffect, useMemo, useState } = React;

const employees = [
  { name: "Maya Chen", role: "Product designer", team: "Design", salary: "$8,420", status: "Paid", initials: "MC", color: "peach" },
  { name: "Jon Bell", role: "Senior engineer", team: "Engineering", salary: "$11,250", status: "Paid", initials: "JB", color: "mint" },
  { name: "Amina Yusuf", role: "Operations lead", team: "Operations", salary: "$7,840", status: "Processing", initials: "AY", color: "lavender" },
  { name: "Rory McKay", role: "Marketing manager", team: "Growth", salary: "$6,915", status: "Paid", initials: "RM", color: "blue" },
  { name: "Samira Patel", role: "People partner", team: "People", salary: "$7,680", status: "Review", initials: "SP", color: "yellow" },
];

const navItems = [
  ["Overview", "layout-dashboard"],
  ["Employees", "users"],
  ["Pay runs", "banknote"],
  ["Benefits", "heart-handshake"],
  ["Reports", "chart-no-axes-combined"],
];

function Icon({ name, size = 18 }) {
  return <i data-lucide={name} width={size} height={size} aria-hidden="true" />;
}

function App() {
  const [active, setActive] = useState("Overview");
  const [query, setQuery] = useState("");
  const [period, setPeriod] = useState("This month");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    if (window.lucide) window.lucide.createIcons();
  });

  const visibleEmployees = useMemo(() => employees.filter((employee) =>
    `${employee.name} ${employee.role} ${employee.team}`.toLowerCase().includes(query.toLowerCase())
  ), [query]);

  const announce = (message) => {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 2600);
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand"><span className="brand-mark"><Icon name="layers-3" size={17} /></span><span>ledgerly</span></div>
        <div className="workspace-switcher"><span className="workspace-avatar">AC</span><span><strong>Acme Co.</strong><small>Workspace</small></span><Icon name="chevrons-up-down" size={15} /></div>
        <nav className="main-nav" aria-label="Main navigation">
          <p className="nav-label">Workspace</p>
          {navItems.map(([label, icon]) => <button key={label} className={`nav-item ${active === label ? "active" : ""}`} onClick={() => setActive(label)}><Icon name={icon} size={17} /><span>{label}</span>{label === "Pay runs" && <em>2</em>}</button>)}
          <p className="nav-label second">Manage</p>
          <button className="nav-item" onClick={() => announce("Settings are ready for your workspace.")}><Icon name="settings-2" size={17} /><span>Settings</span></button>
          <button className="nav-item" onClick={() => announce("Help center opened.")}><Icon name="circle-help" size={17} /><span>Help center</span></button>
        </nav>
        <div className="sidebar-footer"><div className="upgrade-card"><span className="sparkle">✦</span><strong>Make payroll feel lighter</strong><p>Automate your next pay run with Ledgerly Pro.</p><button onClick={() => announce("Upgrade flow started.")}>Explore Pro <Icon name="arrow-up-right" size={14} /></button></div><button className="profile"><span className="profile-avatar">JD</span><span><strong>Jordan Davis</strong><small>Administrator</small></span><Icon name="more-horizontal" size={17} /></button></div>
      </aside>

      <main className="content">
        <header className="topbar"><button className="mobile-menu" onClick={() => announce("Use the sidebar navigation on desktop.")}><Icon name="menu" /></button><div className="breadcrumb"><span>Workspace</span><Icon name="chevron-right" size={14} /><strong>{active}</strong></div><div className="top-actions"><button className="icon-button" aria-label="Search" onClick={() => document.querySelector(".search-input").focus()}><Icon name="search" size={18} /></button><button className="icon-button notification" aria-label="Notifications" onClick={() => announce("You are all caught up.")}><Icon name="bell" size={18} /><span /></button><button className="help-button" onClick={() => announce("Help center opened.")}><Icon name="circle-help" size={17} /> <span>Help</span></button></div></header>

        <section className="page-heading"><div><p className="eyebrow">Tuesday, September 22, 2026</p><h1>Good morning, Jordan <span>✦</span></h1><p className="heading-copy">Here is what is happening across your workspace today.</p></div><button className="primary-button" onClick={() => announce("New pay run created as a draft.")}><Icon name="plus" size={17} /> New pay run</button></section>

        <section className="metric-grid" aria-label="Payroll summary"><div className="metric-card featured"><div className="metric-top"><span>Total payroll</span><button onClick={() => announce("Payroll details opened.")}><Icon name="arrow-up-right" size={16} /></button></div><strong>$184,920<span>.00</span></strong><div className="metric-foot"><span className="trend positive"><Icon name="trending-up" size={14} /> 8.2%</span><small>vs. last month</small></div><div className="bar-chart">{[35, 48, 43, 62, 57, 68, 58, 78, 72, 91, 76, 88].map((height, i) => <i key={i} style={{ height: `${height}%` }} />)}</div></div><div className="metric-card"><div className="metric-top"><span>Active employees</span><button onClick={() => setActive("Employees")}><Icon name="arrow-up-right" size={16} /></button></div><strong>48</strong><div className="metric-foot"><span className="trend positive"><Icon name="trending-up" size={14} /> 4.3%</span><small>vs. last month</small></div><div className="avatar-stack"><span className="avatar mint">MC</span><span className="avatar peach">JB</span><span className="avatar lavender">AY</span><span className="avatar more">+45</span></div></div><div className="metric-card"><div className="metric-top"><span>Next pay day</span><button onClick={() => setActive("Pay runs")}><Icon name="arrow-up-right" size={16} /></button></div><strong>Sep 30</strong><div className="metric-foot"><span className="trend neutral"><Icon name="calendar-days" size={14} /> 8 days</span><small>remaining</small></div><div className="progress-wrap"><div className="progress-label"><span>Pay period</span><strong>72%</strong></div><div className="progress"><i /></div></div></div></section>

        <section className="dashboard-grid"><div className="panel pay-runs"><div className="panel-heading"><div><h2>Recent pay runs</h2><p>Keep an eye on your team's payroll activity.</p></div><button className="text-button" onClick={() => setActive("Pay runs")}>View all <Icon name="arrow-up-right" size={15} /></button></div><div className="run-list"><div className="run-row run-head"><span>PAY PERIOD</span><span>EMPLOYEES</span><span>NET PAY</span><span>STATUS</span><span /></div>{[["Sep 01 — Sep 15", "48 employees", "$92,460.00", "Paid", "check"], ["Aug 16 — Aug 31", "47 employees", "$91,180.00", "Paid", "check"], ["Aug 01 — Aug 15", "46 employees", "$88,740.00", "Paid", "check"], ["Jul 16 — Jul 31", "45 employees", "$87,250.00", "Draft", "file-edit"]].map(([date, count, amount, status, icon]) => <div className="run-row" key={date}><span className="period"><strong>{date}</strong><small>2026</small></span><span>{count}</span><strong>{amount}</strong><span className={`status ${status.toLowerCase()}`}><Icon name={icon} size={13} /> {status}</span><button className="row-action" aria-label={`Open ${date}`} onClick={() => announce(`${date} opened.`)}><Icon name="more-horizontal" size={18} /></button></div>)}</div></div><div className="panel activity"><div className="panel-heading"><div><h2>Activity</h2><p>Latest updates from your workspace.</p></div><button className="icon-button soft" onClick={() => announce("Activity refreshed.")}><Icon name="refresh-cw" size={16} /></button></div><div className="activity-list">{[["Amina Yusuf", "approved a time off request", "12 min ago", "AY", "lavender"], ["Jordan Davis", "updated the benefits policy", "1 hr ago", "JD", "yellow"], ["System", "pay run completed successfully", "3 hrs ago", "✦", "system"]].map(([name, action, time, initials, color]) => <div className="activity-item" key={name + action}><span className={`activity-avatar ${color}`}>{initials}</span><p><strong>{name}</strong> {action}<small>{time}</small></p></div>)}</div><button className="activity-link" onClick={() => announce("Showing all activity.")}>See all activity <Icon name="arrow-right" size={15} /></button></div></section>

        <section className="panel employee-panel"><div className="panel-heading"><div><h2>Team overview</h2><p>People and their current payroll status.</p></div><div className="panel-tools"><div className="search-box"><Icon name="search" size={16} /><input className="search-input" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search employees" /></div><select value={period} onChange={(event) => setPeriod(event.target.value)} aria-label="Select period"><option>This month</option><option>Last month</option><option>Year to date</option></select></div></div><div className="employee-table"><div className="employee-row employee-head"><span>EMPLOYEE</span><span>TEAM</span><span>MONTHLY SALARY</span><span>STATUS</span><span /></div>{visibleEmployees.map((employee) => <div className="employee-row" key={employee.name}><span className="employee-name"><span className={`avatar ${employee.color}`}>{employee.initials}</span><span><strong>{employee.name}</strong><small>{employee.role}</small></span></span><span>{employee.team}</span><strong>{employee.salary}</strong><span className={`status ${employee.status.toLowerCase()}`}><Icon name={employee.status === "Paid" ? "check" : employee.status === "Review" ? "eye" : "clock-3"} size={13} /> {employee.status}</span><button className="row-action" aria-label={`Open ${employee.name}`} onClick={() => announce(`${employee.name}'s profile opened.`)}><Icon name="more-horizontal" size={18} /></button></div>)}</div>{visibleEmployees.length === 0 && <div className="empty-state">No employees match “{query}”.</div>}</section>
        <footer className="footer"><span>Ledgerly · Payroll, made human.</span><span><a href="#privacy">Privacy</a><a href="#terms">Terms</a><span className="status-dot"><i /> All systems operational</span></span></footer>
      </main>
      {notice && <div className="toast"><Icon name="check-circle-2" size={17} /> {notice}</div>}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
