"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp, Camera, ChevronDown, Clapperboard, Cpu, Database, Gauge, HardDrive, MemoryStick, MonitorPlay, Package, Plane, Plus, ShieldCheck, Smartphone, Trash2, Zap, type LucideIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export type MegaMenuEntry = { title: string; detail: string; href: string; icon: string; badge: string; featured: boolean };
export type MegaMenuSection = { id: string; title: string; icon: string; entries: MegaMenuEntry[]; runtimeTitle?: string; metrics?: { value: string; label: string }[] };
export type MegaMenuContent = {
  sections: MegaMenuSection[];
  promo: { eyebrow: string; title: string; description: string; detail: string; benchmark: string; voucherLabel: string; voucherCode: string; ctaLabel: string; href: string };
  footer: { message: string; emphasis: string; detail: string; firstLinkLabel: string; firstLinkHref: string; secondLinkLabel: string; secondLinkHref: string };
};

export const defaultMegaMenuContent: MegaMenuContent = {
  sections: [
    { id: "architecture", title: "Flash Architecture", icon: "Cpu", entries: [
      { title: "SDXC & SDHC Cinema", detail: "UHS-II & UHS-I · Up to 300 MB/s", href: "/c/sd-cards", icon: "MemoryStick", badge: "", featured: false },
      { title: "MicroSD Action & Mobile", detail: "A2 App Perf · V30 & V60", href: "/c/microsd-cards", icon: "Smartphone", badge: "", featured: false },
      { title: "CFexpress Type B", detail: "PCIe 3.0 ×2 · Extreme 1750 MB/s", href: "/c/cfexpress-cards", icon: "Zap", badge: "", featured: true },
      { title: "CFexpress Type A", detail: "Sony FX3 / FX6 / A1 Alpha Native", href: "/c?q=CFexpress%20Type%20A", icon: "Camera", badge: "", featured: false },
      { title: "Ingest Docks & Readers", detail: "Thunderbolt 4 · 40Gbps Dual-Slot", href: "/c/card-readers", icon: "HardDrive", badge: "", featured: false },
      { title: "Cinema SSDs & CFast 2.0", detail: "RED, ARRI & Blackmagic Media", href: "/c?q=SSD", icon: "Database", badge: "", featured: false },
    ] },
    { id: "capacity", title: "Capacity Tier", icon: "Database", runtimeTitle: "256GB RUNTIME INDEX", metrics: [{ value: "142 Min", label: "4K 60P RAW" }, { value: "7,400+", label: "RAW Photos" }], entries: [
      { title: "64GB – 128GB", detail: "FHD / 4K Standard · reliable photo", href: "/c?q=128GB", icon: "", badge: "", featured: false },
      { title: "256GB", detail: "Pro sweet spot · 4K60 workflows", href: "/c?q=256GB", icon: "", badge: "MOST POPULAR", featured: true },
      { title: "512GB", detail: "ProRes 422 · Continuous High Frame", href: "/c?q=512GB", icon: "", badge: "", featured: false },
      { title: "1TB – 2TB", detail: "Cinema 8K All-Intra Master multi-cam", href: "/c?q=1TB", icon: "", badge: "", featured: false },
    ] },
    { id: "speed", title: "Speed Class", icon: "Gauge", entries: [
      { title: "Cinema 8K", detail: "Min 90 MB/s continuous", href: "/c?q=V90", icon: "", badge: "V90", featured: false },
      { title: "4K ProRes", detail: "Min 60 MB/s sustained", href: "/c?q=V60", icon: "", badge: "V60", featured: false },
      { title: "Drone & Vlog", detail: "Min 30 MB/s broadcast", href: "/c?q=V30", icon: "", badge: "V30", featured: false },
      { title: "App Perf 2", detail: "4000 Read IOPS", href: "/c?q=A2", icon: "", badge: "A2", featured: false },
      { title: "UHS-II Dual Bus", detail: "Up to 312 MB/s pinout", href: "/c?q=UHS-II", icon: "", badge: "II", featured: false },
      { title: "NVMe Protocol", detail: "Direct Host bus link", href: "/c?q=NVMe", icon: "", badge: "PCIe", featured: false },
    ] },
    { id: "devices", title: "Device Archetype", icon: "Package", entries: [
      { title: "Cinema Cameras", detail: "FX3, FX6, RED, BMD", href: "/c?q=cinema", icon: "Clapperboard", badge: "", featured: false },
      { title: "Mirrorless Hybrid", detail: "A7S III, R5 II, Z8, X-T5", href: "/c?q=mirrorless", icon: "Camera", badge: "", featured: false },
      { title: "Aerial Drones", detail: "Mavic 3 Pro, Inspire 3", href: "/c?q=drone", icon: "Plane", badge: "", featured: false },
      { title: "Action & 360 Cams", detail: "GoPro 12/13, Ace Pro", href: "/c?q=action", icon: "Gauge", badge: "", featured: false },
      { title: "Handheld Consoles", detail: "Steam Deck, ROG Ally", href: "/c?q=gaming", icon: "MonitorPlay", badge: "", featured: false },
      { title: "Surveillance & Dash", detail: "24/7 Loop Write Armor", href: "/c?q=endurance", icon: "ShieldCheck", badge: "", featured: false },
    ] },
  ],
  promo: { eyebrow: "STUDIO BUNDLE", title: "RED & ARRI CFexpress Pro Pack", description: "Save 25% + Free 40Gbps Thunderbolt Card Reader included with every twin-card kit.", detail: "BYTEVEX Extreme Pro SDXC UHS-II V90 Memory Card Studio Presentation", benchmark: "300 MB/s BENCHMARK", voucherLabel: "Exclusive Voucher", voucherCode: "CINEMA25", ctaLabel: "Explore Cinema Kits", href: "/c?deals=1" },
  footer: { message: "Need enterprise procurement?", emphasis: "GST Invoicing & Bulk Cine Studio Fleet pricing", detail: "available.", firstLinkLabel: "Interactive Compatibility Finder", firstLinkHref: "#device-finder", secondLinkLabel: "View All Storage Products", secondLinkHref: "/c" },
};

export function contentFromApi(value: unknown): MegaMenuContent | null {
  if (!value || typeof value !== "object") return null;
  const saved = value as Partial<MegaMenuContent>;
  const normalizeEntries = (entries: MegaMenuEntry[] | undefined, fallback: MegaMenuEntry[]) => Array.isArray(entries) ? entries.map((entry) => Object.assign({ title: "", detail: "", href: "", icon: "", badge: "", featured: false }, entry)) : fallback;
  const sections = Array.isArray(saved.sections) ? saved.sections.map((section) => {
    const fallback = defaultMegaMenuContent.sections.find((item) => item.id === section.id) ?? { id: section.id, title: "New section", icon: "Package", entries: [] };
    return { ...fallback, ...section, entries: normalizeEntries(section.entries, fallback.entries) };
  }) : defaultMegaMenuContent.sections;
  return {
    ...defaultMegaMenuContent,
    ...saved,
    sections,
    promo: { ...defaultMegaMenuContent.promo, ...saved.promo },
    footer: { ...defaultMegaMenuContent.footer, ...saved.footer },
  };
}

const inputClass = "mt-1.5 h-9 w-full rounded-md border border-border-strong bg-surface px-2.5 text-xs font-normal text-ink outline-none placeholder:text-ink-faint focus:border-accent-strong";
const labelClass = "block text-[11px] font-semibold text-ink-muted";
const iconOptions: { name: string; Icon: LucideIcon }[] = [
  { name: "Cpu", Icon: Cpu }, { name: "MemoryStick", Icon: MemoryStick }, { name: "Smartphone", Icon: Smartphone },
  { name: "Zap", Icon: Zap }, { name: "Camera", Icon: Camera }, { name: "HardDrive", Icon: HardDrive },
  { name: "Database", Icon: Database }, { name: "Gauge", Icon: Gauge }, { name: "Package", Icon: Package },
  { name: "Clapperboard", Icon: Clapperboard }, { name: "Plane", Icon: Plane }, { name: "MonitorPlay", Icon: MonitorPlay },
  { name: "ShieldCheck", Icon: ShieldCheck },
];

function MenuIconPicker({ value, onChange, label }: { value: string; onChange: (value: string) => void; label: string }) {
  const [open, setOpen] = useState(false);
  const selected = iconOptions.find((option) => option.name === value);
  const SelectedIcon = selected?.Icon;
  return <Popover open={open} onOpenChange={setOpen}>
    <PopoverTrigger render={<button type="button" aria-label={label} aria-expanded={open} className="mt-1.5 flex h-9 w-full items-center justify-between rounded-md border border-border-strong bg-surface px-2.5 text-ink outline-none hover:border-accent-strong focus-visible:border-accent-strong" />}>
      <span className="flex items-center gap-2">{SelectedIcon ? <SelectedIcon className="h-4 w-4" /> : <span className="text-xs text-ink-muted">None</span>}<span className="sr-only">{selected?.name ?? "No icon"}</span></span>
      <ChevronDown className="h-3.5 w-3.5 text-ink-muted" />
    </PopoverTrigger>
    <PopoverContent align="start" className="w-64 p-2">
      <div className="grid grid-cols-5 gap-1">
        <button type="button" title="No icon" aria-label="No icon" onClick={() => { onChange(""); setOpen(false); }} className={`flex h-10 items-center justify-center rounded-md text-[10px] text-ink-muted hover:bg-neutral-tint ${!value ? "bg-accent-tint text-accent-strong" : ""}`}>None</button>
        {iconOptions.map(({ name, Icon }) => <button key={name} type="button" title={name} aria-label={name} aria-pressed={value === name} onClick={() => { onChange(name); setOpen(false); }} className={`flex h-10 items-center justify-center rounded-md text-ink-secondary hover:bg-neutral-tint ${value === name ? "bg-accent-tint text-accent-strong ring-1 ring-inset ring-accent-tint-border" : ""}`}><Icon className="h-5 w-5" /></button>)}
      </div>
    </PopoverContent>
  </Popover>;
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string }) {
  return <label className={labelClass}>{label}<input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className={inputClass} /></label>;
}

export function MegaMenuContentEditor({ value, onChange }: { value: MegaMenuContent; onChange: (value: MegaMenuContent) => void }) {
  const updateSection = (index: number, patch: Partial<MegaMenuSection>) => onChange({ ...value, sections: value.sections.map((section, i) => i === index ? { ...section, ...patch } : section) });
  const updateEntry = (sectionIndex: number, entryIndex: number, patch: Partial<MegaMenuEntry>) => updateSection(sectionIndex, { entries: value.sections[sectionIndex].entries.map((entry, i) => i === entryIndex ? { ...entry, ...patch } : entry) });
  const updatePromo = (patch: Partial<MegaMenuContent["promo"]>) => onChange({ ...value, promo: { ...value.promo, ...patch } });
  const updateFooter = (patch: Partial<MegaMenuContent["footer"]>) => onChange({ ...value, footer: { ...value.footer, ...patch } });
  const moveSection = (index: number, delta: -1 | 1) => {
    const target = index + delta;
    if (target < 0 || target >= value.sections.length) return;
    const sections = [...value.sections];
    [sections[index], sections[target]] = [sections[target], sections[index]];
    onChange({ ...value, sections });
  };

  return <div className="space-y-4">
    <div><h3 className="text-sm font-semibold text-ink">Mega-menu sections</h3><p className="mt-1 text-xs text-ink-muted">Edit each section and the links shown in the header panel.</p></div>
    {value.sections.map((section, sectionIndex) => <section key={section.id} className="rounded-lg border border-border bg-canvas p-3">
      <div className="flex items-start gap-2"><div className="grid flex-1 gap-3 sm:grid-cols-[1fr_150px]"><Field label="Section heading" value={section.title} onChange={(title) => updateSection(sectionIndex, { title })} /><label className={labelClass}>Heading icon<MenuIconPicker label={`${section.title} heading icon`} value={section.icon} onChange={(icon) => updateSection(sectionIndex, { icon })} /></label></div><div className="mt-4 flex shrink-0 items-center">{([-1, 1] as const).map((delta) => <button key={delta} type="button" aria-label={delta < 0 ? `Move ${section.title} up` : `Move ${section.title} down`} disabled={sectionIndex + delta < 0 || sectionIndex + delta >= value.sections.length} onClick={() => moveSection(sectionIndex, delta)} className="flex h-8 w-8 items-center justify-center rounded-md text-ink-muted hover:bg-surface disabled:opacity-30">{delta < 0 ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}</button>)}<button type="button" onClick={() => onChange({ ...value, sections: value.sections.filter((_, i) => i !== sectionIndex) })} aria-label={`Remove ${section.title}`} className="flex h-8 w-8 items-center justify-center rounded-md text-ink-muted hover:bg-danger-tint hover:text-danger-tint-ink"><Trash2 className="h-4 w-4" /></button></div></div>
      <div className="mt-3 space-y-3">{section.entries.map((entry, entryIndex) => <div key={entryIndex} className="rounded-md border border-border bg-surface p-3">
        <div className="mb-2 flex items-center justify-between"><span className="text-xs font-semibold text-ink-secondary">Item {entryIndex + 1}</span><button type="button" onClick={() => updateSection(sectionIndex, { entries: section.entries.filter((_, i) => i !== entryIndex) })} aria-label={`Remove ${entry.title || "item"}`} className="flex h-7 w-7 items-center justify-center rounded-md text-ink-muted hover:bg-danger-tint hover:text-danger-tint-ink"><Trash2 className="h-3.5 w-3.5" /></button></div>
        <div className="grid gap-2 sm:grid-cols-2"><Field label="Title" value={entry.title} onChange={(title) => updateEntry(sectionIndex, entryIndex, { title })} /><Field label="Detail" value={entry.detail} onChange={(detail) => updateEntry(sectionIndex, entryIndex, { detail })} /><Field label="Destination URL" value={entry.href} onChange={(href) => updateEntry(sectionIndex, entryIndex, { href })} placeholder="/c/sd-cards or /c?q=V90" /><Field label="Badge (optional)" value={entry.badge} onChange={(badge) => updateEntry(sectionIndex, entryIndex, { badge })} placeholder="V90, MOST POPULAR" /><label className={labelClass}>Icon<MenuIconPicker label={`${entry.title || `item ${entryIndex + 1}`} icon`} value={entry.icon} onChange={(icon) => updateEntry(sectionIndex, entryIndex, { icon })} /></label><label className="mt-5 flex items-center gap-2 text-xs font-semibold text-ink-secondary"><input type="checkbox" checked={entry.featured} onChange={(event) => updateEntry(sectionIndex, entryIndex, { featured: event.target.checked })} className="h-4 w-4 accent-ink" />Featured</label></div>
      </div>)}
      <button type="button" onClick={() => updateSection(sectionIndex, { entries: [...section.entries, { title: "", detail: "", href: "", icon: "", badge: "", featured: false }] })} className="mt-2 inline-flex h-8 items-center gap-1.5 rounded-md border border-border px-2.5 text-xs font-semibold text-ink-secondary hover:bg-surface"><Plus className="h-3.5 w-3.5" />Add item</button></div>
      {section.id === "capacity" ? <div className="mt-3 border-t border-border pt-3"><Field label="Runtime panel heading" value={section.runtimeTitle ?? ""} onChange={(runtimeTitle) => updateSection(sectionIndex, { runtimeTitle })} /><div className="mt-2 grid gap-2 sm:grid-cols-2">{(section.metrics ?? []).map((metric, metricIndex) => <div key={metricIndex} className="grid grid-cols-2 gap-2"><Field label="Metric value" value={metric.value} onChange={(value) => updateSection(sectionIndex, { metrics: section.metrics?.map((item, i) => i === metricIndex ? { ...item, value } : item) })} /><Field label="Metric label" value={metric.label} onChange={(label) => updateSection(sectionIndex, { metrics: section.metrics?.map((item, i) => i === metricIndex ? { ...item, label } : item) })} /></div>)}</div></div> : null}
    </section>)}
    <button type="button" onClick={() => onChange({ ...value, sections: [...value.sections, { id: crypto.randomUUID(), title: "New section", icon: "Package", entries: [{ title: "", detail: "", href: "", icon: "", badge: "", featured: false }] }] })} className="inline-flex h-9 items-center gap-2 rounded-md border border-border px-3 text-xs font-semibold text-ink-secondary hover:bg-canvas"><Plus className="h-4 w-4" />Add section</button>
    <section className="rounded-lg border border-border p-3"><h3 className="text-sm font-semibold text-ink">Promo card</h3><div className="mt-2 grid gap-2 sm:grid-cols-2">{(["eyebrow", "title", "description", "detail", "benchmark", "voucherLabel", "voucherCode", "ctaLabel", "href"] as const).map((key) => <Field key={key} label={key.replace(/[A-Z]/g, (letter) => ` ${letter}`).replace(/^./, (letter) => letter.toUpperCase())} value={value.promo[key]} onChange={(fieldValue) => updatePromo({ [key]: fieldValue })} />)}</div></section>
    <section className="rounded-lg border border-border p-3"><h3 className="text-sm font-semibold text-ink">Bottom strip</h3><div className="mt-2 grid gap-2 sm:grid-cols-2">{(["message", "emphasis", "detail", "firstLinkLabel", "firstLinkHref", "secondLinkLabel", "secondLinkHref"] as const).map((key) => <Field key={key} label={key.replace(/[A-Z]/g, (letter) => ` ${letter}`).replace(/^./, (letter) => letter.toUpperCase())} value={value.footer[key]} onChange={(fieldValue) => updateFooter({ [key]: fieldValue })} />)}</div></section>
  </div>;
}