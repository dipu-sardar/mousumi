import { useEffect, useState } from "react";
import { fetchAllDesigns, createDesign, updateDesign } from "../lib/staffApi.js";
import { useStaff } from "./StaffContext.jsx";
import { useViewport } from "../hooks/useViewport.js";
import { CATS, tk } from "../data/catalog.js";
import { chip, inputStyle, fieldLabel } from "./styleHelpers.js";

const CATEGORY_OPTIONS = CATS.filter((c) => c !== "ALL");

const blankDraft = () => ({
  isNew: true, // tracked explicitly rather than inferred from id-matching — see save()
  id: "",
  name: "",
  short: "",
  price: "",
  days: "",
  category: CATEGORY_OPTIONS[0],
  tone: "#EDEDE6",
  fabric_note: "",
  description: "",
  img_url: "",
  gallery: "",
  active: true,
});

/** designs.gallery is a Postgres text[] — the form collects it as one URL
 *  per line and this turns that into the array Supabase's client expects
 *  (and back, when opening an existing design for editing). */
const galleryToText = (arr) => (Array.isArray(arr) ? arr.join("\n") : "");
const textToGallery = (text) =>
  text
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

export default function DesignsView() {
  const { flash } = useStaff();
  const { isMobile } = useViewport();
  const [designs, setDesigns] = useState(null);
  const [error, setError] = useState("");
  const [draft, setDraft] = useState(null); // null = form closed; "new" id = creating
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  const load = async () => {
    try {
      setDesigns(await fetchAllDesigns());
    } catch (err) {
      setError((err && err.message) || "লোড করা যায়নি।");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openNew = () => {
    setSaveError("");
    setDraft(blankDraft());
  };

  const openEdit = (d) => {
    setSaveError("");
    setDraft({ ...d, isNew: false, gallery: galleryToText(d.gallery) });
  };

  const closeForm = () => {
    setDraft(null);
    setSaveError("");
  };

  const setField = (k) => (e) => {
    const v = e && e.target ? (e.target.type === "checkbox" ? e.target.checked : e.target.value) : e;
    setDraft((d) => ({ ...d, [k]: v }));
  };

  const save = async () => {
    const id = (draft.id || "").trim();
    const name = (draft.name || "").trim();
    if (!id || !name) {
      setSaveError("আইডি আর নাম দুটোই দিতে হবে।");
      return;
    }
    const price = parseInt(draft.price, 10);
    const days = parseInt(draft.days, 10);
    if (!price || !days) {
      setSaveError("দাম আর দিন সংখ্যা সঠিকভাবে দাও।");
      return;
    }
    const row = {
      name,
      short: (draft.short || "").trim() || name.replace(/\n/g, " "),
      price,
      days,
      category: draft.category,
      tone: draft.tone || "#EDEDE6",
      fabric_note: draft.fabric_note || "",
      description: draft.description || "",
      img_url: draft.img_url || "",
      gallery: textToGallery(draft.gallery),
      active: !!draft.active,
    };

    setSaving(true);
    setSaveError("");
    try {
      if (draft.isNew) {
        await createDesign({ id, ...row });
        flash("ডিজাইন যোগ হয়েছে");
      } else {
        await updateDesign(id, row);
        flash("ডিজাইন আপডেট হয়েছে");
      }
      await load();
      closeForm();
    } catch (err) {
      setSaveError((err && err.message) || "সেভ করা যায়নি, আবার চেষ্টা করো।");
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (d) => {
    setDesigns((list) => list.map((x) => (x.id === d.id ? { ...x, active: !x.active } : x)));
    try {
      await updateDesign(d.id, { active: !d.active });
    } catch (err) {
      flash("বদলানো যায়নি — " + ((err && err.message) || "আবার চেষ্টা করো"));
      load();
    }
  };

  if (error) return <div style={{ padding: "24px", borderRadius: "16px", background: "#F9E5E9", color: "#A32138", fontSize: "13px" }}>{error}</div>;
  if (designs === null) return <div style={{ color: "#9A9A92", fontSize: "13px" }}>লোড হচ্ছে…</div>;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", flexWrap: "wrap", marginBottom: "22px" }}>
        <h1 style={{ fontFamily: "Outfit,sans-serif", fontSize: isMobile ? "26px" : "34px", fontWeight: 800, letterSpacing: "-1px", margin: 0 }}>ডিজাইন</h1>
        <div onClick={openNew} style={{ padding: "11px 20px", borderRadius: "30px", background: "#181818", color: "#fff", fontFamily: "Outfit,sans-serif", fontSize: "11px", fontWeight: 800, letterSpacing: "1px", cursor: "pointer" }}>
          + নতুন ডিজাইন
        </div>
      </div>

      {draft && (
        <div style={{ background: "#FFFFFF", border: "1px solid #EDEDE6", borderRadius: "20px", padding: isMobile ? "18px" : "24px", marginBottom: "24px" }}>
          <div style={{ fontFamily: "Outfit,sans-serif", fontSize: "10.5px", fontWeight: 800, letterSpacing: "1.4px", color: "#D32F4D", marginBottom: "16px" }}>{draft.isNew ? "নতুন ডিজাইন" : "ডিজাইন এডিট"}</div>

          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill, minmax(220px, 1fr))", gap: "14px" }}>
            <div>
              <div style={fieldLabel}>আইডি (স্লাগ, একবার সেট হলে বদলানো যাবে না)</div>
              <input value={draft.id} onChange={setField("id")} placeholder="যেমন d9" disabled={!draft.isNew} style={{ ...inputStyle, opacity: draft.isNew ? 1 : 0.6 }} />
            </div>
            <div>
              <div style={fieldLabel}>ক্যাটাগরি</div>
              <select value={draft.category} onChange={setField("category")} style={inputStyle}>
                {CATEGORY_OPTIONS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <div style={fieldLabel}>দাম (৳)</div>
              <input value={draft.price} onChange={setField("price")} type="number" style={inputStyle} />
            </div>
            <div>
              <div style={fieldLabel}>সেলাইয়ের দিন</div>
              <input value={draft.days} onChange={setField("days")} type="number" style={inputStyle} />
            </div>
          </div>

          <div style={{ marginTop: "14px" }}>
            <div style={fieldLabel}>নাম (২ লাইনে দিতে চাইলে Enter দিয়ে ভাগ করো — ক্যাটালগ কার্ডে এভাবেই দেখাবে)</div>
            <textarea value={draft.name} onChange={setField("name")} rows={2} style={{ ...inputStyle, resize: "vertical" }} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "14px", marginTop: "14px" }}>
            <div>
              <div style={fieldLabel}>ছোট নাম (তালিকা/কার্ডে দেখানোর জন্য)</div>
              <input value={draft.short} onChange={setField("short")} style={inputStyle} />
            </div>
            <div>
              <div style={fieldLabel}>কাপড়ের নোট</div>
              <input value={draft.fabric_note} onChange={setField("fabric_note")} placeholder="যেমন Cotton or georgette · lining included" style={inputStyle} />
            </div>
          </div>

          <div style={{ marginTop: "14px" }}>
            <div style={fieldLabel}>বর্ণনা</div>
            <textarea value={draft.description} onChange={setField("description")} rows={3} style={{ ...inputStyle, resize: "vertical" }} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "14px", marginTop: "14px" }}>
            <div>
              <div style={fieldLabel}>প্রধান ছবির URL</div>
              <input value={draft.img_url} onChange={setField("img_url")} placeholder="/assets/... বা পুরো URL" style={inputStyle} />
            </div>
            <div>
              <div style={fieldLabel}>কার্ডের রং (hex)</div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ width: "38px", height: "38px", borderRadius: "10px", background: draft.tone, border: "1px solid #E2E2DA", flexShrink: 0 }} />
                <input value={draft.tone} onChange={setField("tone")} style={inputStyle} />
              </div>
            </div>
          </div>

          <div style={{ marginTop: "14px" }}>
            <div style={fieldLabel}>গ্যালারির বাকি ছবি (একটা লাইনে একটা URL)</div>
            <textarea value={draft.gallery} onChange={setField("gallery")} rows={3} style={{ ...inputStyle, resize: "vertical" }} />
          </div>

          <div onClick={() => setField("active")(!draft.active)} style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "16px", cursor: "pointer" }}>
            <div style={{ width: "36px", height: "20px", borderRadius: "12px", background: draft.active ? "#181818" : "#E2E2DA", position: "relative", transition: "background .2s ease" }}>
              <div style={{ position: "absolute", top: "2px", left: draft.active ? "18px" : "2px", width: "16px", height: "16px", borderRadius: "50%", background: "#fff", transition: "left .2s ease" }} />
            </div>
            <span style={{ fontSize: "13px", color: "#6A6A64" }}>{draft.active ? "সক্রিয় — ক্যাটালগে দেখাবে" : "নিষ্ক্রিয় — ক্যাটালগে লুকানো থাকবে"}</span>
          </div>

          {saveError && <div style={{ marginTop: "14px", padding: "12px 16px", borderRadius: "14px", background: "#F9E5E9", color: "#A32138", fontSize: "12.5px" }}>{saveError}</div>}

          <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
            <div onClick={saving ? undefined : save} style={{ padding: "13px 26px", borderRadius: "30px", background: "#D32F4D", color: "#fff", fontFamily: "Outfit,sans-serif", fontSize: "11px", fontWeight: 800, letterSpacing: "1px", cursor: saving ? "default" : "pointer", opacity: saving ? 0.6 : 1 }}>
              {saving ? "সেভ হচ্ছে…" : "সেভ করো"}
            </div>
            <div onClick={closeForm} style={{ padding: "13px 22px", borderRadius: "30px", border: "1px solid #E2E2DA", fontFamily: "Outfit,sans-serif", fontSize: "11px", fontWeight: 800, letterSpacing: "1px", cursor: "pointer" }}>
              বাতিল
            </div>
          </div>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill, minmax(260px, 1fr))", gap: "16px" }}>
        {designs.map((d) => (
          <div key={d.id} style={{ background: "#FFFFFF", border: "1px solid #EDEDE6", borderRadius: "18px", padding: "16px", opacity: d.active ? 1 : 0.55 }}>
            <div style={{ display: "flex", gap: "12px" }}>
              <div style={{ width: "52px", height: "66px", borderRadius: "10px", overflow: "hidden", background: d.tone || "#EFEFE9", flexShrink: 0 }}>
                {d.img_url && <div role="img" aria-label={d.short} style={{ width: "100%", height: "100%", backgroundImage: `url(${d.img_url})`, backgroundPosition: "50% 18%", backgroundSize: "cover" }} />}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: "Outfit,sans-serif", fontSize: "9.5px", fontWeight: 800, letterSpacing: "1px", color: "#9A9A92" }}>{d.id} · {d.category}</div>
                <div style={{ fontFamily: "Outfit,sans-serif", fontSize: "13.5px", fontWeight: 700, marginTop: "3px" }}>{d.short}</div>
                <div style={{ fontSize: "12px", color: "#6A6A64", marginTop: "3px" }}>
                  {tk(d.price)} · {d.days} দিন
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: "8px", marginTop: "14px" }}>
              <div onClick={() => openEdit(d)} style={chip(false)}>
                এডিট
              </div>
              <div onClick={() => toggleActive(d)} style={chip(d.active)}>
                {d.active ? "সক্রিয়" : "নিষ্ক্রিয়"}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
