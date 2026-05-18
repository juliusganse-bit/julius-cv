import { useState, useRef, useCallback, useEffect } from "react";
import { supabase } from "./supabase";

const FONTS = "@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Crimson+Pro:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');";

const TIPS = {
  summary: [
    "Commence par ton titre professionnel et tes années d'expérience.",
    "Mentionne 2-3 compétences clés en rapport avec le poste visé.",
    "Termine par ta valeur ajoutée : ce que TU apportes à l'entreprise.",
    "Reste concis : 3 à 5 lignes maximum.",
  ],
  experience: [
    "Utilise des verbes d'action : développé, piloté, optimisé, créé…",
    "Quantifie tes résultats : +30% de ventes, 50 clients gérés…",
    "Mets en avant les réalisations, pas seulement les responsabilités.",
    "Adapte chaque expérience au poste que tu vises.",
  ],
  skills: [
    "Sépare les compétences techniques des soft skills.",
    "Indique ton niveau : débutant, intermédiaire, expert.",
    "Mets en avant les compétences demandées dans l'offre d'emploi.",
    "Évite de mettre trop de compétences — mieux vaut la qualité.",
  ],
  education: [
    "Commence par le diplôme le plus récent.",
    "Mentionne tes mentions si elles sont bonnes.",
    "Inclus les formations en ligne certifiantes pertinentes.",
  ],
};

const TEMPLATES = {
  classique: { name: "Classique", accent: "#1a365d", bg: "#ffffff", text: "#1a1a2e", secondary: "#4a5568", headerBg: "#1a365d", headerText: "#ffffff" },
  moderne: { name: "Moderne", accent: "#2d6a4f", bg: "#f8f9fa", text: "#1b1b2f", secondary: "#555", headerBg: "#2d6a4f", headerText: "#ffffff" },
  elegant: { name: "Élégant Violet", accent: "#7b2d8b", bg: "#fefefe", text: "#1a1a1a", secondary: "#666", headerBg: "#7b2d8b", headerText: "#ffffff" },
  elegantOr: { name: "Élégant Or", accent: "#b7791f", bg: "#fffff8", text: "#1a1a1a", secondary: "#7a6a4f", headerBg: "#b7791f", headerText: "#ffffff" },
  elegantNoir: { name: "Élégant Noir", accent: "#a0aec0", bg: "#1a1a1a", text: "#e2e8f0", secondary: "#a0aec0", headerBg: "#000000", headerText: "#e2e8f0" },
};

const PLAN_LIMITS = { standard: 1, premium: 7, pro: Infinity };

const initialData = {
  photo: null, firstName: "", lastName: "", birthdate: "", country: "", city: "",
  address: "", phone: "", email: "", title: "", linkedin: "", summary: "",
  experiences: [{ id: 1, company: "", role: "", period: "", description: "" }],
  education: [{ id: 1, school: "", degree: "", period: "", mention: "" }],
  skills: "", languages: "", hobbies: "",
};

// ─── AUTH PAGE ───────────────────────────────────────────────────────────────
function AuthPage({ onAuth, onBack }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const inputS = { width: "100%", padding: "10px 14px", borderRadius: 8, border: "1.5px solid #d1d5db", fontSize: 14, fontFamily: "'DM Sans', sans-serif", outline: "none", boxSizing: "border-box", marginTop: 4 };

  const handleSubmit = async () => {
    setError(""); setSuccess(""); setLoading(true);
    if (mode === "login") {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError("Email ou mot de passe incorrect.");
      else onAuth(data.user);
    } else {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) { setError(error.message); }
      else {
        // Créer le profil
        await supabase.from("profiles").insert({ id: data.user.id, email, plan: "standard", cv_count: 0 });
        setSuccess("Compte créé ! Vérifie ton email pour confirmer, puis connecte-toi.");
        setMode("login");
      }
    }
    setLoading(false);
  };

  return (
    <>
      <style>{FONTS}</style>
      <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0f0c29, #1e1b4b, #302b63)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', sans-serif", padding: 20 }}>
        <div style={{ background: "rgba(255,255,255,0.05)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 20, padding: "40px 36px", width: "100%", maxWidth: 420 }}>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, fontWeight: 700, color: "#fff", letterSpacing: "-1px" }}>Julius CV</div>
            <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, marginTop: 4, fontStyle: "italic" }}>Créez votre CV professionnel gratuitement</div>
          </div>

          <div style={{ display: "flex", background: "rgba(255,255,255,0.08)", borderRadius: 10, padding: 4, marginBottom: 24 }}>
            {["login", "signup"].map(m => (
              <button key={m} onClick={() => { setMode(m); setError(""); setSuccess(""); }}
                style={{ flex: 1, padding: "8px", border: "none", borderRadius: 8, background: mode === m ? "#fff" : "none", color: mode === m ? "#1e1b4b" : "rgba(255,255,255,0.6)", fontWeight: mode === m ? 700 : 400, cursor: "pointer", fontSize: 13, fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s" }}>
                {m === "login" ? "Connexion" : "Inscription"}
              </button>
            ))}
          </div>

          {error && <div style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 8, padding: "10px 14px", color: "#fca5a5", fontSize: 13, marginBottom: 16 }}>{error}</div>}
          {success && <div style={{ background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: 8, padding: "10px 14px", color: "#6ee7b7", fontSize: 13, marginBottom: 16 }}>{success}</div>}

          {mode === "signup" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
              <div>
                <label style={{ color: "rgba(255,255,255,0.7)", fontSize: 12 }}>Prénom</label>
                <input style={{ ...inputS, background: "rgba(255,255,255,0.08)", color: "#fff", border: "1.5px solid rgba(255,255,255,0.15)" }} value={prenom} onChange={e => setPrenom(e.target.value)} placeholder="Julius" />
              </div>
              <div>
                <label style={{ color: "rgba(255,255,255,0.7)", fontSize: 12 }}>Nom</label>
                <input style={{ ...inputS, background: "rgba(255,255,255,0.08)", color: "#fff", border: "1.5px solid rgba(255,255,255,0.15)" }} value={nom} onChange={e => setNom(e.target.value)} placeholder="Doe" />
              </div>
            </div>
          )}

          <div style={{ marginBottom: 12 }}>
            <label style={{ color: "rgba(255,255,255,0.7)", fontSize: 12 }}>Adresse email</label>
            <input style={{ ...inputS, background: "rgba(255,255,255,0.08)", color: "#fff", border: "1.5px solid rgba(255,255,255,0.15)" }} type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="julius@email.com" />
          </div>
          <div style={{ marginBottom: 24 }}>
            <label style={{ color: "rgba(255,255,255,0.7)", fontSize: 12 }}>Mot de passe</label>
            <input style={{ ...inputS, background: "rgba(255,255,255,0.08)", color: "#fff", border: "1.5px solid rgba(255,255,255,0.15)" }} type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
          </div>

          <button onClick={handleSubmit} disabled={loading}
            style={{ width: "100%", padding: "12px", background: loading ? "rgba(99,102,241,0.5)" : "linear-gradient(135deg, #6366f1, #4f46e5)", color: "#fff", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: loading ? "wait" : "pointer", fontFamily: "'DM Sans', sans-serif" }}>
            {loading ? "⏳ Chargement..." : mode === "login" ? "Se connecter" : "Créer mon compte"}
          </button>

          {mode === "login" && (
            <div style={{ textAlign: "center", marginTop: 16, color: "rgba(255,255,255,0.4)", fontSize: 12 }}>
              Pas encore de compte ? <span onClick={() => setMode("signup")} style={{ color: "#a5b4fc", cursor: "pointer" }}>S'inscrire gratuitement</span>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// ─── PRICING PAGE ─────────────────────────────────────────────────────────────
function PricingPage({ onBack, onUpgrade, userPlan, user }) {
  const [loading, setLoading] = useState(false);
  const [payLoading, setPayLoading] = useState(false);

  const plans = [
    {
      name: "Standard", price: "0 F", period: "", badge: null,
      features: [
        { label: "1 CV uniquement", ok: true },
        { label: "Modèle Classique", ok: true },
        { label: "Aperçu en temps réel", ok: true },
        { label: "Export PDF", ok: true },
        { label: "Photo de profil", ok: true },
        { label: "Modèles Moderne & Élégant", ok: false },
        { label: "Génération IA", ok: false },
        { label: "Jusqu'à 7 CV", ok: false },
        { label: "CV illimités", ok: false },
      ],
      cta: userPlan === "standard" ? "✅ Plan actuel" : "Rétrograder",
      active: userPlan === "standard", highlight: false, montant: 0,
    },
    {
      name: "Premium", price: "1 500 F", period: "/ mois", badge: "⭐ RECOMMANDÉ",
      features: [
        { label: "Jusqu'à 7 CV", ok: true },
        { label: "Tous les modèles de CV", ok: true },
        { label: "Aperçu en temps réel", ok: true },
        { label: "Export PDF haute qualité", ok: true },
        { label: "Photo de profil", ok: true },
        { label: "Génération IA du contenu", ok: true },
        { label: "Conseils de rédaction avancés", ok: true },
        { label: "1 jour d'essai gratuit", ok: true },
        { label: "CV illimités", ok: false },
      ],
      cta: userPlan === "premium" ? "✅ Plan actuel" : "Essayer 1 jour gratuit",
      active: userPlan === "premium", highlight: true, montant: 1500,
      trial: "1 jour d'essai gratuit",
    },
    {
      name: "Pro", price: "2 500 F", period: "/ mois", badge: "🚀 ILLIMITÉ",
      features: [
        { label: "CV illimités", ok: true },
        { label: "Tous les modèles de CV", ok: true },
        { label: "Génération IA illimitée", ok: true },
        { label: "Export PDF haute qualité", ok: true },
        { label: "Lettre de motivation IA", ok: true },
        { label: "Support prioritaire", ok: true },
        { label: "Export Word (.docx)", ok: true },
        { label: "Modèles exclusifs Pro", ok: true },
        { label: "Photo de profil", ok: true },
      ],
      cta: userPlan === "pro" ? "✅ Actif" : "S'abonner Pro",
      active: userPlan === "pro", highlight: false, montant: 2500, comingSoon: false,
    },
  ];

  const handlePay = (plan) => {
    if (plan.active || plan.comingSoon || plan.montant === 0) return;
    setPayLoading(true);
    try {
      window.FedaPay.init({
        public_key: "pk_live_LInjWuIJS2butkQ82sKWsG9N",
        transaction: {
          amount: plan.montant,
          description: `Julius CV — Abonnement ${plan.name}`,
        },
        customer: {
          email: user?.email || "",
          firstname: "Client",
          lastname: "Julius CV",
        },
        onComplete: async function(resp) {
          if (resp.reason === window.FedaPay.CHECKOUT_COMPLETED) {
            const newPlan = plan.name.toLowerCase();
            await supabase.from("profiles").update({ plan: newPlan }).eq("id", user.id);
            onUpgrade(newPlan);
          }
          setPayLoading(false);
        }
      }).open();
    } catch (e) {
      console.error(e);
      setPayLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0f0c29, #1e1b4b, #302b63)", display: "flex", flexDirection: "column", alignItems: "center", padding: "40px 20px", fontFamily: "'DM Sans', sans-serif" }}>
      <button onClick={onBack} style={{ alignSelf: "flex-start", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", borderRadius: 8, padding: "8px 16px", cursor: "pointer", fontSize: 13, marginBottom: 32 }}>
        ← Retour à l'éditeur
      </button>
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 38, fontWeight: 700, color: "#fff", letterSpacing: "-1px" }}>Julius CV</div>
        <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 16, marginTop: 8, fontStyle: "italic" }}>Choisissez le plan qui vous correspond</div>
        <div style={{ display: "inline-block", background: "rgba(99,102,241,0.3)", border: "1px solid rgba(99,102,241,0.5)", borderRadius: 20, padding: "4px 16px", color: "#a5b4fc", fontSize: 12, marginTop: 12 }}>
          🔒 Paiement sécurisé via FedaPay · MTN Mobile Money
        </div>
      </div>
      <div style={{ display: "flex", gap: 24, flexWrap: "wrap", justifyContent: "center", maxWidth: 1000, width: "100%" }}>
        {plans.map((plan) => (
          <div key={plan.name} style={{
            background: plan.highlight ? "linear-gradient(135deg, #4f46e5, #7c3aed)" : "rgba(255,255,255,0.05)",
            border: plan.highlight ? "2px solid #818cf8" : "1px solid rgba(255,255,255,0.1)",
            borderRadius: 16, padding: "32px 28px", width: 270, backdropFilter: "blur(12px)",
            boxShadow: plan.highlight ? "0 20px 60px rgba(79,70,229,0.4)" : "0 4px 20px rgba(0,0,0,0.2)",
            position: "relative",
          }}>
            {plan.badge && (
              <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: plan.highlight ? "linear-gradient(135deg, #f59e0b, #d97706)" : "linear-gradient(135deg, #7b2d8b, #9d4edd)", borderRadius: 20, padding: "4px 16px", fontSize: 11, fontWeight: 700, color: "#fff", whiteSpace: "nowrap" }}>
                {plan.badge}
              </div>
            )}
            <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "2px", marginBottom: 8 }}>{plan.name}</div>
            <div style={{ color: "#fff", fontSize: 32, fontWeight: 800, fontFamily: "'Playfair Display', serif" }}>{plan.price}<span style={{ fontSize: 14, fontWeight: 400, opacity: 0.7 }}>{plan.period}</span></div>
            {plan.trial && (
              <div style={{ display: "inline-block", background: "rgba(16,185,129,0.2)", border: "1px solid rgba(16,185,129,0.4)", borderRadius: 12, padding: "3px 10px", fontSize: 11, color: "#6ee7b7", marginTop: 6 }}>
                🎁 {plan.trial}
              </div>
            )}
            <div style={{ height: 1, background: "rgba(255,255,255,0.15)", margin: "16px 0" }} />
            <div style={{ marginBottom: 24 }}>
              {plan.features.map((f, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 9, fontSize: 12.5, color: f.ok ? "#fff" : "rgba(255,255,255,0.3)" }}>
                  <span>{f.ok ? "✅" : "❌"}</span>{f.label}
                </div>
              ))}
            </div>
            <button onClick={() => handlePay(plan)} disabled={plan.active || plan.comingSoon || payLoading}
              style={{
                width: "100%", padding: "12px", borderRadius: 10, border: "none", fontSize: 13, fontWeight: 600,
                cursor: plan.active || plan.comingSoon ? "default" : "pointer",
                background: plan.active ? "rgba(255,255,255,0.15)" : plan.comingSoon ? "rgba(255,255,255,0.05)" : plan.highlight ? "#fff" : "rgba(255,255,255,0.1)",
                color: plan.highlight && !plan.active ? "#4f46e5" : "#fff",
                opacity: plan.comingSoon ? 0.45 : 1,
                fontFamily: "'DM Sans', sans-serif",
              }}>
              {payLoading ? "⏳ Traitement..." : plan.cta}
            </button>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 48, color: "rgba(255,255,255,0.4)", fontSize: 12, textAlign: "center", maxWidth: 500 }}>
        📱 Paiement via MTN Mobile Money · Annulation possible à tout moment · Sans engagement
      </div>
    </div>
  );
}

// ─── TIP BOX ─────────────────────────────────────────────────────────────────
function TipBox({ field }) {
  const tips = TIPS[field];
  if (!tips) return null;
  return (
    <div style={{ background: "linear-gradient(135deg, #fffbeb, #fef3c7)", border: "1px solid #f59e0b", borderRadius: "8px", padding: "10px 14px", marginTop: "6px", fontSize: "12px", color: "#92400e" }}>
      <div style={{ fontWeight: 600, marginBottom: 4, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em" }}>💡 Conseils</div>
      <ul style={{ margin: 0, paddingLeft: 16 }}>
        {tips.map((t, i) => <li key={i} style={{ marginBottom: 2 }}>{t}</li>)}
      </ul>
    </div>
  );
}

// ─── CV PREVIEW ──────────────────────────────────────────────────────────────
function CVPreview({ data, template }) {
  const t = TEMPLATES[template];
  const s = {
    wrapper: { fontFamily: "'Crimson Pro', Georgia, serif", background: t.bg, color: t.text, fontSize: 13, lineHeight: 1.5, minHeight: 800, boxShadow: "0 4px 40px rgba(0,0,0,0.12)" },
    header: { background: t.headerBg, color: t.headerText, padding: "32px 36px 24px" },
    name: { fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700, margin: 0, letterSpacing: "-0.5px" },
    title: { fontSize: 14, marginTop: 4, opacity: 0.85, fontStyle: "italic" },
    contacts: { display: "flex", gap: 16, marginTop: 12, flexWrap: "wrap", fontSize: 12, opacity: 0.9 },
    body: { display: "grid", gridTemplateColumns: "1fr 2fr", gap: 0 },
    sidebar: { background: template === "classique" ? "#f0f4f8" : template === "moderne" ? "#e8f5e9" : template === "elegantOr" ? "#fdf8e1" : template === "elegantNoir" ? "#2d2d2d" : "#f5f0f8", padding: "24px 20px", borderRight: `2px solid ${t.accent}20` },
    main: { padding: "24px 28px" },
    sectionTitle: { fontFamily: "'Playfair Display', serif", fontSize: 13, fontWeight: 700, color: t.accent, textTransform: "uppercase", letterSpacing: "2px", borderBottom: `1.5px solid ${t.accent}`, paddingBottom: 4, marginBottom: 10, marginTop: 18 },
    item: { marginBottom: 10 },
    itemTitle: { fontWeight: 600, fontSize: 13.5 },
    itemSub: { fontSize: 12, color: t.secondary, fontStyle: "italic" },
    itemDesc: { fontSize: 12.5, marginTop: 2 },
    pill: { display: "inline-block", background: `${t.accent}15`, color: t.accent, borderRadius: 20, padding: "2px 10px", fontSize: 11.5, margin: "2px 3px 2px 0", fontWeight: 500 },
  };
  return (
    <div style={s.wrapper}>
      <div style={s.header}>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          {data.photo && <img src={data.photo} alt="Photo" style={{ width: 80, height: 80, borderRadius: "50%", objectFit: "cover", border: `3px solid ${t.headerText}40`, flexShrink: 0 }} />}
          <div>
            <div style={s.name}>{data.firstName || "Prénom"} {data.lastName || "Nom"}</div>
            <div style={s.title}>{data.title || "Profession"}</div>
            <div style={s.contacts}>
              {data.email && <span>✉ {data.email}</span>}
              {data.phone && <span>📞 {data.phone}</span>}
              {data.city && <span>📍 {data.city}{data.country ? `, ${data.country}` : ""}</span>}
              {data.birthdate && <span>🎂 {data.birthdate}</span>}
              {data.linkedin && <span>🔗 {data.linkedin}</span>}
            </div>
          </div>
        </div>
      </div>
      <div style={s.body}>
        <div style={s.sidebar}>
          {data.skills && (<><div style={{ ...s.sectionTitle, marginTop: 0 }}>Compétences</div><div>{data.skills.split(",").map((sk, i) => <span key={i} style={s.pill}>{sk.trim()}</span>)}</div></>)}
          {data.languages && (<><div style={s.sectionTitle}>Langues</div><div>{data.languages.split(",").map((l, i) => <span key={i} style={s.pill}>{l.trim()}</span>)}</div></>)}
          {data.hobbies && (<><div style={s.sectionTitle}>Loisirs</div><div style={{ fontSize: 12.5 }}>{data.hobbies}</div></>)}
          {data.education.some(e => e.school) && (<><div style={s.sectionTitle}>Formation</div>{data.education.filter(e => e.school).map(e => (<div key={e.id} style={{ ...s.item, marginBottom: 8 }}><div style={{ ...s.itemTitle, fontSize: 12.5 }}>{e.degree}</div><div style={{ ...s.itemSub, fontSize: 11.5 }}>{e.school}</div><div style={{ fontSize: 11, color: t.secondary }}>{e.period}{e.mention ? ` • ${e.mention}` : ""}</div></div>))}</>)}
        </div>
        <div style={s.main}>
          {data.summary && (<><div style={{ ...s.sectionTitle, marginTop: 0 }}>Profil</div><div style={{ fontSize: 13, lineHeight: 1.6 }}>{data.summary}</div></>)}
          {data.experiences.some(e => e.company) && (<><div style={s.sectionTitle}>Expériences</div>{data.experiences.filter(e => e.company).map(e => (<div key={e.id} style={s.item}><div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}><div style={s.itemTitle}>{e.role}</div><div style={{ fontSize: 11.5, color: t.secondary }}>{e.period}</div></div><div style={{ ...s.itemSub, color: t.accent }}>{e.company}</div>{e.description && <div style={s.itemDesc}>{e.description}</div>}</div>))}</>)}
        </div>
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [data, setData] = useState(initialData);
  const [template, setTemplate] = useState("classique");
  const [tab, setTab] = useState("infos");
  const [activeTip, setActiveTip] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiField, setAiField] = useState(null);
  const [page, setPage] = useState("editor");
  const [cvList, setCvList] = useState([]);
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const previewRef = useRef(null);

  const ADMIN_EMAIL = "juliusganse@gmail.com";
  const isAdmin = user?.email === ADMIN_EMAIL;
  const userPlan = isAdmin ? "pro" : (profile?.plan || "standard");
  const isPremium = isAdmin || userPlan === "premium" || userPlan === "pro";
  const isPro = isAdmin || userPlan === "pro";
  const cvLimit = isAdmin ? Infinity : PLAN_LIMITS[userPlan];

  // Vérifier session au chargement
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        loadProfile(session.user.id);
      }
      setAuthLoading(false);
    });
    supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) { setUser(session.user); loadProfile(session.user.id); }
      else { setUser(null); setProfile(null); }
    });
  }, []);

  const loadProfile = async (userId) => {
    const { data } = await supabase.from("profiles").select("*").eq("id", userId).single();
    if (data) setProfile(data);
    const { data: cvs } = await supabase.from("cvs").select("*").eq("user_id", userId);
    if (cvs) setCvList(cvs);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null); setProfile(null); setPage("editor");
  };

  // Sauvegarde automatique dans localStorage
  useEffect(() => {
    const saved = localStorage.getItem("julius_cv_data");
    if (saved) {
      try { setData(JSON.parse(saved)); } catch (e) {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("julius_cv_data", JSON.stringify(data));
  }, [data]);

  const update = useCallback((field, value) => setData(d => ({ ...d, [field]: value })), []);
  const updateExp = (id, field, value) => setData(d => ({ ...d, experiences: d.experiences.map(e => e.id === id ? { ...e, [field]: value } : e) }));
  const updateEdu = (id, field, value) => setData(d => ({ ...d, education: d.education.map(e => e.id === id ? { ...e, [field]: value } : e) }));
  const addExp = () => setData(d => ({ ...d, experiences: [...d.experiences, { id: Date.now(), company: "", role: "", period: "", description: "" }] }));
  const removeExp = (id) => setData(d => ({ ...d, experiences: d.experiences.filter(e => e.id !== id) }));
  const addEdu = () => setData(d => ({ ...d, education: [...d.education, { id: Date.now(), school: "", degree: "", period: "", mention: "" }] }));
  const removeEdu = (id) => setData(d => ({ ...d, education: d.education.filter(e => e.id !== id) }));

  const saveCV = async () => {
    if (!user) return;
    if (cvList.length >= cvLimit) {
      alert(`Ton plan ${userPlan} est limité à ${cvLimit} CV. Passe à un plan supérieur !`);
      setPage("pricing"); return;
    }
    setSaveLoading(true);
    const nom = `${data.firstName || "Prénom"} ${data.lastName || "Nom"} — ${new Date().toLocaleDateString()}`;
    const { error } = await supabase.from("cvs").insert({ user_id: user.id, nom, contenu: data });
    if (!error) {
      setSaveMsg("✅ CV sauvegardé !");
      loadProfile(user.id);
      setTimeout(() => setSaveMsg(""), 3000);
    }
    setSaveLoading(false);
  };

  const generateWithAI = async (field) => {
    if (!isPremium) { setPage("pricing"); return; }
    setAiLoading(true); setAiField(field);
    const prompts = {
      summary: `Génère un résumé professionnel de CV en français pour : titre="${data.title}", expériences="${data.experiences.map(e => `${e.role} chez ${e.company}`).join(", ")}". 3-4 phrases percutantes. Réponds UNIQUEMENT avec le texte.`,
      description: `Génère une description de poste pour CV en français pour "${data.experiences[0]?.role}" chez "${data.experiences[0]?.company}". 2-3 phrases avec verbes d'action. Réponds UNIQUEMENT avec le texte.`,
      skills: `Génère 8-10 compétences pour le poste "${data.title || "professionnel"}". Séparées par des virgules. Réponds UNIQUEMENT avec la liste.`,
    };
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1000, messages: [{ role: "user", content: prompts[field] }] }),
      });
      const result = await response.json();
      const text = result.content?.map(c => c.text || "").join("") || "";
      if (field === "summary") update("summary", text.trim());
      else if (field === "description") updateExp(data.experiences[0]?.id, "description", text.trim());
      else if (field === "skills") update("skills", text.trim());
    } catch (e) { console.error(e); }
    setAiLoading(false); setAiField(null);
  };

  const printPDF = async () => {
    const { default: jsPDF } = await import("jspdf");
    const { default: html2canvas } = await import("html2canvas");
    const { createRoot } = await import("react-dom/client");

    // Créer un div caché pour le rendu
    const tempDiv = document.createElement("div");
    tempDiv.style.cssText = "position:fixed;left:-9999px;top:0;width:794px;background:#fff;z-index:-1;";
    document.body.appendChild(tempDiv);

    const root = createRoot(tempDiv);
    root.render(<CVPreview data={data} template={template} />);

    // Attendre le rendu
    await new Promise(r => setTimeout(r, 1200));

    try {
      const canvas = await html2canvas(tempDiv, { scale: 2, useCORS: true, backgroundColor: "#ffffff", logging: false });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * pageWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      pdf.save(`${data.firstName || "Julius"}_${data.lastName || "CV"}.pdf`);
    } finally {
      root.unmount();
      document.body.removeChild(tempDiv);
    }
  };

  const inputStyle = { width: "100%", padding: "8px 12px", borderRadius: 6, border: "1.5px solid #d1d5db", fontSize: 13, fontFamily: "'DM Sans', sans-serif", outline: "none", transition: "border-color 0.2s", background: "#fff", boxSizing: "border-box" };
  const labelStyle = { fontSize: 12, fontWeight: 500, color: "#374151", display: "block", marginBottom: 4, marginTop: 12, fontFamily: "'DM Sans', sans-serif" };
  const aiBtn = (field, label) => (
    <button onClick={() => generateWithAI(field)} disabled={aiLoading}
      style={{ marginTop: 6, padding: "5px 12px", background: isPremium ? "linear-gradient(135deg, #7c3aed, #4f46e5)" : "#9ca3af", color: "#fff", border: "none", borderRadius: 6, fontSize: 11.5, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", display: "flex", alignItems: "center", gap: 5 }}>
      {aiLoading && aiField === field ? "⏳ Génération..." : isPremium ? `✨ Générer : ${label}` : `🔒 IA — Premium requis`}
    </button>
  );

  const tabs = [
    { id: "infos", label: "👤 Infos" },
    { id: "experience", label: "💼 Expériences" },
    { id: "formation", label: "🎓 Formation" },
    { id: "competences", label: "⚡ Compétences" },
    { id: "mescvs", label: "📄 Mes CV" },
  ];

  if (authLoading) return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0f0c29, #1e1b4b)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontFamily: "'DM Sans', sans-serif", fontSize: 16 }}>
      ⏳ Chargement...
    </div>
  );

  if (!user) return <AuthPage onAuth={(u) => { setUser(u); loadProfile(u.id); }} />;

  if (page === "pricing") return (
    <PricingPage
      onBack={() => setPage("editor")}
      onUpgrade={(plan) => { setProfile(p => ({ ...p, plan })); setPage("editor"); }}
      userPlan={userPlan}
      user={user}
    />
  );

  return (
    <>
      <style>{FONTS}</style>
      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; background: #f1f5f9; }
        input:focus, textarea:focus { border-color: #6366f1 !important; box-shadow: 0 0 0 3px rgba(99,102,241,0.1); }
        ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-thumb { background: #c7d2fe; border-radius: 3px; }
        @media print { #no-print { display: none !important; } }
      `}</style>
      <div style={{ display: "flex", height: "100vh", fontFamily: "'DM Sans', sans-serif", background: "#f1f5f9" }}>

        {/* SIDEBAR */}
        <div id="no-print" style={{ width: 400, minWidth: 360, display: "flex", flexDirection: "column", background: "#fff", boxShadow: "2px 0 20px rgba(0,0,0,0.08)", zIndex: 10, overflow: "hidden" }}>

          {/* Header */}
          <div style={{ background: "linear-gradient(135deg, #1e1b4b, #312e81)", padding: "16px 20px", color: "#fff" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700 }}>Julius CV</div>
                <div style={{ fontSize: 11, opacity: 0.6, marginTop: 1 }}>{user.email}</div>
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <button onClick={() => setPage("pricing")} style={{ background: isPro ? "linear-gradient(135deg, #7b2d8b, #9d4edd)" : isPremium ? "linear-gradient(135deg, #f59e0b, #d97706)" : "rgba(255,255,255,0.15)", border: "none", borderRadius: 8, padding: "5px 10px", color: "#fff", fontSize: 10, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                  {isPro ? "🚀 Pro" : isPremium ? "⭐ Premium" : "✨ Premium"}
                </button>
                <button onClick={handleLogout} style={{ background: "rgba(255,255,255,0.1)", border: "none", borderRadius: 8, padding: "5px 10px", color: "#fff", fontSize: 10, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                  Déconnexion
                </button>
              </div>
            </div>
            {/* CV count */}
            <div style={{ marginTop: 10, background: "rgba(255,255,255,0.08)", borderRadius: 8, padding: "6px 10px", fontSize: 11, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span>📄 CV sauvegardés : {cvList.length} / {cvLimit === Infinity ? "∞" : cvLimit}</span>
              <button onClick={saveCV} disabled={saveLoading} style={{ background: "rgba(255,255,255,0.2)", border: "none", borderRadius: 6, padding: "3px 10px", color: "#fff", fontSize: 11, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                {saveLoading ? "⏳" : "💾 Sauvegarder"}
              </button>
            </div>
            {saveMsg && <div style={{ marginTop: 6, fontSize: 11, color: "#6ee7b7" }}>{saveMsg}</div>}
          </div>

          {/* Onglets */}
          <div style={{ display: "flex", borderBottom: "2px solid #e5e7eb", background: "#fafafa" }}>
            {tabs.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                style={{ flex: 1, padding: "10px 4px", border: "none", background: "none", fontSize: 11, fontWeight: tab === t.id ? 700 : 400, color: tab === t.id ? "#4f46e5" : "#6b7280", borderBottom: tab === t.id ? "2px solid #4f46e5" : "2px solid transparent", marginBottom: -2, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                {t.label}
              </button>
            ))}
          </div>

          {/* Formulaire */}
          <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px" }}>

            {tab === "infos" && (
              <div>
                <label style={labelStyle}>Photo (PNG ou JPG)</label>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
                  {data.photo && <img src={data.photo} alt="Aperçu" style={{ width: 56, height: 56, borderRadius: "50%", objectFit: "cover", border: "2px solid #6366f1" }} />}
                  <label style={{ display: "inline-block", padding: "7px 14px", background: "linear-gradient(135deg, #6366f1, #4f46e5)", color: "#fff", borderRadius: 6, cursor: "pointer", fontSize: 12, fontFamily: "'DM Sans', sans-serif" }}>
                    📷 Choisir une photo
                    <input type="file" accept="image/png,image/jpeg" style={{ display: "none" }} onChange={e => {
                      const file = e.target.files[0]; if (!file) return;
                      const reader = new FileReader();
                      reader.onload = ev => update("photo", ev.target.result);
                      reader.readAsDataURL(file);
                    }} />
                  </label>
                  {data.photo && <button onClick={() => update("photo", null)} style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: 12 }}>✕</button>}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <div><label style={labelStyle}>Prénom</label><input style={inputStyle} value={data.firstName} onChange={e => update("firstName", e.target.value)} placeholder="Julius" /></div>
                  <div><label style={labelStyle}>Nom</label><input style={inputStyle} value={data.lastName} onChange={e => update("lastName", e.target.value)} placeholder="Doe" /></div>
                </div>
                <label style={labelStyle}>Date de naissance</label>
                <input type="date" style={inputStyle} value={data.birthdate} onChange={e => update("birthdate", e.target.value)} />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <div><label style={labelStyle}>Pays</label><input style={inputStyle} value={data.country} onChange={e => update("country", e.target.value)} placeholder="Bénin" /></div>
                  <div><label style={labelStyle}>Ville</label><input style={inputStyle} value={data.city} onChange={e => update("city", e.target.value)} placeholder="Cotonou" /></div>
                </div>
                <label style={labelStyle}>Adresse</label>
                <input style={inputStyle} value={data.address} onChange={e => update("address", e.target.value)} placeholder="Quartier, rue..." />
                <label style={labelStyle}>Numéro de téléphone</label>
                <input style={inputStyle} value={data.phone} onChange={e => update("phone", e.target.value)} placeholder="+229 00 00 00 00" />
                <label style={labelStyle}>Adresse mail</label>
                <input style={inputStyle} value={data.email} onChange={e => update("email", e.target.value)} placeholder="julius@email.com" />
                <label style={labelStyle}>Profession</label>
                <input style={inputStyle} value={data.title} onChange={e => update("title", e.target.value)} placeholder="Développeur Web" />
                <label style={labelStyle}>LinkedIn</label>
                <input style={inputStyle} value={data.linkedin} onChange={e => update("linkedin", e.target.value)} placeholder="linkedin.com/in/julius" />
                <label style={labelStyle}>Résumé professionnel</label>
                <textarea style={{ ...inputStyle, minHeight: 90, resize: "vertical" }} value={data.summary} onChange={e => update("summary", e.target.value)} placeholder="Décris ton profil..." onFocus={() => setActiveTip("summary")} onBlur={() => setActiveTip(null)} />
                {activeTip === "summary" && <TipBox field="summary" />}
                {aiBtn("summary", "mon résumé")}
              </div>
            )}

            {tab === "experience" && (
              <div>
                {data.experiences.map((exp, idx) => (
                  <div key={exp.id} style={{ background: "#f8fafc", borderRadius: 8, padding: "14px", marginBottom: 12, border: "1px solid #e2e8f0" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: "#4f46e5" }}>Expérience {idx + 1}</div>
                      {idx > 0 && <button onClick={() => removeExp(exp.id)} style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: 16 }}>✕</button>}
                    </div>
                    <label style={labelStyle}>Entreprise</label>
                    <input style={inputStyle} value={exp.company} onChange={e => updateExp(exp.id, "company", e.target.value)} placeholder="Nom de l'entreprise" />
                    <label style={labelStyle}>Poste</label>
                    <input style={inputStyle} value={exp.role} onChange={e => updateExp(exp.id, "role", e.target.value)} placeholder="Ton poste" />
                    <label style={labelStyle}>Période</label>
                    <input style={inputStyle} value={exp.period} onChange={e => updateExp(exp.id, "period", e.target.value)} placeholder="Jan 2022 – Aujourd'hui" />
                    <label style={labelStyle}>Description</label>
                    <textarea style={{ ...inputStyle, minHeight: 70, resize: "vertical" }} value={exp.description} onChange={e => updateExp(exp.id, "description", e.target.value)} placeholder="Tes missions et réalisations..." onFocus={() => setActiveTip("experience")} onBlur={() => setActiveTip(null)} />
                    {activeTip === "experience" && <TipBox field="experience" />}
                    {idx === 0 && aiBtn("description", "la description")}
                  </div>
                ))}
                <button onClick={addExp} style={{ width: "100%", padding: "8px", border: "1.5px dashed #6366f1", background: "none", borderRadius: 8, color: "#6366f1", cursor: "pointer", fontSize: 13, fontFamily: "'DM Sans', sans-serif" }}>+ Ajouter une expérience</button>
              </div>
            )}

            {tab === "formation" && (
              <div>
                {data.education.map((edu, idx) => (
                  <div key={edu.id} style={{ background: "#f8fafc", borderRadius: 8, padding: "14px", marginBottom: 12, border: "1px solid #e2e8f0" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: "#4f46e5" }}>Formation {idx + 1}</div>
                      {idx > 0 && <button onClick={() => removeEdu(edu.id)} style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: 16 }}>✕</button>}
                    </div>
                    <label style={labelStyle}>École / Université</label>
                    <input style={inputStyle} value={edu.school} onChange={e => updateEdu(edu.id, "school", e.target.value)} placeholder="Université de..." />
                    <label style={labelStyle}>Diplôme</label>
                    <input style={inputStyle} value={edu.degree} onChange={e => updateEdu(edu.id, "degree", e.target.value)} placeholder="Licence, Master..." />
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                      <div><label style={labelStyle}>Période</label><input style={inputStyle} value={edu.period} onChange={e => updateEdu(edu.id, "period", e.target.value)} placeholder="2019 – 2021" /></div>
                      <div><label style={labelStyle}>Mention</label><input style={inputStyle} value={edu.mention} onChange={e => updateEdu(edu.id, "mention", e.target.value)} placeholder="Très bien" /></div>
                    </div>
                  </div>
                ))}
                <button onClick={addEdu} style={{ width: "100%", padding: "8px", border: "1.5px dashed #6366f1", background: "none", borderRadius: 8, color: "#6366f1", cursor: "pointer", fontSize: 13, fontFamily: "'DM Sans', sans-serif" }}>+ Ajouter une formation</button>
              </div>
            )}

            {tab === "competences" && (
              <div>
                <label style={labelStyle}>Compétences (séparées par des virgules)</label>
                <textarea style={{ ...inputStyle, minHeight: 80, resize: "vertical" }} value={data.skills} onChange={e => update("skills", e.target.value)} placeholder="React, Node.js, Python..." onFocus={() => setActiveTip("skills")} onBlur={() => setActiveTip(null)} />
                {activeTip === "skills" && <TipBox field="skills" />}
                {aiBtn("skills", "mes compétences")}
                <label style={labelStyle}>Langues (séparées par des virgules)</label>
                <input style={inputStyle} value={data.languages} onChange={e => update("languages", e.target.value)} placeholder="Français natif, Anglais B2..." />
                <label style={labelStyle}>Loisirs</label>
                <textarea style={{ ...inputStyle, minHeight: 70, resize: "vertical" }} value={data.hobbies} onChange={e => update("hobbies", e.target.value)} placeholder="Lecture, Sport, Musique..." />
              </div>
            )}

            {tab === "mescvs" && (
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#1e1b4b", marginBottom: 16 }}>
                  📄 Mes CV sauvegardés ({cvList.length} / {cvLimit === Infinity ? "∞" : cvLimit})
                </div>
                {cvList.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "40px 20px", color: "#9ca3af", fontSize: 13 }}>
                    <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
                    <div>Aucun CV sauvegardé pour l'instant.</div>
                    <div style={{ marginTop: 6, fontSize: 12 }}>Remplis le formulaire et clique sur 💾 Sauvegarder !</div>
                  </div>
                ) : (
                  cvList.map((cv, idx) => (
                    <div key={cv.id} style={{ background: "#f8fafc", borderRadius: 10, padding: "14px 16px", marginBottom: 12, border: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "#1e1b4b" }}>CV #{idx + 1}</div>
                        <div style={{ fontSize: 11.5, color: "#6b7280", marginTop: 2 }}>{cv.nom}</div>
                        <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>
                          {new Date(cv.created_at).toLocaleDateString("fr-FR")}
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button onClick={() => { setData(cv.contenu); setTab("infos"); }}
                          style={{ padding: "6px 10px", background: "linear-gradient(135deg, #6366f1, #4f46e5)", color: "#fff", border: "none", borderRadius: 6, fontSize: 11, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                          ✏️ Modifier
                        </button>
                        <button onClick={async () => {
                          setData(cv.contenu);
                          await new Promise(r => setTimeout(r, 500));
                          printPDF();
                        }}
                          style={{ padding: "6px 10px", background: "linear-gradient(135deg, #1e1b4b, #312e81)", color: "#fff", border: "none", borderRadius: 6, fontSize: 11, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                          📄 PDF
                        </button>
                        <button onClick={async () => {
                          if (window.confirm("Supprimer ce CV ?")) {
                            await supabase.from("cvs").delete().eq("id", cv.id);
                            loadProfile(user.id);
                          }
                        }}
                          style={{ padding: "6px 10px", background: "#fee2e2", color: "#ef4444", border: "none", borderRadius: 6, fontSize: 11, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Bas de la sidebar */}
          <div id="no-print" style={{ borderTop: "1px solid #e5e7eb", padding: "12px 20px", background: "#fafafa" }}>
            <div style={{ fontSize: 11.5, fontWeight: 600, color: "#374151", marginBottom: 8 }}>Modèle de CV</div>
            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
              {Object.entries(TEMPLATES).map(([key, t]) => {
                const locked = !isPremium && key !== "classique";
                return (
                  <button key={key} onClick={() => locked ? setPage("pricing") : setTemplate(key)}
                    style={{ flex: 1, padding: "6px 4px", border: template === key ? `2px solid ${t.accent}` : "2px solid #e5e7eb", borderRadius: 6, background: template === key ? `${t.accent}10` : "#fff", cursor: "pointer", fontSize: 11, fontWeight: template === key ? 700 : 400, color: template === key ? t.accent : "#6b7280", fontFamily: "'DM Sans', sans-serif" }}>
                    {locked ? "🔒 " : ""}{t.name}
                  </button>
                );
              })}
            </div>
            <button onClick={() => setShowPreview(true)} style={{ width: "100%", padding: "10px", background: "linear-gradient(135deg, #6366f1, #4f46e5)", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", marginBottom: 8 }}>
              👁️ Voir mon CV
            </button>
            <button onClick={printPDF} style={{ width: "100%", padding: "10px", background: "linear-gradient(135deg, #1e1b4b, #312e81)", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
              📄 Télécharger en PDF
            </button>
          </div>
        </div>

        {/* MODAL PREVIEW */}
        {showPreview && (
          <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.85)", zIndex: 1000, display: "flex", flexDirection: "column", overflow: "hidden" }}>
            {/* Header modal */}
            <div style={{ background: "linear-gradient(135deg, #1e1b4b, #312e81)", padding: "14px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 700, color: "#fff" }}>Aperçu de ton CV</div>
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={printPDF} style={{ background: "linear-gradient(135deg, #f59e0b, #d97706)", border: "none", borderRadius: 8, padding: "8px 14px", color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                  📄 Télécharger PDF
                </button>
                <button onClick={() => setShowPreview(false)} style={{ background: "rgba(255,255,255,0.15)", border: "none", borderRadius: 8, padding: "8px 14px", color: "#fff", fontSize: 12, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                  ✕ Fermer
                </button>
              </div>
            </div>
            {/* CV dans la modal */}
            <div style={{ flex: 1, overflowY: "auto", padding: "20px" }}>
              <div id="cv-preview" style={{ width: "100%", maxWidth: 720, margin: "0 auto" }}>
                <CVPreview data={data} template={template} />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}