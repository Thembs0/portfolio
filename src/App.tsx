import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Link, Route, Routes, useNavigate, useParams } from "react-router-dom";
import { ArrowDownRight, ArrowLeft, ArrowRight, ArrowUpRight, Check, ChevronDown, Code2, ExternalLink, Github, Layers3, Menu, MessageSquare, MonitorCog, Plus, Send, ShieldCheck, Smartphone, X, Upload, Save, Trash2, GraduationCap, BadgeCheck } from "lucide-react";
import { hasSupabase, supabase } from "./lib/supabase";
import { starterProjects, services as fallbackServices, type Project, type Service, type Skill, type Credential, type Profile } from "./lib/types";
import { useServices, useSkills, useCredentials, useProfile } from "./lib/content";

const skills = ["PHP", "Laravel", "CodeIgniter", "JavaScript", "TypeScript", "React", "Node.js", "Swift", "SwiftUI", "MySQL", "MongoDB", "REST APIs", "Git & GitHub", "Docker", "AWS / Azure / Google Cloud", "Cybersecurity", "Networking"];

function useProjects() {
  const [projects, setProjects] = useState<Project[]>(starterProjects.filter(p => p.published));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!hasSupabase) return;
    setLoading(true);
    supabase
      .from("projects")
      .select("*")
      .eq("published", true)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data) setProjects(data as Project[]);
        setLoading(false);
      });
  }, []);

  return { projects, loading };
}

function Header() {
  const [open, setOpen] = useState(false);
  const profile = useProfile();
  return <header className="site-header"><div className="container nav-wrap">
    <Link className="wordmark" to="/" onClick={() => setOpen(false)}><span className="monogram">{profile.short_name}</span><span>{profile.full_name.toUpperCase()}<small>{profile.role_line}</small></span></Link>
    <button className="mobile-menu icon-button" aria-label="Toggle menu" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
    <nav className={open ? "nav-links nav-open" : "nav-links"}>
      <a href="/#work" onClick={() => setOpen(false)}>Work</a><a href="/#services" onClick={() => setOpen(false)}>Services</a><a href="/#about" onClick={() => setOpen(false)}>About</a><a href="/#contact" onClick={() => setOpen(false)}>Contact</a>
      <Link className="nav-cta" to="/book" onClick={() => setOpen(false)}>Book a consultation <ArrowUpRight size={15}/></Link>
    </nav>
  </div></header>;
}

function Footer() {
  const profile = useProfile();
  return <footer className="footer"><div className="container footer-inner"><Link className="wordmark" to="/"><span className="monogram">{profile.short_name}</span><span>{profile.full_name.toUpperCase()}<small>INDEPENDENT DEVELOPER & IT SPECIALIST</small></span></Link><p>{profile.footer_tagline}</p><a href={`mailto:${profile.email}`}>Email me <ArrowUpRight size={14}/></a></div><div className="container footer-bottom"><span>© {new Date().getFullYear()} {profile.full_name}</span><Link to="/admin">Admin access</Link><span>{profile.footer_note}</span></div></footer>;
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  return <Link to={`/work/${project.slug}`} className="project-card">
    <div className={`project-art art-${index % 3}`}>
      {project.cover_image ? <img src={project.cover_image} alt={`${project.title} preview`} /> :
        <div className="art-placeholder"><span className="art-index">0{index + 1} / SELECTED WORK</span><div className="art-symbol">{index % 3 === 0 ? <Code2 /> : index % 3 === 1 ? <Layers3 /> : <MonitorCog />}</div><span className="art-label">{project.category || "DIGITAL PRODUCT"}</span></div>}
      <span className="project-arrow"><ArrowUpRight size={19}/></span>
    </div>
    <div className="project-meta"><div><span className="eyebrow">{project.category || "PROJECT"}</span><h3>{project.title}</h3><p>{project.summary}</p></div><span className="text-link">Explore <ArrowRight size={15}/></span></div>
    <div className="tag-row">{(project.technologies || []).slice(0, 4).map(t => <span className="tag" key={t}>{t}</span>)}</div>
  </Link>;
}

function Home() {
  const { projects, loading } = useProjects();
  const services = useServices();
  const skills = useSkills();
  const credentials = useCredentials();
  const profile = useProfile();
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  // Split hero heading on the last word so the emphasis word stays italic.
  const heroWords = profile.hero_heading.trim().split(" ");
  const heroLast = heroWords.pop() || "";
  const heroHead = heroWords.join(" ");

  const educations = credentials.filter(c => c.kind === "education");
  const certifications = credentials.filter(c => c.kind === "certification" || c.kind === "award" || c.kind === "course");

  async function contact(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); const form = e.currentTarget; setError(""); setBusy(true);
    const f = new FormData(form);
    const payload = { name: String(f.get("name")), email: String(f.get("email")), subject: String(f.get("subject") || "Portfolio enquiry"), message: String(f.get("message")), status: "new" };
    if (!hasSupabase) { setError("Contact forms are not connected yet. Add your Supabase settings to enable message delivery."); setBusy(false); return; }
    const { error: dbError } = await supabase.from("messages").insert(payload);
    setBusy(false);
    if (dbError) setError("Your message could not be sent. Please try again in a moment.");
    else { setSent(true); form.reset(); }
  }

  return <><Header/><main>
    <section className="hero"><div className="container hero-grid"><div className="hero-copy"><div className="availability"><span className="status-dot"/> {profile.availability} <span className="availability-line"/></div><p className="hero-kicker">{profile.hero_kicker}</p><h1>{heroHead}<br/><em>{heroLast}</em></h1><p className="hero-intro">{profile.hero_intro}</p><div className="hero-actions"><a className="button button-light" href="#work">Explore my work <ArrowDownRight size={17}/></a><Link className="button button-outline" to="/book">Let’s work together <ArrowUpRight size={16}/></Link></div><div className="hero-proof"><div><strong>6+</strong><span>Years in IT</span></div><i/><div><strong>100+</strong><span>Educators trained</span></div><i/><div><strong>Full cycle</strong><span>Build to support</span></div></div></div>
    <div className="hero-aside"><div className="hero-index">PORTFOLIO / {new Date().getFullYear()}</div><div className="hero-graphic">{profile.photo_url ? <img src={profile.photo_url} alt={profile.full_name} className="hero-photo"/> : <><div className="graphic-cross">+</div><div className="graphic-ring ring-one"/><div className="graphic-ring ring-two"/><div className="graphic-core"><span>{profile.short_name}</span><small>DEV / SYSTEMS</small></div><div className="graphic-label label-a">01 - DESIGN</div><div className="graphic-label label-b">02 - ENGINEER</div><div className="graphic-label label-c">03 - DELIVER</div></>}</div><div className="aside-note"><span>01 / 04</span><p>Curiosity is the start.<br/>Clarity is the craft.</p></div></div></div><div className="hero-bottom container"><span>JOHANNESBURG, SOUTH AFRICA</span><span>SOFTWARE / SYSTEMS / SUPPORT</span><a href="#work">SCROLL TO EXPLORE ↓</a></div></section>
    <section className="section work-section" id="work"><div className="container"><div className="section-heading"><div><span className="eyebrow">01 - SELECTED WORK</span><h2>Proof over promises.</h2></div><p>A closer look at the products, systems and experiments I’ve worked on. Each project tells its own story.</p></div>
      {!hasSupabase && <div className="setup-note"><span className="note-mark">i</span><span>Portfolio preview mode. Connect Supabase and publish projects in the admin panel to make your real project gallery live.</span></div>}
      {loading ? <p className="muted">Loading projects…</p> : projects.length ? <div className="project-grid">{projects.map((p, i) => <ProjectCard key={p.id} project={p} index={i}/>)}</div> : <div className="empty-work"><span className="empty-number">01-</span><div><h3>The next project belongs here.</h3><p>Published work will appear here with its screenshots, build notes and repository links.</p></div><Link to="/admin" className="text-link">Manage projects <ArrowUpRight size={15}/></Link></div>}
      <div className="work-foot"><span>MORE WORK WILL BE ADDED AS IT’S READY TO SHOW.</span><Link to="/admin">Add a project <Plus size={14}/></Link></div></div></section>
    <section className="section services-section" id="services"><div className="container"><div className="section-heading"><div><span className="eyebrow">02 - WHAT I DO</span><h2>Technology, made useful.</h2></div><p>From the first technical conversation to the final deployment, I focus on dependable solutions that make sense for the people using them.</p></div><div className="services-grid">{services.map((s, i) => <article className="service-card" key={s.id || s.title}><span className="service-number">0{i + 1}</span><h3>{s.title}</h3><p>{s.description}</p><ul>{s.items.map(item => <li key={item}><Check size={13}/>{item}</li>)}</ul></article>)}</div></div></section>
    <section className="section about-section" id="about"><div className="container about-grid"><div className="about-title"><span className="eyebrow">03 - THE APPROACH</span><h2>Technical depth.<br/><em>Human clarity.</em></h2>{profile.photo_url ? <img className="about-photo" src={profile.photo_url} alt={profile.full_name}/> : <div className="about-mark">{profile.short_name}<span>®</span></div>}</div><div className="about-content"><p className="about-lead">{profile.about_lead}</p><p>{profile.about_body}</p><p>{profile.about_extra}</p><div className="credential-row">
      {educations.slice(0,1).map(c => <div key={c.id}><span>EDUCATION</span><strong>{c.title}</strong><small>{c.institution}{c.detail ? ` · ${c.detail}` : ""}</small></div>)}
      {certifications.slice(0,1).map(c => <div key={c.id}><span>CERTIFICATION</span><strong>{c.title}</strong><small>{c.institution}{c.detail ? ` · ${c.detail}` : ""}</small></div>)}
    </div>{educations.length + certifications.length > 2 && <div className="credential-list">{credentials.slice(2).map(c => <div key={c.id} className="credential-row-item"><span>{c.kind.toUpperCase()}</span><strong>{c.title}</strong><small>{c.institution}{c.detail ? ` · ${c.detail}` : ""}</small></div>)}</div>}<a className="inline-link" href={profile.cv_url || "/Thembinkosi-Ndlovu-CV.pdf"} download>See my Resume <ArrowDownRight size={16}/></a>{!profile.cv_url && <p className="small-print">Upload a CV from the admin Profile tab to replace the placeholder link.</p>}</div></div></section>
    <section className="section skills-section"><div className="container"><div className="section-heading"><div><span className="eyebrow">04 - TOOLKIT</span><h2>Built across the stack.</h2></div><p>A practical mix of development, infrastructure and delivery skills. Tools are chosen for the problem, not the trend.</p></div><div className="skills-list">{skills.map((s, i) => <span key={s.id}><small>{String(i + 1).padStart(2, "0")}</small>{s.name}</span>)}</div></div></section>
    <section className="section contact-section" id="contact"><div className="container contact-grid"><div><span className="eyebrow">05 - START A CONVERSATION</span><h2>Have a problem<br/>worth <em>solving?</em></h2><p>Tell me what you’re working on, what’s not working, or what you’d like to build. I’ll get back to you by email.</p><div className="contact-details"><a href={`mailto:${profile.email}`}>{profile.email} <ArrowUpRight size={15}/></a><span>{profile.location}</span></div></div><form className="contact-form" onSubmit={contact}><div className="form-top"><span>PROJECT ENQUIRY / 01</span><MessageSquare size={18}/></div>{sent ? <div className="success-panel"><Check/><h3>Message received.</h3><p>Thanks for reaching out. I’ll review your message and follow up by email.</p><button type="button" className="text-link" onClick={() => setSent(false)}>Send another message</button></div> : <><label>Your name<input required name="name" placeholder="How should I address you?" maxLength={100}/></label><label>Email address<input required type="email" name="email" placeholder="you@company.com" maxLength={200}/></label><label>What’s this about?<select name="subject" defaultValue="Project enquiry"><option>Project enquiry</option><option>Web development</option><option>Mobile development</option><option>IT consulting</option><option>Hardware diagnostics</option><option>Training or mentoring</option><option>Other</option></select></label><label>Tell me a little about it<textarea required name="message" rows={4} placeholder="A few details about your idea, challenge or timeline…" maxLength={5000}/></label>{error && <p className="form-error">{error}</p>}<button className="button button-light submit-button" disabled={busy}>{busy ? "Sending…" : "Send enquiry"} <Send size={15}/></button><small className="privacy-note">Your details are used only to respond to this enquiry.</small></>}</form></div></section>
    <section className="closing-band"><div className="container closing-inner"><span>THE RIGHT NEXT STEP STARTS WITH A CONVERSATION.</span><Link to="/book">Book a consultation <ArrowUpRight size={17}/></Link></div></section>
  </main><Footer/></>;
}

function ProjectDetail() {
  const { slug } = useParams();
  const { projects } = useProjects();
  const project = projects.find(p => p.slug === slug);
  if (!project) return <><Header/><main className="not-found container"><span className="eyebrow">PROJECT NOT FOUND</span><h1>This project isn’t published yet.</h1><p>It may be private, still in progress, or the link may have changed.</p><Link className="button button-light" to="/#work"><ArrowLeft size={16}/> Back to work</Link></main><Footer/></>;
  const images = [project.cover_image, ...(project.gallery || [])].filter(Boolean) as string[];
  return <><Header/><main className="detail-page"><div className="container"><Link className="back-link" to="/#work"><ArrowLeft size={15}/> All projects</Link><div className="detail-heading"><div><span className="eyebrow">{project.category} / PROJECT DETAIL</span><h1>{project.title}<span>.</span></h1><p>{project.summary}</p></div><div className="detail-actions">{project.github_url && <a className="button button-outline" href={project.github_url} target="_blank" rel="noreferrer"><Github size={16}/> View source <ExternalLink size={13}/></a>}{project.live_url && <a className="button button-light" href={project.live_url} target="_blank" rel="noreferrer">Live project <ArrowUpRight size={15}/></a>}</div></div>
    <div className="detail-cover">{images[0] ? <img src={images[0]} alt={`${project.title} screenshot`}/> : <div className="detail-empty"><Layers3 size={45}/><span>PROJECT VISUALS</span><small>Screenshots will appear here once added in the admin panel.</small></div>}</div>
    <div className="detail-body"><div className="detail-description"><span className="eyebrow">THE PROJECT</span><h2>Designed around a real need.</h2><p>{project.description}</p><div className="detail-gallery">{images.slice(1).map((src, i) => <figure key={src}><img src={src} alt={`${project.title} screenshot ${i + 2}`}/><figcaption>FIG. {String(i + 2).padStart(2, "0")} / {project.title}</figcaption></figure>)}</div></div><aside className="project-facts"><div><span>MY ROLE</span><strong>{project.role || "Development"}</strong></div><div><span>TYPE</span><strong>{project.category}</strong></div><div><span>TECHNOLOGIES</span><div className="tag-row">{project.technologies?.map(t => <span className="tag" key={t}>{t}</span>)}</div></div><div><span>PROJECT LINKS</span>{project.github_url ? <a href={project.github_url} target="_blank" rel="noreferrer">GitHub repository <ArrowUpRight size={14}/></a> : <small>Repository link not provided</small>}{project.live_url && <a href={project.live_url} target="_blank" rel="noreferrer">Live website <ArrowUpRight size={14}/></a>}</div></aside></div><div className="detail-next"><span>HAVE A PROJECT IN MIND?</span><Link to="/book">Let’s discuss it <ArrowUpRight size={17}/></Link></div></div></main><Footer/></>;
}

function Booking() {
  const services = useServices();
  const profile = useProfile();
  const [sent, setSent] = useState(false); const [error, setError] = useState(""); const [busy, setBusy] = useState(false);
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); const form = e.currentTarget; setError(""); setBusy(true); const f = new FormData(form);
    const payload = { name: String(f.get("name")), email: String(f.get("email")), organisation: String(f.get("organisation") || ""), service: String(f.get("service")), preferred_date: String(f.get("date") || "") || null, preferred_time: String(f.get("time") || "") || null, details: String(f.get("details") || ""), status: "new" };
    if (!hasSupabase) { setError("Booking is not connected yet. Complete the Supabase setup in SETUP.md."); setBusy(false); return; }
    const { error: dbError } = await supabase.from("bookings").insert(payload); setBusy(false);
    if (dbError) setError("Your booking request could not be submitted. Please try again."); else { setSent(true); form.reset(); }
  }
  return <><Header/><main className="form-page"><div className="container booking-grid"><div className="booking-intro"><Link to="/" className="back-link"><ArrowLeft size={15}/> Back to portfolio</Link><span className="eyebrow">LET’S MAKE A PLAN</span><h1>Book a<br/><em>conversation.</em></h1><p>Share a little about what you need. This is a request for a conversation, not an automatically confirmed appointment. I’ll follow up to agree on a time.</p><div className="booking-note"><ShieldCheck size={19}/><div><strong>Clear expectations, no pressure.</strong><span>Your information stays private and is used to respond to your request.</span></div></div><div className="booking-contact"><span>Prefer email?</span><a href={`mailto:${profile.email}`}>{profile.email} <ArrowUpRight size={14}/></a></div></div><form className="booking-form" onSubmit={submit}><div className="form-top"><span>CONSULTATION REQUEST / 01</span><span>~ 3 MIN</span></div>{sent ? <div className="success-panel"><Check/><h3>Request received.</h3><p>Thanks. Your preferred time is a request rather than a confirmed booking. I’ll contact you to coordinate the next step.</p><Link className="text-link" to="/">Return to portfolio <ArrowRight size={15}/></Link></div> : <><div className="form-two"><label>Your name<input required name="name" maxLength={100} placeholder="Full name"/></label><label>Email address<input required type="email" name="email" maxLength={200} placeholder="you@example.com"/></label></div><label>Company or organisation <span className="optional">(optional)</span><input name="organisation" maxLength={150} placeholder="Your business, if relevant"/></label><label>What can I help with?<select name="service" required defaultValue=""><option value="" disabled>Select a service</option>{services.map(s => <option key={s.id || s.title}>{s.title}</option>)}<option>Something else</option></select></label><div className="form-two"><label>Preferred date <span className="optional">(optional)</span><input name="date" type="date" min={new Date().toISOString().slice(0,10)}/></label><label>Preferred time <span className="optional">(optional)</span><select name="time" defaultValue=""><option value="">Flexible</option><option>Morning (09:00–12:00)</option><option>Afternoon (12:00–16:00)</option><option>Late afternoon (16:00–18:00)</option></select></label></div><label>What should I know? <span className="optional">(optional)</span><textarea name="details" rows={5} maxLength={4000} placeholder="Goals, context, constraints or questions…"/></label>{error && <p className="form-error">{error}</p>}<button className="button button-light submit-button" disabled={busy}>{busy ? "Submitting…" : "Request a consultation"} <ArrowUpRight size={16}/></button><small className="privacy-note">I’ll confirm availability by email. No appointment is booked until we agree.</small></>}</form></div></main><Footer/></>;
}

type AdminProjectForm = Omit<Project, "id" | "created_at">;
const blankProject: AdminProjectForm = { title:"", slug:"", summary:"", description:"", role:"", technologies:[], category:"Web application", github_url:"", live_url:"", cover_image:"", gallery:[], featured:false, published:false };

type AdminServiceForm = { id?: string; title: string; description: string; items: string[]; sort_order: number; published: boolean };
const blankService: AdminServiceForm = { title:"", description:"", items:[], sort_order: 0, published: true };

type AdminSkillForm = { id?: string; name: string; category: string; sort_order: number; published: boolean };
const blankSkill: AdminSkillForm = { name:"", category:"General", sort_order: 0, published: true };

type AdminCredentialForm = { id?: string; kind: Credential["kind"]; title: string; institution: string; detail: string; sort_order: number; published: boolean };
const blankCredential: AdminCredentialForm = { kind:"education", title:"", institution:"", detail:"", sort_order:0, published:true };

type AdminTab = "projects" | "services" | "skills" | "credentials" | "profile" | "messages" | "bookings";

function Admin() {
  const navigate = useNavigate();
  const [session, setSession] = useState<any>(null);
  const [checking, setChecking] = useState(true);
  const [email, setEmail] = useState(""); const [password, setPassword] = useState(""); const [loginError, setLoginError] = useState("");
  const [tab, setTab] = useState<AdminTab>("projects");

  const [projects, setProjects] = useState<Project[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [servicesList, setServicesList] = useState<Service[]>([]);
  const [skillsList, setSkillsList] = useState<Skill[]>([]);
  const [credentialsList, setCredentialsList] = useState<Credential[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);

  const [editing, setEditing] = useState<Project | null>(null);
  const [draft, setDraft] = useState<AdminProjectForm>(blankProject);

  const [editingService, setEditingService] = useState<Service | null>(null);
  const [serviceDraft, setServiceDraft] = useState<AdminServiceForm>(blankService);

  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [skillDraft, setSkillDraft] = useState<AdminSkillForm>(blankSkill);

  const [editingCred, setEditingCred] = useState<Credential | null>(null);
  const [credDraft, setCredDraft] = useState<AdminCredentialForm>(blankCredential);

  const [profileDraft, setProfileDraft] = useState<Profile | null>(null);
  const [profileSaving, setProfileSaving] = useState(false);

  const [saving, setSaving] = useState(false); const [notice, setNotice] = useState("");
  const [showNewProject, setShowNewProject] = useState(false);
  const [showNewService, setShowNewService] = useState(false);
  const [showNewSkill, setShowNewSkill] = useState(false);
  const [showNewCred, setShowNewCred] = useState(false);

  useEffect(() => {
    if (!hasSupabase) { setChecking(false); return; }
    supabase.auth.getSession().then(({data}) => { setSession(data.session); setChecking(false); });
    const {data:{subscription}} = supabase.auth.onAuthStateChange((_event, next) => setSession(next));
    return () => subscription.unsubscribe();
  }, []);

  async function refresh() {
    const [p,m,b,s,k,c,pr] = await Promise.all([
      supabase.from("projects").select("*").order("created_at",{ascending:false}),
      supabase.from("messages").select("*").order("created_at",{ascending:false}),
      supabase.from("bookings").select("*").order("created_at",{ascending:false}),
      supabase.from("services").select("*").order("sort_order",{ascending:true}),
      supabase.from("skills").select("*").order("sort_order",{ascending:true}),
      supabase.from("credentials").select("*").order("sort_order",{ascending:true}),
      supabase.from("profile").select("*").eq("id",1).maybeSingle(),
    ]);
    if (p.data) setProjects(p.data as Project[]);
    if (m.data) setMessages(m.data);
    if (b.data) setBookings(b.data);
    if (s.data) setServicesList(s.data as Service[]);
    if (k.data) setSkillsList(k.data as Skill[]);
    if (c.data) setCredentialsList(c.data as Credential[]);
    if (pr.data) { setProfile(pr.data as Profile); setProfileDraft(pr.data as Profile); }
    if (p.error || m.error || b.error || s.error || k.error || c.error || pr.error)
      setNotice("Some data could not load. Check the SQL setup and admin permissions.");
  }
  useEffect(() => { if (session && hasSupabase) void refresh(); }, [session]);

  async function login(e: FormEvent) {
    e.preventDefault(); setLoginError("");
    const {error} = await supabase.auth.signInWithPassword({email,password});
    if (error) setLoginError("Sign-in failed. Check your credentials and confirm the admin user exists in Supabase Auth.");
  }

  // -------- Projects (unchanged behaviour) --------
  function startNew() { setEditing(null); setDraft({...blankProject}); setNotice(""); setShowNewProject(true); }
  function startEdit(p: Project) { setEditing(p); setDraft({title:p.title,slug:p.slug,summary:p.summary,description:p.description,role:p.role,technologies:p.technologies||[],category:p.category,github_url:p.github_url||"",live_url:p.live_url||"",cover_image:p.cover_image||"",gallery:p.gallery||[],featured:p.featured,published:p.published}); setNotice(""); setShowNewProject(true); }

  async function upload(file: File, gallery: boolean) {
    if (!file.type.startsWith("image/")) { setNotice("Choose an image file."); return; }
    if (file.size > 8 * 1024 * 1024) { setNotice("Images must be smaller than 8 MB."); return; }
    const path = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g,"-")}`;
    const {error} = await supabase.storage.from("project-images").upload(path,file,{upsert:false});
    if (error) { setNotice(`Upload failed: ${error.message}`); return; }
    const {data} = supabase.storage.from("project-images").getPublicUrl(path);
    setDraft(old => gallery ? {...old,gallery:[...old.gallery,data.publicUrl]} : {...old,cover_image:data.publicUrl});
    setNotice("Image uploaded. Save the project to keep the change.");
  }

  async function saveProject(e: FormEvent) {
    e.preventDefault(); setSaving(true); setNotice("");
    const payload = {...draft, slug:draft.slug.trim().toLowerCase().replace(/[^a-z0-9-]+/g,"-").replace(/^-|-$/g,""), github_url:draft.github_url||null, live_url:draft.live_url||null, cover_image:draft.cover_image||null};
    const result = editing ? await supabase.from("projects").update(payload).eq("id",editing.id) : await supabase.from("projects").insert(payload);
    setSaving(false);
    if (result.error) { setNotice(`Could not save: ${result.error.message}`); return; }
    setNotice("Project saved."); setEditing(null); setShowNewProject(false); await refresh();
  }

  async function removeProject(p: Project) {
    if (!window.confirm(`Delete "${p.title}"? This cannot be undone.`)) return;
    const {error} = await supabase.from("projects").delete().eq("id",p.id);
    setNotice(error ? error.message : "Project deleted."); await refresh();
  }

  async function updateStatus(table: "messages"|"bookings", id: string, status: string) {
    const {error} = await supabase.from(table).update({status}).eq("id",id);
    setNotice(error ? error.message : "Status updated."); await refresh();
  }

  // -------- Services --------
  function startNewService() { setEditingService(null); setServiceDraft({...blankService, sort_order: servicesList.length + 1}); setNotice(""); setShowNewService(true); }
  function startEditService(s: Service) { setEditingService(s); setServiceDraft({ id: s.id, title: s.title, description: s.description, items: s.items || [], sort_order: s.sort_order ?? 0, published: s.published ?? true }); setNotice(""); setShowNewService(true); }
  async function saveService(e: FormEvent) {
    e.preventDefault(); setSaving(true); setNotice("");
    const payload = { title: serviceDraft.title, description: serviceDraft.description, items: serviceDraft.items, sort_order: serviceDraft.sort_order, published: serviceDraft.published };
    const result = editingService?.id ? await supabase.from("services").update(payload).eq("id", editingService.id) : await supabase.from("services").insert(payload);
    setSaving(false);
    if (result.error) { setNotice(`Could not save: ${result.error.message}`); return; }
    setNotice("Service saved."); setEditingService(null); setShowNewService(false); await refresh();
  }
  async function removeService(s: Service) {
    if (!s.id) return;
    if (!window.confirm(`Delete service "${s.title}"?`)) return;
    const {error} = await supabase.from("services").delete().eq("id", s.id);
    setNotice(error ? error.message : "Service deleted."); await refresh();
  }

  // -------- Skills --------
  function startNewSkill() { setEditingSkill(null); setSkillDraft({...blankSkill, sort_order: skillsList.length + 1}); setNotice(""); setShowNewSkill(true); }
  function startEditSkill(s: Skill) { setEditingSkill(s); setSkillDraft({ id: s.id, name: s.name, category: s.category, sort_order: s.sort_order, published: s.published }); setNotice(""); setShowNewSkill(true); }
  async function saveSkill(e: FormEvent) {
    e.preventDefault(); setSaving(true); setNotice("");
    const payload = { name: skillDraft.name, category: skillDraft.category, sort_order: skillDraft.sort_order, published: skillDraft.published };
    const result = editingSkill?.id ? await supabase.from("skills").update(payload).eq("id", editingSkill.id) : await supabase.from("skills").insert(payload);
    setSaving(false);
    if (result.error) { setNotice(`Could not save: ${result.error.message}`); return; }
    setNotice("Skill saved."); setEditingSkill(null); setShowNewSkill(false); await refresh();
  }
  async function removeSkill(s: Skill) {
    if (!window.confirm(`Delete "${s.name}" from the toolkit?`)) return;
    const {error} = await supabase.from("skills").delete().eq("id", s.id);
    setNotice(error ? error.message : "Skill deleted."); await refresh();
  }

  // -------- Credentials --------
  function startNewCred() { setEditingCred(null); setCredDraft({...blankCredential, sort_order: credentialsList.length + 1}); setNotice(""); setShowNewCred(true); }
  function startEditCred(c: Credential) { setEditingCred(c); setCredDraft({ id: c.id, kind: c.kind, title: c.title, institution: c.institution, detail: c.detail, sort_order: c.sort_order, published: c.published }); setNotice(""); setShowNewCred(true); }
  async function saveCred(e: FormEvent) {
    e.preventDefault(); setSaving(true); setNotice("");
    const payload = { kind: credDraft.kind, title: credDraft.title, institution: credDraft.institution, detail: credDraft.detail, sort_order: credDraft.sort_order, published: credDraft.published };
    const result = editingCred?.id ? await supabase.from("credentials").update(payload).eq("id", editingCred.id) : await supabase.from("credentials").insert(payload);
    setSaving(false);
    if (result.error) { setNotice(`Could not save: ${result.error.message}`); return; }
    setNotice("Credential saved."); setEditingCred(null); setShowNewCred(false); await refresh();
  }
  async function removeCred(c: Credential) {
    if (!window.confirm(`Delete "${c.title}"?`)) return;
    const {error} = await supabase.from("credentials").delete().eq("id", c.id);
    setNotice(error ? error.message : "Credential deleted."); await refresh();
  }

  // -------- Profile (site settings + photo + CV upload) --------
  async function saveProfile(e: FormEvent) {
    e.preventDefault(); if (!profileDraft) return;
    setProfileSaving(true); setNotice("");
    const { id, updated_at, ...payload } = profileDraft;
    const result = await supabase.from("profile").update(payload).eq("id", 1);
    setProfileSaving(false);
    if (result.error) { setNotice(`Could not save profile: ${result.error.message}`); return; }
    setNotice("Profile saved."); await refresh();
  }
  async function uploadProfileFile(file: File, kind: "photo" | "cv") {
    const isPdf = file.type === "application/pdf";
    const isImg = file.type.startsWith("image/");
    if (kind === "photo" && !isImg) { setNotice("Choose an image file for your photo."); return; }
    if (kind === "cv" && !isPdf) { setNotice("Choose a PDF file for your CV."); return; }
    if (file.size > 8 * 1024 * 1024) { setNotice("Files must be smaller than 8 MB."); return; }
    const path = `profile/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g,"-")}`;
    const {error} = await supabase.storage.from("project-images").upload(path, file, { upsert: false });
    if (error) { setNotice(`Upload failed: ${error.message}`); return; }
    const { data } = supabase.storage.from("project-images").getPublicUrl(path);
    const url = data.publicUrl;
    const patch = kind === "photo" ? { photo_url: url } : { cv_url: url };
    const { error: dbErr } = await supabase.from("profile").update(patch).eq("id", 1);
    if (dbErr) { setNotice(`Saved file but could not update profile: ${dbErr.message}`); return; }
    setProfileDraft(old => old ? { ...old, ...patch } : old);
    setNotice(kind === "photo" ? "Photo uploaded and saved." : "CV uploaded and saved.");
  }

  if (checking) return <div className="admin-screen"><p>Checking session…</p></div>;
  if (!hasSupabase) return <><Header/><main className="admin-login"><div className="login-card"><span className="eyebrow">PRIVATE AREA / SETUP REQUIRED</span><h1>Admin access.</h1><p>Connect your Supabase project first. Follow <code>SETUP.md</code> for the database, storage and environment setup, then create your admin account in Supabase Auth.</p><Link className="button button-light" to="/">Back to website <ArrowLeft size={15}/></Link></div></main><Footer/></>;
  if (!session) return <><Header/><main className="admin-login"><form className="login-card" onSubmit={login}><span className="eyebrow">PRIVATE AREA / 01</span><h1>Admin access.</h1><p>Sign in with your authorised administrator account.</p><label>Email address<input required type="email" value={email} onChange={e=>setEmail(e.target.value)} autoComplete="username"/></label><label>Password<input required type="password" value={password} onChange={e=>setPassword(e.target.value)} autoComplete="current-password"/></label>{loginError && <p className="form-error">{loginError}</p>}<button className="button button-light submit-button">Sign in <ArrowRight size={15}/></button><Link to="/" className="back-link"><ArrowLeft size={14}/> Back to website</Link></form></main><Footer/></>;

  const tabLabels: { key: AdminTab; label: string; icon: React.ReactNode; count?: number }[] = [
    { key: "projects", label: "Projects", icon: <Layers3 size={17}/>, count: projects.length },
    { key: "services", label: "Services", icon: <MonitorCog size={17}/>, count: servicesList.length },
    { key: "skills", label: "Toolkit", icon: <Code2 size={17}/>, count: skillsList.length },
    { key: "credentials", label: "Credentials", icon: <GraduationCap size={17}/>, count: credentialsList.length },
    { key: "profile", label: "Profile", icon: <BadgeCheck size={17}/> },
    { key: "messages", label: "Messages", icon: <MessageSquare size={17}/>, count: messages.filter(m => m.status === "new").length },
    { key: "bookings", label: "Bookings", icon: <Smartphone size={17}/>, count: bookings.filter(b => b.status === "new").length },
  ];

  return <div className="admin-layout"><aside className="admin-sidebar"><Link className="wordmark" to="/"><span className="monogram">{profile?.short_name || "TN"}</span><span>{(profile?.full_name || "Thembinkosi Ndlovu").toUpperCase()}<small>ADMINISTRATION</small></span></Link><div className="admin-side-label">WORKSPACE</div>{tabLabels.map(t=><button key={t.key} className={tab===t.key?"admin-nav active":"admin-nav"} onClick={()=>{setTab(t.key);setEditing(null);setEditingService(null);setEditingSkill(null);setEditingCred(null);setShowNewProject(false);setShowNewService(false);setShowNewSkill(false);setShowNewCred(false);setNotice("");}}>{t.icon}<span>{t.label}</span>{typeof t.count === "number" && <span className="admin-count">{t.count}</span>}</button>)}<div className="admin-sidebar-bottom"><Link to="/">← View website</Link><button onClick={async()=>{await supabase.auth.signOut();navigate("/admin");}}>Sign out <ArrowUpRight size={14}/></button></div></aside>
    <main className="admin-main"><div className="admin-topbar"><div><span className="eyebrow">WORKSPACE / {tab.toUpperCase()}</span><h1>{tab==="projects"?(showNewProject?(editing?"Edit project":"Create a project"):"Manage projects"):tab==="services"?(showNewService?(editingService?"Edit service":"New service"):"Manage services"):tab==="skills"?(showNewSkill?(editingSkill?"Edit skill":"New skill"):"Manage toolkit"):tab==="credentials"?(showNewCred?(editingCred?"Edit credential":"New credential"):"Manage credentials"):tab==="profile"?"Site profile & content":tab==="messages"?"Incoming messages":"Booking requests"}</h1></div><span className="admin-user"><span className="status-dot"/> SECURE SESSION</span></div>{notice && <p className="admin-notice">{notice}</p>}

    {/* ---------- PROJECTS ---------- */}
    {tab==="projects" && (showNewProject ? <form className="admin-editor" onSubmit={saveProject}><div className="editor-heading"><div><span className="eyebrow">PROJECT DETAILS</span><h2>{editing?"Update project":"Create a project"}</h2></div><button type="button" className="icon-button" onClick={()=>{setEditing(null);setShowNewProject(false);setNotice("");}}><X/></button></div><div className="form-two"><label>Project title<input required value={draft.title} onChange={e=>setDraft({...draft,title:e.target.value,slug:editing?draft.slug:e.target.value.toLowerCase().trim().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")})}/></label><label>URL slug<input required value={draft.slug} onChange={e=>setDraft({...draft,slug:e.target.value})}/></label></div><label>Short summary<input required maxLength={220} value={draft.summary} onChange={e=>setDraft({...draft,summary:e.target.value})}/></label><label>Project description<textarea rows={5} required value={draft.description} onChange={e=>setDraft({...draft,description:e.target.value})}/></label><div className="form-two"><label>Your role<input value={draft.role} onChange={e=>setDraft({...draft,role:e.target.value})} placeholder="e.g. Founder & full-stack developer"/></label><label>Category<input value={draft.category} onChange={e=>setDraft({...draft,category:e.target.value})}/></label></div><label>Technologies <span className="optional">(comma separated)</span><input value={draft.technologies.join(", ")} onChange={e=>setDraft({...draft,technologies:e.target.value.split(",").map(x=>x.trim()).filter(Boolean)})}/></label><div className="form-two"><label>GitHub URL<input type="url" value={draft.github_url||""} onChange={e=>setDraft({...draft,github_url:e.target.value})} placeholder="https://github.com/…"/></label><label>Live project URL<input type="url" value={draft.live_url||""} onChange={e=>setDraft({...draft,live_url:e.target.value})} placeholder="https://…"/></label></div><div className="upload-block"><div><strong>Cover screenshot</strong><p>JPG, PNG or WebP · max 8 MB</p>{draft.cover_image && <img className="upload-preview" src={draft.cover_image} alt="Cover preview"/>}<label className="upload-button">Choose cover image<input type="file" accept="image/*" onChange={e=>e.target.files?.[0] && void upload(e.target.files[0],false)}/></label></div><div><strong>Gallery screenshots</strong><p>Add multiple screenshots to this project.</p><label className="upload-button">Add gallery images<input type="file" accept="image/*" multiple onChange={async e=>{for(const f of Array.from(e.target.files||[])) await upload(f,true);e.currentTarget.value="";}}/></label><div className="gallery-previews">{draft.gallery.map((url,i)=><div key={url}><img src={url} alt={`Gallery ${i+1}`}/><button type="button" onClick={()=>setDraft({...draft,gallery:draft.gallery.filter(x=>x!==url)})} aria-label="Remove screenshot"><X size={13}/></button></div>)}</div></div></div><div className="editor-toggles"><label className="check-label"><input type="checkbox" checked={draft.featured} onChange={e=>setDraft({...draft,featured:e.target.checked})}/> Featured project</label><label className="check-label"><input type="checkbox" checked={draft.published} onChange={e=>setDraft({...draft,published:e.target.checked})}/> Publish on website</label></div><div className="editor-actions"><button type="button" className="button button-outline" onClick={()=>{setEditing(null);setShowNewProject(false);setNotice("");}}>Cancel</button><button className="button button-light" disabled={saving}>{saving?"Saving…":"Save project"} <Check size={15}/></button></div></form> : <><div className="admin-toolbar"><p>{projects.length} projects in your portfolio</p><button className="button button-light" onClick={startNew}><Plus size={16}/> Add project</button></div><div className="admin-table"><div className="admin-table-head"><span>PROJECT</span><span>STATUS</span><span>UPDATED</span><span>ACTIONS</span></div>{projects.map(p=><div className="admin-table-row" key={p.id}><div className="admin-project-cell">{p.cover_image?<img src={p.cover_image} alt=""/>:<span className="mini-art"><Code2 size={18}/></span>}<div><strong>{p.title}</strong><small>/{p.slug}</small></div></div><span className={p.published?"status-published":"status-draft"}>{p.published?"Published":"Draft"}</span><span className="table-date">{p.created_at?new Date(p.created_at).toLocaleDateString():"-"}</span><div className="table-actions"><button onClick={()=>startEdit(p)}>Edit</button><button className="danger-link" onClick={()=>void removeProject(p)}>Delete</button></div></div>)}{!projects.length && <div className="admin-empty"><Layers3/><h3>No projects yet</h3><p>Add a project, upload screenshots and publish it when it’s ready.</p></div>}</div></> )}

    {/* ---------- SERVICES ---------- */}
    {tab==="services" && (showNewService ? <form className="admin-editor" onSubmit={saveService}><div className="editor-heading"><div><span className="eyebrow">SERVICE DETAILS</span><h2>{editingService?"Update service":"Create a service"}</h2></div><button type="button" className="icon-button" onClick={()=>{setEditingService(null);setShowNewService(false);setNotice("");}}><X/></button></div><label>Title<input required value={serviceDraft.title} onChange={e=>setServiceDraft({...serviceDraft,title:e.target.value})}/></label><label>Description<textarea rows={3} required value={serviceDraft.description} onChange={e=>setServiceDraft({...serviceDraft,description:e.target.value})}/></label><label>Bullet items <span className="optional">(one per line)</span><textarea rows={4} value={serviceDraft.items.join("\n")} onChange={e=>setServiceDraft({...serviceDraft,items:e.target.value.split("\n").map(x=>x.trim()).filter(Boolean)})}/></label><div className="form-two"><label>Sort order<input type="number" value={serviceDraft.sort_order} onChange={e=>setServiceDraft({...serviceDraft,sort_order:Number(e.target.value)||0})}/></label><label className="check-label" style={{alignSelf:"end"}}><input type="checkbox" checked={serviceDraft.published} onChange={e=>setServiceDraft({...serviceDraft,published:e.target.checked})}/> Published</label></div><div className="editor-actions"><button type="button" className="button button-outline" onClick={()=>{setEditingService(null);setShowNewService(false);setNotice("");}}>Cancel</button><button className="button button-light" disabled={saving}>{saving?"Saving…":"Save service"} <Check size={15}/></button></div></form> : <><div className="admin-toolbar"><p>{servicesList.length} services shown on the homepage</p><button className="button button-light" onClick={startNewService}><Plus size={16}/> Add service</button></div><div className="admin-table"><div className="admin-table-head"><span>SERVICE</span><span>STATUS</span><span>ORDER</span><span>ACTIONS</span></div>{servicesList.map(s=><div className="admin-table-row" key={s.id}><div className="admin-project-cell"><span className="mini-art"><MonitorCog size={18}/></span><div><strong>{s.title}</strong><small>{s.items.length} bullet{s.items.length===1?"":"s"}</small></div></div><span className={s.published?"status-published":"status-draft"}>{s.published?"Published":"Draft"}</span><span className="table-date">{s.sort_order}</span><div className="table-actions"><button onClick={()=>startEditService(s)}>Edit</button><button className="danger-link" onClick={()=>void removeService(s)}>Delete</button></div></div>)}{!servicesList.length && <div className="admin-empty"><MonitorCog/><h3>No services yet</h3><p>Add a service to show it on the homepage.</p></div>}</div></> )}

    {/* ---------- SKILLS / TOOLKIT ---------- */}
    {tab==="skills" && (showNewSkill ? <form className="admin-editor" onSubmit={saveSkill}><div className="editor-heading"><div><span className="eyebrow">TOOLKIT ITEM</span><h2>{editingSkill?"Update skill":"Add a skill"}</h2></div><button type="button" className="icon-button" onClick={()=>{setEditingSkill(null);setShowNewSkill(false);setNotice("");}}><X/></button></div><div className="form-two"><label>Name<input required value={skillDraft.name} onChange={e=>setSkillDraft({...skillDraft,name:e.target.value})}/></label><label>Category<input value={skillDraft.category} onChange={e=>setSkillDraft({...skillDraft,category:e.target.value})} placeholder="e.g. Backend"/></label></div><div className="form-two"><label>Sort order<input type="number" value={skillDraft.sort_order} onChange={e=>setSkillDraft({...skillDraft,sort_order:Number(e.target.value)||0})}/></label><label className="check-label" style={{alignSelf:"end"}}><input type="checkbox" checked={skillDraft.published} onChange={e=>setSkillDraft({...skillDraft,published:e.target.checked})}/> Published</label></div><div className="editor-actions"><button type="button" className="button button-outline" onClick={()=>{setEditingSkill(null);setShowNewSkill(false);setNotice("");}}>Cancel</button><button className="button button-light" disabled={saving}>{saving?"Saving…":"Save skill"} <Check size={15}/></button></div></form> : <><div className="admin-toolbar"><p>{skillsList.length} items in your toolkit</p><button className="button button-light" onClick={startNewSkill}><Plus size={16}/> Add skill</button></div><div className="admin-table"><div className="admin-table-head"><span>SKILL</span><span>STATUS</span><span>ORDER</span><span>ACTIONS</span></div>{skillsList.map(s=><div className="admin-table-row" key={s.id}><div className="admin-project-cell"><span className="mini-art"><Code2 size={18}/></span><div><strong>{s.name}</strong><small>{s.category}</small></div></div><span className={s.published?"status-published":"status-draft"}>{s.published?"Published":"Draft"}</span><span className="table-date">{s.sort_order}</span><div className="table-actions"><button onClick={()=>startEditSkill(s)}>Edit</button><button className="danger-link" onClick={()=>void removeSkill(s)}>Delete</button></div></div>)}{!skillsList.length && <div className="admin-empty"><Code2/><h3>No skills yet</h3><p>Add tools and technologies you use.</p></div>}</div></> )}

    {/* ---------- CREDENTIALS ---------- */}
    {tab==="credentials" && (showNewCred ? <form className="admin-editor" onSubmit={saveCred}><div className="editor-heading"><div><span className="eyebrow">CREDENTIAL</span><h2>{editingCred?"Update credential":"Add a credential"}</h2></div><button type="button" className="icon-button" onClick={()=>{setEditingCred(null);setShowNewCred(false);setNotice("");}}><X/></button></div><div className="form-two"><label>Kind<select value={credDraft.kind} onChange={e=>setCredDraft({...credDraft,kind:e.target.value as Credential["kind"]})}><option value="education">Education</option><option value="certification">Certification</option><option value="award">Award</option><option value="course">Course</option></select></label><label>Title<input required value={credDraft.title} onChange={e=>setCredDraft({...credDraft,title:e.target.value})}/></label></div><label>Institution<input value={credDraft.institution} onChange={e=>setCredDraft({...credDraft,institution:e.target.value})}/></label><label>Detail <span className="optional">(optional)</span><input value={credDraft.detail} onChange={e=>setCredDraft({...credDraft,detail:e.target.value})} placeholder="e.g. IT Essentials Instructor · CCNA Instructor Training"/></label><div className="form-two"><label>Sort order<input type="number" value={credDraft.sort_order} onChange={e=>setCredDraft({...credDraft,sort_order:Number(e.target.value)||0})}/></label><label className="check-label" style={{alignSelf:"end"}}><input type="checkbox" checked={credDraft.published} onChange={e=>setCredDraft({...credDraft,published:e.target.checked})}/> Published</label></div><div className="editor-actions"><button type="button" className="button button-outline" onClick={()=>{setEditingCred(null);setShowNewCred(false);setNotice("");}}>Cancel</button><button className="button button-light" disabled={saving}>{saving?"Saving…":"Save credential"} <Check size={15}/></button></div></form> : <><div className="admin-toolbar"><p>{credentialsList.length} credentials saved</p><button className="button button-light" onClick={startNewCred}><Plus size={16}/> Add credential</button></div><div className="admin-table"><div className="admin-table-head"><span>CREDENTIAL</span><span>KIND</span><span>ORDER</span><span>ACTIONS</span></div>{credentialsList.map(c=><div className="admin-table-row" key={c.id}><div className="admin-project-cell"><span className="mini-art"><GraduationCap size={18}/></span><div><strong>{c.title}</strong><small>{c.institution || "—"}</small></div></div><span className={c.published?"status-published":"status-draft"}>{c.kind}</span><span className="table-date">{c.sort_order}</span><div className="table-actions"><button onClick={()=>startEditCred(c)}>Edit</button><button className="danger-link" onClick={()=>void removeCred(c)}>Delete</button></div></div>)}{!credentialsList.length && <div className="admin-empty"><GraduationCap/><h3>No credentials yet</h3><p>Add education, certifications or awards.</p></div>}</div></> )}

    {/* ---------- PROFILE ---------- */}
    {tab==="profile" && profileDraft && <form className="admin-editor" onSubmit={saveProfile}>
      <div className="editor-heading"><div><span className="eyebrow">SITE PROFILE</span><h2>Identity, hero, about, footer</h2></div></div>
      <div className="upload-block"><div><strong>Your photo</strong><p>Shown in the About panel and hero. JPG/PNG/WebP.</p>{profileDraft.photo_url && <img className="upload-preview" src={profileDraft.photo_url} alt="Profile"/>}<label className="upload-button">Upload photo<input type="file" accept="image/*" onChange={e=>e.target.files?.[0] && void uploadProfileFile(e.target.files[0],"photo")}/></label>{profileDraft.photo_url && <button type="button" className="text-link" style={{marginTop:8}} onClick={async()=>{await supabase.from("profile").update({photo_url:null}).eq("id",1);await refresh();}}>Remove photo</button>}</div><div><strong>Your CV (PDF)</strong><p>Powers the “Download my CV” link on the About section.</p>{profileDraft.cv_url && <p className="small-print">Current: <a href={profileDraft.cv_url} target="_blank" rel="noreferrer">view file</a></p>}<label className="upload-button">Upload CV (PDF)<input type="file" accept="application/pdf" onChange={e=>e.target.files?.[0] && void uploadProfileFile(e.target.files[0],"cv")}/></label>{profileDraft.cv_url && <button type="button" className="text-link" style={{marginTop:8}} onClick={async()=>{await supabase.from("profile").update({cv_url:null}).eq("id",1);await refresh();}}>Remove CV</button>}</div></div>
      <div className="form-two"><label>Full name<input value={profileDraft.full_name} onChange={e=>setProfileDraft({...profileDraft,full_name:e.target.value})}/></label><label>Short name / monogram<input value={profileDraft.short_name} onChange={e=>setProfileDraft({...profileDraft,short_name:e.target.value})}/></label></div>
      <div className="form-two"><label>Role line (under your name)<input value={profileDraft.role_line} onChange={e=>setProfileDraft({...profileDraft,role_line:e.target.value})}/></label><label>Availability badge<input value={profileDraft.availability} onChange={e=>setProfileDraft({...profileDraft,availability:e.target.value})}/></label></div>
      <label>Hero kicker<input value={profileDraft.hero_kicker} onChange={e=>setProfileDraft({...profileDraft,hero_kicker:e.target.value})}/></label>
      <label>Hero heading <span className="optional">(the last word becomes the italic accent)</span><input value={profileDraft.hero_heading} onChange={e=>setProfileDraft({...profileDraft,hero_heading:e.target.value})}/></label>
      <label>Hero intro<textarea rows={3} value={profileDraft.hero_intro} onChange={e=>setProfileDraft({...profileDraft,hero_intro:e.target.value})}/></label>
      <label>About — lead paragraph<textarea rows={3} value={profileDraft.about_lead} onChange={e=>setProfileDraft({...profileDraft,about_lead:e.target.value})}/></label>
      <label>About — body paragraph<textarea rows={3} value={profileDraft.about_body} onChange={e=>setProfileDraft({...profileDraft,about_body:e.target.value})}/></label>
      <label>About — extra paragraph<textarea rows={3} value={profileDraft.about_extra} onChange={e=>setProfileDraft({...profileDraft,about_extra:e.target.value})}/></label>
      <div className="form-two"><label>Contact email<input type="email" value={profileDraft.email} onChange={e=>setProfileDraft({...profileDraft,email:e.target.value})}/></label><label>Location<input value={profileDraft.location} onChange={e=>setProfileDraft({...profileDraft,location:e.target.value})}/></label></div>
      <label>Footer tagline<input value={profileDraft.footer_tagline} onChange={e=>setProfileDraft({...profileDraft,footer_tagline:e.target.value})}/></label>
      <label>Footer note (bottom right)<input value={profileDraft.footer_note} onChange={e=>setProfileDraft({...profileDraft,footer_note:e.target.value})}/></label>
      <div className="editor-actions"><button className="button button-light" disabled={profileSaving}>{profileSaving?"Saving…":"Save profile"} <Save size={15}/></button></div>
    </form>}

    {/* ---------- MESSAGES ---------- */}
    {tab==="messages" && <div className="inbox-list">{messages.map(m=><article className="inbox-card" key={m.id}><div className="inbox-heading"><div><span className="eyebrow">{m.subject||"GENERAL ENQUIRY"}</span><h3>{m.name}</h3><a href={`mailto:${m.email}`}>{m.email}</a></div><select value={m.status} onChange={e=>void updateStatus("messages",m.id,e.target.value)}><option value="new">New</option><option value="read">Read</option><option value="replied">Replied</option><option value="archived">Archived</option></select></div><p>{m.message}</p><small>{new Date(m.created_at).toLocaleString()}</small></article>)}{!messages.length&&<div className="admin-empty"><MessageSquare/><h3>Your inbox is clear.</h3><p>New contact form submissions will appear here.</p></div>}</div>}

    {/* ---------- BOOKINGS ---------- */}
    {tab==="bookings" && <div className="inbox-list">{bookings.map(b=><article className="inbox-card" key={b.id}><div className="inbox-heading"><div><span className="eyebrow">{b.service}</span><h3>{b.name}</h3><a href={`mailto:${b.email}`}>{b.email}</a></div><select value={b.status} onChange={e=>void updateStatus("bookings",b.id,e.target.value)}><option value="new">New</option><option value="contacted">Contacted</option><option value="confirmed">Confirmed</option><option value="completed">Completed</option><option value="cancelled">Cancelled</option></select></div><div className="booking-meta"><span>Preferred date: <strong>{b.preferred_date||"Flexible"}</strong></span><span>Time: <strong>{b.preferred_time||"Flexible"}</strong></span>{b.organisation&&<span>Organisation: <strong>{b.organisation}</strong></span>}</div>{b.details&&<p>{b.details}</p>}<small>Requested {new Date(b.created_at).toLocaleString()}</small></article>)}{!bookings.length&&<div className="admin-empty"><Smartphone/><h3>No booking requests yet.</h3><p>Consultation requests will be listed here.</p></div>}</div>}
    </main></div>;
}

export default function App() {
  return <Routes><Route path="/" element={<Home/>}/><Route path="/work/:slug" element={<ProjectDetail/>}/><Route path="/book" element={<Booking/>}/><Route path="/admin" element={<Admin/>}/><Route path="*" element={<><Header/><main className="not-found container"><span className="eyebrow">404 / NOT FOUND</span><h1>Wrong turn.</h1><p>This page doesn’t exist or has moved.</p><Link to="/" className="button button-light">Return home <ArrowRight size={15}/></Link></main><Footer/></>}/></Routes>;
}