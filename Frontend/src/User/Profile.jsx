import React, { useEffect, useMemo, useState } from "react";
import { User, Mail, Phone, Image as ImageIcon, MapPin, Pencil } from "lucide-react";

const emptyProfile = {
  name: "",
  email: "",
  phoneNumber: "",
  profilePicture: "",
    address: ""
};

export default function Profile({ user, onProfileUpdated, onNotify }) {
  const [profile, setProfile] = useState(emptyProfile);
  const [draft, setDraft] = useState(emptyProfile);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);

  const token = useMemo(() => localStorage.getItem("museart_token"), []);

  const loadProfile = async () => {
    if (!token || token === "guest_token") {
      setLoading(false);
      setError("Please login to access your profile.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/profile", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to load profile");
      }

      const next = {
        name: data.profile?.name || user?.name || "",
        email: data.profile?.email || user?.email || "",
        phoneNumber: data.profile?.phoneNumber || "",
        profilePicture: data.profile?.profilePicture || "",
        address: data.profile?.address || ""
      };
      setProfile(next);
      setDraft(next);
    } catch (err) {
      setError(err.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onChange = (field, value) => {
    setDraft((prev) => ({ ...prev, [field]: value }));
  };

  const onImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setError("");
      onChange("profilePicture", String(reader.result || ""));
    };
    reader.readAsDataURL(file);
  };

  const onCancel = () => {
    setDraft(profile);
    setEditing(false);
    setError("");
  };

  const onSave = async () => {
    setSaving(true);
    setError("");
    try {
      const payload = {
        name: draft.name,
        phoneNumber: draft.phoneNumber,
        profilePicture: draft.profilePicture,
        address: draft.address
      };

      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to update profile");
      }

      const updated = {
        name: data.profile?.name || draft.name,
        email: data.profile?.email || draft.email,
        phoneNumber: data.profile?.phoneNumber || "",
        profilePicture: data.profile?.profilePicture || "",
        address: data.profile?.address || ""
      };

      setProfile(updated);
      setDraft(updated);
      setEditing(false);
      onProfileUpdated?.(data.profile);
      onNotify?.(data.message || "Profile updated successfully.");
    } catch (err) {
      setError(err.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <section className="max-w-5xl mx-auto px-10 pt-44 pb-40">
        <p className="text-gray-400 uppercase tracking-[0.4em] text-xs">Loading profile...</p>
      </section>
    );
  }

  const readOnly = !editing;

  return (
    <section className="max-w-5xl mx-auto px-10 pt-44 pb-40">
      <div className="mb-12 flex items-center justify-between border-b border-white/10 pb-10">
        <div>
          <p className="text-[11px] uppercase font-black tracking-[0.8em] text-gold">Identity Record</p>
          <h2 className="text-6xl md:text-7xl font-serif italic text-white mt-4">Profile</h2>
        </div>
        {!editing ? (
          <button
            onClick={() => setEditing(true)}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gold text-black text-xs font-black uppercase tracking-widest"
          >
            <Pencil className="w-4 h-4" />
            Edit Profile
          </button>
        ) : (
          <div className="flex gap-3">
            <button
              onClick={onSave}
              disabled={saving}
              className="px-5 py-3 rounded-xl bg-gold text-black text-xs font-black uppercase tracking-widest disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
            <button
              onClick={onCancel}
              disabled={saving}
              className="px-5 py-3 rounded-xl border border-white/20 text-white text-xs font-black uppercase tracking-widest"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Field icon={User} label="Full Name" value={draft.name} readOnly={readOnly} onChange={(v) => onChange("name", v)} />
        <Field icon={Mail} label="Email" value={draft.email} readOnly />
        <Field icon={Phone} label="Phone Number" value={draft.phoneNumber} readOnly={readOnly} onChange={(v) => onChange("phoneNumber", v)} />
        <Field icon={ImageIcon} label="Profile Picture URL" value={draft.profilePicture} readOnly={readOnly} onChange={(v) => onChange("profilePicture", v)} />
        <Field icon={MapPin} label="Address" value={draft.address} readOnly={readOnly} onChange={(v) => onChange("address", v)} />
      </div>

      <div className="mt-10 p-6 border border-white/10 rounded-2xl bg-white/5">
        <p className="text-[10px] uppercase tracking-[0.3em] text-gray-500 mb-4">Profile Picture Preview</p>
        {editing && (
          <div className="mb-5">
            <label className="block text-[10px] uppercase tracking-[0.3em] text-gray-400 mb-2">
              Upload Profile Picture
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={onImageUpload}
              className="block w-full text-xs text-gray-300 file:mr-3 file:rounded-lg file:border-0 file:bg-gold file:px-3 file:py-2 file:text-xs file:font-bold file:text-black"
            />
          </div>
        )}
        {draft.profilePicture ? (
          <img
            src={draft.profilePicture}
            alt="profile"
            className="w-28 h-28 rounded-full object-cover border border-white/20"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-28 h-28 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-gray-400">
            <User className="w-8 h-8" />
          </div>
        )}
      </div>
    </section>
  );
}

function Field({ icon: Icon, label, value, onChange, readOnly = false, type = "text", max }) {
  return (
    <div className="p-5 rounded-2xl border border-white/10 bg-white/5">
      <label className="block text-[10px] uppercase tracking-[0.3em] text-gray-400 mb-3">
        <span className="inline-flex items-center gap-2">
          <Icon className="w-3.5 h-3.5" />
          {label}
        </span>
      </label>
      <input
        type={type}
        value={value || ""}
        readOnly={readOnly}
        max={max}
        onChange={(e) => onChange?.(e.target.value)}
        className={`w-full rounded-xl px-4 py-3 text-sm outline-none ${
          readOnly
            ? "bg-black/20 text-gray-200 border border-white/5 cursor-not-allowed"
            : "bg-black/30 text-white border border-white/20 focus:border-gold/60"
        }`}
      />
    </div>
  );
}
