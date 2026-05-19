import { useState, useCallback, useEffect } from "react";
import { supabase } from "./supabase";

const FONTS = "@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Crimson+Pro:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&family=Montserrat:wght@300;400;600;700&display=swap');";

const ADMIN_EMAIL = "juliusganse@gmail.com";

const TEMPLATES = {
  classique: { name: "Classique", accent: "#1a365d", bg: "#ffffff", text: "#1a1a2e", secondary: "#4a5568", headerBg: "#1a365d", headerText: "#ffffff", sidebar: "#f0f4f8" },
  moderne: { name: "Moderne", accent: "#2d6a4f", bg: "#f8f9fa", text: "#1b1b2f", secondary: "#555", headerBg: "#2d6a4f", headerText: "#ffffff", sidebar: "#e8f5e9" },
  elegantViolet: { name: "Élégant Violet", accent: "#7b2d8b", bg: "#fefefe", text: "#1a1a1a", secondary: "#666", headerBg: "#7b2d8b", headerText: "#ffffff", sidebar: "#f5f0f8" },
  elegantOr: { name: "Élégant Or", accent: "#b7791f", bg: "#fffff8", text: "#1a1a1a", secondary: "#7a6a4f", headerBg: "#b7791f", headerText: "#ffffff", sidebar: "#fdf8e1" },
  elegantNoir: { name: "Élégant Noir", accent: "#a0aec0", bg: "#1a1a1a", text: "#e2e8f0", secondary: "#a0aec0", headerBg: "#000000", headerText: "#e2e8f0", sidebar: "#2d2d2d" },
  rouge: { name: "Rouge Passion", accent: "#c53030", bg: "#fff5f5", text: "#1a1a1a", secondary: "#666", headerBg: "#c53030", headerText: "#ffffff", sidebar: "#fff0f0" },
  ocean: { name: "Océan", accent: "#0077b6", bg: "#f0f8ff", text: "#1a1a2e", secondary: "#555", headerBg: "#0077b6", headerText: "#ffffff", sidebar: "#e0f0ff" },
  minimaliste: { name: "Minimaliste", accent: "#333333", bg: "#ffffff", text: "#333333", secondary: "#777", headerBg: "#333333", headerText: "#ffffff", sidebar: "#f5f5f5" },
  nature: { name: "Nature", accent: "#386641", bg: "#f9fbf2", text: "#1a2e1a", secondary: "#556", headerBg: "#386641", headerText: "#ffffff", sidebar: "#eaf4e0" },
  sunset: { name: "Sunset", accent: "#e85d04", bg: "#fff8f0", text: "#1a1a1a", secondary: "#777", headerBg: "#e85d04", headerText: "#ffffff", sidebar: "#fff0e0" },
  royal: { name: "Royal", accent: "#4a1942", bg: "#fdf6ff", text: "#1a1a1a", secondary: "#666", headerBg: "#4a1942", headerText: "#ffffff", sidebar: "#f5eaff" },
  glacier: { name: "Glacier", accent: "#48cae4", bg: "#f0fbff", text: "#1a2e3a", secondary: "#557", headerBg: "#48cae4", headerText: "#ffffff", sidebar: "#e0f8ff" },
  terracotta: { name: "Terracotta", accent: "#9c4221", bg: "#fdf2ee", text: "#2d1a14", secondary: "#7a5", headerBg: "#9c4221", headerText: "#ffffff", sidebar: "#fbe8df" },
  ardoise: { name: "Ardoise", accent: "#475569", bg: "#f8fafc", text: "#1e293b", secondary: "#64748b", headerBg: "#475569", headerText: "#ffffff", sidebar: "#f1f5f9" },
  nuit: { name: "Nuit Étoilée", accent: "#818cf8", bg: "#0f172a", text: "#e2e8f0", secondary: "#94a3b8", headerBg: "#1e1b4b", headerText: "#e2e8f0", sidebar: "#1e293b" },
};

const PLANS = {
  paypercv: { name: "Pay-per-CV", cvLimit: Infinity, price: 500 },
  illimite: { name: "Illimité", cvLimit: Infinity, price: 5000 },
};

const initialData = {
  photo: null, firstName: "", lastName: "", birthdate: "", country: "", city: "",
  address: "", phone: "", email: "", title: "", linkedin: "", summary: "",
  experiences: [{ id: 1, company: "", role: "", period: "", description: "" }],
  education: [{ id: 1, school: "", degree: "", period: "", mention: "" }],
  skills: "", languages: "", hobbies: "",
};

const TIPS = {
  summary: ["Commence par ton titre et tes années d'expérience.", "Mentionne 2-3 compétences clés.", "Reste concis : 3 à 5 lignes max."],
  experience: ["Utilise des verbes d'action : développé, piloté, créé…", "Quantifie tes résultats : +30% de ventes…", "Mets en avant les réalisations."],
  skills: ["Sépare compétences techniques et soft skills.", "Indique ton niveau.", "Mets en avant les compétences du poste visé."],
};

// ─── AUTH PAGE ────────────────────────────────────────────────────────────────
function AuthPage({ onAuth }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const inputS = { width: "100%", padding: "10px 14px", borderRadius: 8, border: "1.5px solid rgba(255,255,255,0.2)", fontSize: 14, fontFamily: "'DM Sans', sans-serif", outline: "none", boxSizing: "border-box", marginTop: 4, background: "rgba(255,255,255,0.08)", color: "#fff" };

  const handleSubmit = async () => {
    setError(""); setLoading(true);
    if (mode === "login") {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError("Email ou mot de passe incorrect.");
      else onAuth(data.user);
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
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, fontWeight: 700, color: "#fff", letterSpacing: "-1px" }}>Julius CV</div>
          <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, marginTop: 4, fontStyle: "italic" }}>Créez votre CV professionnel</div>
        </div>
        <div style={{ display: "flex", background: "rgba(255,255,255,0.08)", borderRadius: 10, padding: 4, marginBottom: 24 }}>
          {["login", "signup"].map(m => (
            <button key={m} onClick={() => { setMode(m); setError(""); }}
              style={{ flex: 1, padding: "8px", border: "none", borderRadius: 8, background: mode === m ? "#fff" : "none", color: mode === m ? "#1e1b4b" : "rgba(255,255,255,0.6)", fontWeight: mode === m ? 700 : 400, cursor: "pointer", fontSize: 13, fontFamily: "'DM Sans', sans-serif" }}>
              {m === "login" ? "Connexion" : "Inscription"}
            </button>
          ))}
        </div>
        {error && <div style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 8, padding: "10px 14px", color: "#fca5a5", fontSize: 13, marginBottom: 16 }}>{error}</div>}
        <div style={{ marginBottom: 12 }}>
          <label style={{ color: "rgba(255,255,255,0.7)", fontSize: 12 }}>Adresse email</label>
          <input style={inputS} type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="julius@email.com" />
        </div>
        <div style={{ marginBottom: 24 }}>
          <label style={{ color: "rgba(255,255,255,0.7)", fontSize: 12 }}>Mot de passe</label>
          <input style={inputS} type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
        </div>
        <button onClick={handleSubmit} disabled={loading}
          style={{ width: "100%", padding: "12px", background: loading ? "rgba(99,102,241,0.5)" : "linear-gradient(135deg, #6366f1, #4f46e5)", color: "#fff", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: loading ? "wait" : "pointer", fontFamily: "'DM Sans', sans-serif" }}>
          {loading ? "⏳ Chargement..." : mode === "login" ? "Se connecter" : "Créer mon compte"}
        </button>
      </div>
    </div>
  </>
);

// ─── TEMPLATE SELECTOR ────────────────────────────────────────────────────────
function TemplateSelectorPage({ onSelect, selectedTemplate }) {
  return (
    <>
      <style>{FONTS}</style>
      <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0f0c29, #1e1b4b, #302b63)", fontFamily: "'DM Sans', sans-serif", padding: "32px 20px" }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, fontWeight: 700, color: "#fff" }}>Julius CV</div>
          <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 15, marginTop: 8 }}>Choisissez votre modèle de CV</div>
          <div style={{ display: "inline-block", background: "rgba(99,102,241,0.3)", border: "1px solid rgba(99,102,241,0.5)", borderRadius: 20, padding: "4px 16px", color: "#a5b4fc", fontSize: 12, marginTop: 10 }}>
            🎨 15 modèles disponibles · 1 gratuit au choix
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 14, maxWidth: 900, margin: "0 auto" }}>
          {Object.entries(TEMPLATES).map(([key, t]) => (
            <div key={key} onClick={() => onSelect(key)}
              style={{ background: t.bg, borderRadius: 12, overflow: "hidden", cursor: "pointer", border: selectedTemplate === key ? "3px solid #6366f1" : "2px solid rgba(255,255,255,0.1)", boxShadow: selectedTemplate === key ? "0 0 20px rgba(99,102,241,0.5)" : "0 4px 12px rgba(0,0,0,0.3)", transform: selectedTemplate === key ? "scale(1.04)" : "scale(1)", transition: "all 0.2s" }}>
              <div style={{ background: t.headerBg, padding: "10px 10px 8px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                  <div style={{ width: 24, height: 24, borderRadius: "50%", background: "rgba(255,255,255,0.3)" }} />
                  <div>
                    <div style={{ background: "rgba(255,255,255,0.8)", height: 5, width: 55, borderRadius: 3, marginBottom: 3 }} />
                    <div style={{ background: "rgba(255,255,255,0.5)", height: 3, width: 35, borderRadius: 3 }} />
                  </div>
                </div>
              </div>
              <div style={{ padding: "7px 10px", background: t.sidebar }}>
                {[65, 45, 55].map((w, i) => <div key={i} style={{ background: t.accent + "40", height: 3, width: `${w}%`, borderRadius: 3, marginBottom: 3 }} />)}
              </div>
              <div style={{ padding: "5px 10px 9px", background: t.bg }}>
                {[75, 55, 85, 65].map((w, i) => <div key={i} style={{ background: t.text + "20", height: 2.5, width: `${w}%`, borderRadius: 3, marginBottom: 3 }} />)}
              </div>
              <div style={{ padding: "5px 8px", background: t.bg, borderTop: `1px solid ${t.accent}20`, textAlign: "center" }}>
                <div style={{ fontSize: 10.5, fontWeight: 600, color: t.accent }}>{t.name}</div>
              </div>
            </div>
          ))}
        </div>
        {selectedTemplate && (
          <div style={{ textAlign: "center", marginTop: 28 }}>
            <button onClick={() => onSelect(selectedTemplate, true)}
              style={{ padding: "13px 36px", background: "linear-gradient(135deg, #6366f1, #4f46e5)", color: "#fff", border: "none", borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", boxShadow: "0 8px 25px rgba(99,102,241,0.4)" }}>
              ✅ Utiliser — {TEMPLATES[selectedTemplate]?.name}
            </button>
          </div>
        )}
      </div>
    </>
  );
}

// ─── choix du plan ─────────────────────────────────────────────────────────────
function PricingPage({ onBack, onUpgrade, userPlan, user, payMode }) {
  const [payLoading, setPayLoading] = useState(false);

  const plans = [
    {
      name: "Pay-per-CV", price: "500 F", period: "/ CV", badge: "💳 FLEXIBLE",
      features: [{ label: "1 CV supplémentaire", ok: true }, { label: "Tous les modèles", ok: true }, { label: "Export PDF", ok: true }, { label: "CV sauvegardé", ok: true }, { label: "CV illimités", ok: false }],
      cta: payMode ? "💳 Payer 500F et télécharger" : "Faire un CV",
      active: false, highlight: true, montant: 500, planKey: "paypercv",
    },
    {
      name: "Illimité", price: "5 000 F", period: "/ mois", badge: "♾️ ILLIMITÉ",
      features: [{ label: "CV illimités", ok: true }, { label: "Tous les modèles", ok: true }, { label: "Export PDF illimité", ok: true }, { label: "CV sauvegardés", ok: true }, { label: "Génération IA", ok: true }],
      cta: userPlan === "illimite" ? "✅ Plan actuel" : "S'abonner",
      active: userPlan === "illimite", highlight: false, montant: 5000, planKey: "illimite",
    },
  ];

  const handlePay = (plan) => {
    if (plan.active) return;
    setPayLoading(true);
    try {
      window.FedaPay.init({
        public_key: "pk_live_LInjWuIJS2butkQ82sKWsG9N",
        transaction: { amount: plan.montant, description: `Julius CV — ${plan.name}` },
        customer: { email: user?.email || "", firstname: "Client", lastname: "Julius CV" },
        onComplete: async function (resp) {
          if (resp.reason === window.FedaPay.CHECKOUT_COMPLETED) {
            if (plan.planKey === "illimite") {
              await supabase.from("profiles").update({ plan: "illimite" }).eq("id", user.id);
              onUpgrade("illimite", false);
            } else {
              onUpgrade("paypercv", true);
            }
          }
          setPayLoading(false);
        }
      }).open();
    } catch (e) { console.error(e); setPayLoading(false); }
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0f0c29, #1e1b4b, #302b63)", display: "flex", flexDirection: "column", alignItems: "center", padding: "40px 20px", fontFamily: "'DM Sans', sans-serif" }}>
      <button onClick={onBack} style={{ alignSelf: "flex-start", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", borderRadius: 8, padding: "8px 16px", cursor: "pointer", fontSize: 13, marginBottom: 32 }}>← Retour</button>
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 34, fontWeight: 700, color: "#fff" }}>Julius CV</div>
        <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 15, marginTop: 8 }}>{payMode ? "💳 Payez 500F pour télécharger ce CV" : "Choisissez votre plan"}</div>
        <div style={{ display: "inline-block", background: "rgba(99,102,241,0.3)", border: "1px solid rgba(99,102,241,0.5)", borderRadius: 20, padding: "4px 16px", color: "#a5b4fc", fontSize: 12, marginTop: 10 }}>🔒 MTN Mobile Money</div>
      </div>
      <div style={{ display: "flex", gap: 20, flexWrap: "wrap", justifyContent: "center", maxWidth: 960, width: "100%" }}>
        {plans.map((plan) => (
          <div key={plan.name} style={{ background: plan.highlight ? "linear-gradient(135deg, #4f46e5, #7c3aed)" : "rgba(255,255,255,0.05)", border: plan.highlight ? "2px solid #818cf8" : "1px solid rgba(255,255,255,0.1)", borderRadius: 16, padding: "28px 24px", width: 260, backdropFilter: "blur(12px)", boxShadow: plan.highlight ? "0 20px 60px rgba(79,70,229,0.4)" : "0 4px 20px rgba(0,0,0,0.2)", position: "relative" }}>
            {plan.badge && <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: plan.highlight ? "linear-gradient(135deg, #f59e0b, #d97706)" : "linear-gradient(135deg, #7b2d8b, #9d4edd)", borderRadius: 20, padding: "4px 16px", fontSize: 11, fontWeight: 700, color: "#fff", whiteSpace: "nowrap" }}>{plan.badge}</div>}
            <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "2px", marginBottom: 8 }}>{plan.name}</div>
            <div style={{ color: "#fff", fontSize: 30, fontWeight: 800, fontFamily: "'Playfair Display', serif" }}>{plan.price}<span style={{ fontSize: 13, fontWeight: 400, opacity: 0.7 }}>{plan.period}</span></div>
            <div style={{ height: 1, background: "rgba(255,255,255,0.15)", margin: "14px 0" }} />
            <div style={{ marginBottom: 20 }}>
              {plan.features.map((f, i) => <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, fontSize: 12.5, color: f.ok ? "#fff" : "rgba(255,255,255,0.3)" }}><span>{f.ok ? "✅" : "❌"}</span>{f.label}</div>)}
            </div>
            <button onClick={() => handlePay(plan)} disabled={plan.active || payLoading}
              style={{ width: "100%", padding: "11px", borderRadius: 10, border: "none", fontSize: 12.5, fontWeight: 600, cursor: plan.active ? "default" : "pointer", background: plan.active ? "rgba(255,255,255,0.15)" : plan.highlight ? "#fff" : "rgba(255,255,255,0.1)", color: plan.highlight && !plan.active ? "#4f46e5" : "#fff", fontFamily: "'DM Sans', sans-serif" }}>
              {payLoading ? "⏳ Traitement..." : plan.cta}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── TIP BOX ──────────────────────────────────────────────────────────────────
function TipBox({ field }) {
  const tips = TIPS[field];
  if (!tips) return null;
  return (
    <div style={{ background: "#fffbeb", border: "1px solid #f59e0b", borderRadius: 8, padding: "10px 14px", marginTop: 6, fontSize: 12, color: "#92400e" }}>
      <div style={{ fontWeight: 600, marginBottom: 4, fontSize: 11, textTransform: "uppercase" }}>💡 Conseils</div>
      <ul style={{ margin: 0, paddingLeft: 16 }}>{tips.map((t, i) => <li key={i} style={{ marginBottom: 2 }}>{t}</li>)}</ul>
    </div>
  );
}

// ─── CV PREVIEW ───────────────────────────────────────────────────────────────
function CVPreview({ data, templateKey }) {
  const t = TEMPLATES[templateKey] || TEMPLATES.classique;
  return (
    <div style={{ fontFamily: "'Crimson Pro', Georgia, serif", background: t.bg, color: t.text, fontSize: 13, lineHeight: 1.5, minHeight: 800 }}>
      <div style={{ background: t.headerBg, color: t.headerText, padding: "28px 32px 20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {data.photo && <img src={data.photo} alt="Photo" style={{ width: 72, height: 72, borderRadius: "50%", objectFit: "cover", border: `3px solid ${t.headerText}40`, flexShrink: 0 }} />}
          <div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 700 }}>{data.firstName || "Prénom"} {data.lastName || "Nom"}</div>
            <div style={{ fontSize: 13, marginTop: 4, opacity: 0.85, fontStyle: "italic" }}>{data.title || "Profession"}</div>
            <div style={{ display: "flex", gap: 14, marginTop: 10, flexWrap: "wrap", fontSize: 11.5, opacity: 0.9 }}>
              {data.email && <span>✉ {data.email}</span>}
              {data.phone && <span>📞 {data.phone}</span>}
              {data.city && <span>📍 {data.city}{data.country ? `, ${data.country}` : ""}</span>}
              {data.birthdate && <span>🎂 {data.birthdate}</span>}
            </div>
          </div>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr" }}>
        <div style={{ background: t.sidebar, padding: "20px 16px", borderRight: `2px solid ${t.accent}20` }}>
          {data.skills && (<><div style={{ fontFamily: "'Playfair Display', serif", fontSize: 12, fontWeight: 700, color: t.accent, textTransform: "uppercase", letterSpacing: "2px", borderBottom: `1.5px solid ${t.accent}`, paddingBottom: 3, marginBottom: 8, marginTop: 0 }}>Compétences</div><div>{data.skills.split(",").map((sk, i) => <span key={i} style={{ display: "inline-block", background: `${t.accent}15`, color: t.accent, borderRadius: 20, padding: "2px 8px", fontSize: 11, margin: "2px 3px 2px 0", fontWeight: 500 }}>{sk.trim()}</span>)}</div></>)}
          {data.languages && (<><div style={{ fontFamily: "'Playfair Display', serif", fontSize: 12, fontWeight: 700, color: t.accent, textTransform: "uppercase", letterSpacing: "2px", borderBottom: `1.5px solid ${t.accent}`, paddingBottom: 3, marginBottom: 8, marginTop: 16 }}>Langues</div><div>{data.languages.split(",").map((l, i) => <span key={i} style={{ display: "inline-block", background: `${t.accent}15`, color: t.accent, borderRadius: 20, padding: "2px 8px", fontSize: 11, margin: "2px 3px 2px 0", fontWeight: 500 }}>{l.trim()}</span>)}</div></>)}
          {data.hobbies && (<><div style={{ fontFamily: "'Playfair Display', serif", fontSize: 12, fontWeight: 700, color: t.accent, textTransform: "uppercase", letterSpacing: "2px", borderBottom: `1.5px solid ${t.accent}`, paddingBottom: 3, marginBottom: 8, marginTop: 16 }}>Loisirs</div><div style={{ fontSize: 12 }}>{data.hobbies}</div></>)}
          {data.education.some(e => e.school) && (<><div style={{ fontFamily: "'Playfair Display', serif", fontSize: 12, fontWeight: 700, color: t.accent, textTransform: "uppercase", letterSpacing: "2px", borderBottom: `1.5px solid ${t.accent}`, paddingBottom: 3, marginBottom: 8, marginTop: 16 }}>Formation</div>{data.education.filter(e => e.school).map(e => (<div key={e.id} style={{ marginBottom: 8 }}><div style={{ fontWeight: 600, fontSize: 12 }}>{e.degree}</div><div style={{ fontSize: 11, fontStyle: "italic", color: t.secondary }}>{e.school}</div><div style={{ fontSize: 10.5, color: t.secondary }}>{e.period}{e.mention ? ` • ${e.mention}` : ""}</div></div>))}</>)}
        </div>
        <div style={{ padding: "20px 24px" }}>
          {data.summary && (<><div style={{ fontFamily: "'Playfair Display', serif", fontSize: 12, fontWeight: 700, color: t.accent, textTransform: "uppercase", letterSpacing: "2px", borderBottom: `1.5px solid ${t.accent}`, paddingBottom: 3, marginBottom: 8, marginTop: 0 }}>Profil</div><div style={{ fontSize: 12.5, lineHeight: 1.6 }}>{data.summary}</div></>)}
          {data.experiences.some(e => e.company) && (<><div style={{ fontFamily: "'Playfair Display', serif", fontSize: 12, fontWeight: 700, color: t.accent, textTransform: "uppercase", letterSpacing: "2px", borderBottom: `1.5px solid ${t.accent}`, paddingBottom: 3, marginBottom: 8, marginTop: 16 }}>Expériences</div>{data.experiences.filter(e => e.company).map(e => (<div key={e.id} style={{ marginBottom: 10 }}><div style={{ display: "flex", justifyContent: "space-between" }}><div style={{ fontWeight: 600, fontSize: 13 }}>{e.role}</div><div style={{ fontSize: 11, color: t.secondary }}>{e.period}</div></div><div style={{ fontSize: 11.5, color: t.accent, fontStyle: "italic" }}>{e.company}</div>{e.description && <div style={{ fontSize: 12, marginTop: 2 }}>{e.description}</div>}</div>))}</>)}
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
  const [data, setData] = useState(() => { try { const s = localStorage.getItem("julius_cv_data"); return s ? JSON.parse(s) : initialData; } catch { return initialData; } });
  const [templateKey, setTemplateKey] = useState(() => localStorage.getItem("julius_cv_template") || null);
  const [tab, setTab] = useState("infos");
  const [activeTip, setActiveTip] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiField, setAiField] = useState(null);
  const [page, setPage] = useState(() => localStorage.getItem("julius_cv_page") || "templates");
  const [cvList, setCvList] = useState([]);
  const [saveMsg, setSaveMsg] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [payMode, setPayMode] = useState(false);

  const isAdmin = user?.email === ADMIN_EMAIL;
  const cvCount = isAdmin ? 0 : (profile?.cv_count || 0);
  const canDownloadFree = isAdmin || userPlan === "illimite" || cvCount < 1;

  useEffect(() => { try { localStorage.setItem("julius_cv_data", JSON.stringify(data)); } catch { } }, [data]);
  useEffect(() => { if (templateKey) localStorage.setItem("julius_cv_template", templateKey); }, [templateKey]);
  useEffect(() => { localStorage.setItem("julius_cv_page", page); }, [page]);
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) { setUser(session.user); loadProfile(session.user.id); }
      setAuthLoading(false);
    });
    supabase.auth.onAuthStateChange((_e, session) => {
      if (session?.user) { setUser(session.user); loadProfile(session.user.id); }
      else { setUser(null); setProfile(null); }
    });
  }, []);

  const loadProfile = async (userId) => {
    const { data: p } = await supabase.from("profiles").select("*").eq("id", userId).single();
    if (p) { setProfile(p); if (p.selected_template) setTemplateKey(p.selected_template); }
    const { data: cvs } = await supabase.from("cvs").select("*").eq("user_id", userId).order("created_at", { ascending: false });
    if (cvs) setCvList(cvs);
  };

  const handleLogout = async () => { await supabase.auth.signOut(); setUser(null); setProfile(null); localStorage.setItem("julius_cv_page", "templates"); setPage("templates"); };
  const update = useCallback((field, value) => setData(d => ({ ...d, [field]: value })), []);
  const updateExp = (id, field, value) => setData(d => ({ ...d, experiences: d.experiences.map(e => e.id === id ? { ...e, [field]: value } : e) }));
  const updateEdu = (id, field, value) => setData(d => ({ ...d, education: d.education.map(e => e.id === id ? { ...e, [field]: value } : e) }));
  const addExp = () => setData(d => ({ ...d, experiences: [...d.experiences, { id: Date.now(), company: "", role: "", period: "", description: "" }] }));
  const removeExp = (id) => setData(d => ({ ...d, experiences: d.experiences.filter(e => e.id !== id) }));
  const addEdu = () => setData(d => ({ ...d, education: [...d.education, { id: Date.now(), school: "", degree: "", period: "", mention: "" }] }));
  const removeEdu = (id) => setData(d => ({ ...d, education: d.education.filter(e => e.id !== id) }));

  const handleTemplateSelect = async (key, confirm = false) => {
    setTemplateKey(key);
    if (confirm) {
      if (user) await supabase.from("profiles").update({ selected_template: key }).eq("id", user.id);
      setPage("editor");
    }
  };

  const saveCV = async () => {
    if (!user) return;
    const nom = `${data.firstName || "Prénom"} ${data.lastName || "Nom"} — ${new Date().toLocaleDateString("fr-FR")}`;
    await supabase.from("cvs").insert({ user_id: user.id, nom, contenu: data, template: templateKey });
    await supabase.from("profiles").update({ cv_count: cvCount + 1 }).eq("id", user.id);
    loadProfile(user.id);
  };

  const generateWithAI = async (field) => {
    if (!isAdmin && userPlan !== "illimite") { setPage("pricing"); return; }
    setAiLoading(true); setAiField(field);
    const prompts = {
      summary: `Génère résumé professionnel CV français pour titre="${data.title}". 3-4 phrases. UNIQUEMENT le texte.`,
      description: `Génère description poste CV français pour "${data.experiences[0]?.role}" chez "${data.experiences[0]?.company}". 2-3 phrases. UNIQUEMENT le texte.`,
      skills: `Génère 8-10 compétences pour "${data.title || "professionnel"}". Séparées virgules. UNIQUEMENT la liste.`,
    };
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1000, messages: [{ role: "user", content: prompts[field] }] }) });
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
    setSaveMsg("⏳ Génération du PDF en cours...");
    const tempDiv = document.createElement("div");
    tempDiv.style.cssText = "position:fixed;left:-9999px;top:0;width:794px;background:#fff;z-index:-1;";
    document.body.appendChild(tempDiv);
    const root = createRoot(tempDiv);
    root.render(<CVPreview data={data} templateKey={templateKey} />);
    await new Promise(r => setTimeout(r, 1500));
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
        position = heightLeft - imgHeight; pdf.addPage(); pdf.addImage(imgData, "PNG", 0, position, pageWidth, imgHeight); heightLeft -= pageHeight;
      }
      const blob = pdf.output("blob");
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      pdf.save(`${data.firstName || "Julius"}_${data.lastName || "CV"}.pdf`);
      document.body.appendChild(link);
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setSaveMsg("✅ Téléchargement terminé !");
      await saveCV();

      setTimeout(() => setSaveMsg(""), 4000);

    } catch (e) {
      setSaveMsg("❌ Erreur lors du téléchargement"); console.error(e);
    }
    finally { root.unmount(); document.body.removeChild(tempDiv); }
  };

  const handleDownloadClick = () => { if (canDownloadFree) { printPDF(); } else { setPayMode(true); setPage("pricing"); } };

  const inputStyle = { width: "100%", padding: "8px 12px", borderRadius: 6, border: "1.5px solid #d1d5db", fontSize: 13, fontFamily: "'DM Sans', sans-serif", outline: "none", background: "#fff", boxSizing: "border-box" };
  const labelStyle = { fontSize: 12, fontWeight: 500, color: "#374151", display: "block", marginBottom: 4, marginTop: 12, fontFamily: "'DM Sans', sans-serif" };
  const aiBtn = (field, label) => (
    <button onClick={() => generateWithAI(field)} disabled={aiLoading}
      style={{ marginTop: 6, padding: "5px 12px", background: isAdmin || userPlan === "illimite" ? "linear-gradient(135deg, #7c3aed, #4f46e5)" : "#9ca3af", color: "#fff", border: "none", borderRadius: 6, fontSize: 11.5, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
      {aiLoading && aiField === field ? "⏳ Génération..." : isAdmin || userPlan === "illimite" ? `✨ Générer : ${label}` : "🔒 IA — Illimité requis"}
    </button>
  );

  if (authLoading) return <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0f0c29, #1e1b4b)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontFamily: "'DM Sans', sans-serif" }}>⏳ Chargement...</div>;
  if (!user) return <AuthPage onAuth={(u) => { setUser(u); loadProfile(u.id); }} />;
  if (page === "templates") return <TemplateSelectorPage onSelect={handleTemplateSelect} selectedTemplate={templateKey} />;
  if (page === "pricing") return <PricingPage onBack={() => { setPayMode(false); setPage("editor"); }} onUpgrade={async (plan, isPay) => { if (plan === "illimite") setProfile(p => ({ ...p, plan: "illimite" })); if (isPay) { await printPDF(); } setPayMode(false); setPage("editor"); }} userPlan={userPlan} user={user} payMode={payMode} />;

  const tabs = [
    { id: "infos", label: "👤 Infos" },
    { id: "experience", label: "💼 Exp." },
    { id: "formation", label: "🎓 Formation" },
    { id: "competences", label: "⚡ Compétences" },
    { id: "mescvs", label: "📄 Mes CV" },
  ];

  return (
    <>
      <style>{FONTS}</style>
      <style>{`* { box-sizing: border-box; } body { margin: 0; background: #f1f5f9; } input:focus, textarea:focus { border-color: #6366f1 !important; } ::-webkit-scrollbar { width: 5px; } ::-webkit-scrollbar-thumb { background: #c7d2fe; border-radius: 3px; }`}</style>
      <div style={{ display: "flex", height: "100vh", fontFamily: "'DM Sans', sans-serif" }}>
        <div style={{ width: 400, minWidth: 340, display: "flex", flexDirection: "column", background: "#fff", boxShadow: "2px 0 20px rgba(0,0,0,0.08)", zIndex: 10, overflow: "hidden" }}>
          <div style={{ background: "linear-gradient(135deg, #1e1b4b, #312e81)", padding: "14px 18px", color: "#fff" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700 }}>Julius CV</div>
                <div style={{ fontSize: 10, opacity: 0.6, marginTop: 1 }}>{user.email}</div>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <button onClick={() => setPage("templates")} style={{ background: "rgba(255,255,255,0.15)", border: "none", borderRadius: 6, padding: "4px 8px", color: "#fff", fontSize: 10, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>🎨 Modèles</button>
                <button onClick={() => setPage("pricing")} style={{ background: isAdmin ? "linear-gradient(135deg, #f59e0b, #d97706)" : userPlan === "illimite" ? "linear-gradient(135deg, #7b2d8b, #9d4edd)" : "rgba(255,255,255,0.15)", border: "none", borderRadius: 6, padding: "4px 8px", color: "#fff", fontSize: 10, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                  {isAdmin ? "👑 Admin" : userPlan === "illimite" ? "♾️ Illimité" : "✨ Plans"}
                </button>
                <button onClick={handleLogout} style={{ background: "rgba(255,255,255,0.1)", border: "none", borderRadius: 6, padding: "4px 8px", color: "#fff", fontSize: 10, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Déco</button>
              </div>
            </div>
            <div style={{ marginTop: 10, background: "rgba(255,255,255,0.08)", borderRadius: 8, padding: "6px 10px", fontSize: 11, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span>📄 CV créés : {isAdmin ? "∞" : cvCount} / {isAdmin || userPlan === "illimite" ? "∞" : "1"}</span>
              {saveMsg && <span style={{ fontSize: 10, color: saveMsg.includes("✅") ? "#6ee7b7" : saveMsg.includes("❌") ? "#fca5a5" : "#fde68a" }}>{saveMsg}</span>}
            </div>
            {templateKey && <div style={{ marginTop: 6, fontSize: 10, opacity: 0.7 }}>🎨 Modèle : <strong>{TEMPLATES[templateKey]?.name}</strong></div>}
          </div>

          <div style={{ display: "flex", borderBottom: "2px solid #e5e7eb", background: "#fafafa" }}>
            {tabs.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                style={{ flex: 1, padding: "9px 3px", border: "none", background: "none", fontSize: 10, fontWeight: tab === t.id ? 700 : 400, color: tab === t.id ? "#4f46e5" : "#6b7280", borderBottom: tab === t.id ? "2px solid #4f46e5" : "2px solid transparent", marginBottom: -2, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                {t.label}
              </button>
            ))}
          </div>

          <div style={{ flex: 1, overflowY: "auto", padding: "14px 18px" }}>
            {tab === "infos" && (
              <div>
                <label style={labelStyle}>Photo (PNG ou JPG)</label>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                  {data.photo && <img src={data.photo} alt="" style={{ width: 50, height: 50, borderRadius: "50%", objectFit: "cover", border: "2px solid #6366f1" }} />}
                  <label style={{ display: "inline-block", padding: "6px 12px", background: "linear-gradient(135deg, #6366f1, #4f46e5)", color: "#fff", borderRadius: 6, cursor: "pointer", fontSize: 11.5, fontFamily: "'DM Sans', sans-serif" }}>
                    📷 Choisir une photo
                    <input type="file" accept="image/png,image/jpeg" style={{ display: "none" }} onChange={e => { const file = e.target.files[0]; if (!file) return; const reader = new FileReader(); reader.onload = ev => update("photo", ev.target.result); reader.readAsDataURL(file); }} />
                  </label>
                  {data.photo && <button onClick={() => update("photo", null)} style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: 12 }}>✕</button>}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <div><label style={labelStyle}>Prénom</label><input style={inputStyle} value={data.firstName} onChange={e => update("firstName", e.target.value)} placeholder="Julius" /></div>
                  <div><label style={labelStyle}>Nom</label><input style={inputStyle} value={data.lastName} onChange={e => update("lastName", e.target.value)} placeholder="Ganse" /></div>
                </div>
                <label style={labelStyle}>Date de naissance</label>
                <input type="date" style={inputStyle} value={data.birthdate} onChange={e => update("birthdate", e.target.value)} />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <div><label style={labelStyle}>Pays</label><input style={inputStyle} value={data.country} onChange={e => update("country", e.target.value)} placeholder="Bénin" /></div>
                  <div><label style={labelStyle}>Ville</label><input style={inputStyle} value={data.city} onChange={e => update("city", e.target.value)} placeholder="Cotonou" /></div>
                </div>
                <label style={labelStyle}>Adresse</label>
                <input style={inputStyle} value={data.address} onChange={e => update("address", e.target.value)} placeholder="Quartier, rue..." />
                <label style={labelStyle}>Téléphone</label>
                <input style={inputStyle} value={data.phone} onChange={e => update("phone", e.target.value)} placeholder="+229 00 00 00 00" />
                <label style={labelStyle}>Email</label>
                <input style={inputStyle} value={data.email} onChange={e => update("email", e.target.value)} placeholder="julius@email.com" />
                <label style={labelStyle}>Profession</label>
                <input style={inputStyle} value={data.title} onChange={e => update("title", e.target.value)} placeholder="Développeur Web" />
                <label style={labelStyle}>LinkedIn</label>
                <input style={inputStyle} value={data.linkedin} onChange={e => update("linkedin", e.target.value)} placeholder="linkedin.com/in/julius" />
                <label style={labelStyle}>Résumé professionnel</label>
                <textarea style={{ ...inputStyle, minHeight: 80, resize: "vertical" }} value={data.summary} onChange={e => update("summary", e.target.value)} placeholder="Décris ton profil..." onFocus={() => setActiveTip("summary")} onBlur={() => setActiveTip(null)} />
                {activeTip === "summary" && <TipBox field="summary" />}
                {aiBtn("summary", "mon résumé")}
              </div>
            )}
            {tab === "experience" && (
              <div>
                {data.experiences.map((exp, idx) => (
                  <div key={exp.id} style={{ background: "#f8fafc", borderRadius: 8, padding: "12px", marginBottom: 10, border: "1px solid #e2e8f0" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <div style={{ fontSize: 11.5, fontWeight: 600, color: "#4f46e5" }}>Expérience {idx + 1}</div>
                      {idx > 0 && <button onClick={() => removeExp(exp.id)} style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer" }}>✕</button>}
                    </div>
                    <label style={labelStyle}>Entreprise</label>
                    <input style={inputStyle} value={exp.company} onChange={e => updateExp(exp.id, "company", e.target.value)} placeholder="Entreprise" />
                    <label style={labelStyle}>Poste</label>
                    <input style={inputStyle} value={exp.role} onChange={e => updateExp(exp.id, "role", e.target.value)} placeholder="Ton poste" />
                    <label style={labelStyle}>Période</label>
                    <input style={inputStyle} value={exp.period} onChange={e => updateExp(exp.id, "period", e.target.value)} placeholder="Jan 2022 – Aujourd'hui" />
                    <label style={labelStyle}>Description</label>
                    <textarea style={{ ...inputStyle, minHeight: 60, resize: "vertical" }} value={exp.description} onChange={e => updateExp(exp.id, "description", e.target.value)} placeholder="Tes missions..." onFocus={() => setActiveTip("experience")} onBlur={() => setActiveTip(null)} />
                    {activeTip === "experience" && <TipBox field="experience" />}
                    {idx === 0 && aiBtn("description", "la description")}
                  </div>
                ))}
                <button onClick={addExp} style={{ width: "100%", padding: "7px", border: "1.5px dashed #6366f1", background: "none", borderRadius: 8, color: "#6366f1", cursor: "pointer", fontSize: 12, fontFamily: "'DM Sans', sans-serif" }}>+ Ajouter une expérience</button>
              </div>
            )}
            {tab === "formation" && (
              <div>
                {data.education.map((edu, idx) => (
                  <div key={edu.id} style={{ background: "#f8fafc", borderRadius: 8, padding: "12px", marginBottom: 10, border: "1px solid #e2e8f0" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <div style={{ fontSize: 11.5, fontWeight: 600, color: "#4f46e5" }}>Formation {idx + 1}</div>
                      {idx > 0 && <button onClick={() => removeEdu(edu.id)} style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer" }}>✕</button>}
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
                <button onClick={addEdu} style={{ width: "100%", padding: "7px", border: "1.5px dashed #6366f1", background: "none", borderRadius: 8, color: "#6366f1", cursor: "pointer", fontSize: 12, fontFamily: "'DM Sans', sans-serif" }}>+ Ajouter une formation</button>
              </div>
            )}
            {tab === "competences" && (
              <div>
                <label style={labelStyle}>Compétences (séparées par des virgules)</label>
                <textarea style={{ ...inputStyle, minHeight: 70, resize: "vertical" }} value={data.skills} onChange={e => update("skills", e.target.value)} placeholder="React, Node.js..." onFocus={() => setActiveTip("skills")} onBlur={() => setActiveTip(null)} />
                {activeTip === "skills" && <TipBox field="skills" />}
                {aiBtn("skills", "mes compétences")}
                <label style={labelStyle}>Langues</label>
                <input style={inputStyle} value={data.languages} onChange={e => update("languages", e.target.value)} placeholder="Français natif, Anglais B2..." />
                <label style={labelStyle}>Loisirs</label>
                <textarea style={{ ...inputStyle, minHeight: 60, resize: "vertical" }} value={data.hobbies} onChange={e => update("hobbies", e.target.value)} placeholder="Danse, Cinéma, Jeux vidéo..." />
              </div>
            )}
            {tab === "mescvs" && (
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#1e1b4b", marginBottom: 14 }}>📄 Mes CV ({cvList.length})</div>
                {cvList.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "40px 20px", color: "#9ca3af", fontSize: 13 }}>
                    <div style={{ fontSize: 36, marginBottom: 10 }}>📭</div>
                    <div>Aucun CV sauvegardé.</div>
                    <div style={{ marginTop: 6, fontSize: 11 }}>Télécharge ton premier CV !</div>
                  </div>
                ) : cvList.map((cv, idx) => (
                  <div key={cv.id} style={{ background: "#f8fafc", borderRadius: 10, padding: "12px 14px", marginBottom: 10, border: "1px solid #e2e8f0" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div>
                        <div style={{ fontSize: 12.5, fontWeight: 600, color: "#1e1b4b" }}>CV #{idx + 1}</div>
                        <div style={{ fontSize: 11, color: "#6b7280", marginTop: 2 }}>{cv.nom}</div>
                        <div style={{ fontSize: 10.5, color: "#9ca3af", marginTop: 2 }}>{new Date(cv.created_at).toLocaleDateString("fr-FR")}</div>
                      </div>
                      <div style={{ display: "flex", gap: 5 }}>
                        <button onClick={() => { setData(cv.contenu); if (cv.template) setTemplateKey(cv.template); setTab("infos"); }}
                          style={{ padding: "5px 8px", background: "linear-gradient(135deg, #6366f1, #4f46e5)", color: "#fff", border: "none", borderRadius: 5, fontSize: 10.5, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>✏️</button>
                        <button onClick={async () => { setData(cv.contenu); if (cv.template) setTemplateKey(cv.template); await new Promise(r => setTimeout(r, 300)); printPDF(); }}
                          style={{ padding: "5px 8px", background: "linear-gradient(135deg, #1e1b4b, #312e81)", color: "#fff", border: "none", borderRadius: 5, fontSize: 10.5, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>📄</button>
                        <button onClick={async () => { if (window.confirm("Supprimer ce CV ?")) { await supabase.from("cvs").delete().eq("id", cv.id); loadProfile(user.id); } }}
                          style={{ padding: "5px 8px", background: "#fee2e2", color: "#ef4444", border: "none", borderRadius: 5, fontSize: 10.5, cursor: "pointer" }}>🗑️</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ borderTop: "1px solid #e5e7eb", padding: "10px 18px", background: "#fafafa" }}>
            <button onClick={() => setShowPreview(true)} style={{ width: "100%", padding: "9px", background: "linear-gradient(135deg, #6366f1, #4f46e5)", color: "#fff", border: "none", borderRadius: 8, fontSize: 12.5, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", marginBottom: 7 }}>👁️ Voir mon CV</button>
            <button onClick={handleDownloadClick} style={{ width: "100%", padding: "9px", background: "linear-gradient(135deg, #1e1b4b, #312e81)", color: "#fff", border: "none", borderRadius: 8, fontSize: 12.5, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
              📄 Télécharger {!canDownloadFree ? "— 500F" : "gratuitement"}
            </button>
          </div>
        </div>

        {showPreview && (
          <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.85)", zIndex: 1000, display: "flex", flexDirection: "column" }}>
            <div style={{ background: "linear-gradient(135deg, #1e1b4b, #312e81)", padding: "12px 18px", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 15, fontWeight: 700, color: "#fff" }}>Aperçu de ton CV</div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={handleDownloadClick} style={{ background: "linear-gradient(135deg, #f59e0b, #d97706)", border: "none", borderRadius: 7, padding: "7px 12px", color: "#fff", fontSize: 11.5, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                  📄 Télécharger {!canDownloadFree ? "— 500F" : ""}
                </button>
                <button onClick={() => setShowPreview(false)} style={{ background: "rgba(255,255,255,0.15)", border: "none", borderRadius: 7, padding: "7px 12px", color: "#fff", fontSize: 11.5, cursor: "pointer" }}>✕ Fermer</button>
              </div>
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: "20px" }}>
              <div style={{ width: "100%", maxWidth: 720, margin: "0 auto" }}>
                <CVPreview data={data} templateKey={templateKey} />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}