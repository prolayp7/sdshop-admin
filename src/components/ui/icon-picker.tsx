"use client";

import { useState } from "react";
import { ChevronsUpDown, Award, BadgeCheck, CheckCircle, Clock, CreditCard, Gift, Globe, HelpCircle, Headphones, Info, Lock, Mail, MapPin, Package, PackageCheck, Percent, Phone, ReceiptText, RefreshCw, RotateCcw, Settings, Share2, ShieldCheck, ShoppingBag, Sparkles, Star, Tag, ThumbsUp, Truck, Users, Wallet, Zap, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";

// A curated set of lucide icons relevant to storefront trust badges (shipping,
// support, quality, payment) - the full lucide set runs into the thousands, so
// this stays a fixed, searchable list matching what TRUST_ICONS in the
// storefront's Hero.tsx actually knows how to render.
export const ICON_OPTIONS: readonly [string, LucideIcon][] = [
  ["shield-check", ShieldCheck], ["package-check", PackageCheck], ["headphones", Headphones], ["truck", Truck],
  ["badge-check", BadgeCheck], ["check-circle", CheckCircle], ["lock", Lock], ["credit-card", CreditCard],
  ["rotate-ccw", RotateCcw], ["clock", Clock], ["star", Star], ["thumbs-up", ThumbsUp], ["gift", Gift],
  ["percent", Percent], ["tag", Tag], ["map-pin", MapPin], ["phone", Phone], ["mail", Mail],
  ["help-circle", HelpCircle], ["info", Info], ["award", Award], ["zap", Zap], ["package", Package],
  ["shopping-bag", ShoppingBag], ["wallet", Wallet], ["receipt-text", ReceiptText], ["settings", Settings],
  ["refresh-cw", RefreshCw], ["share-2", Share2], ["sparkles", Sparkles], ["globe", Globe], ["users", Users],
];
const ICON_MAP: Record<string, LucideIcon> = Object.fromEntries(ICON_OPTIONS);

export function Glyph({ name, className }: { name: string; className?: string }) {
  const Icon = ICON_MAP[name];
  return Icon ? <Icon className={className} /> : null;
}

export function IconPicker({ value, onChange, placeholder = "Choose an icon" }: { value: string; onChange: (value: string) => void; placeholder?: string }) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            type="button"
            variant="outline"
            className="mt-2 h-10 w-full justify-between px-3 font-normal"
          />
        }
      >
        <span className="flex items-center gap-2 text-[13px] text-ink">
          {value ? <Glyph name={value} className="h-4 w-4 text-ink-secondary" /> : null}
          {value || <span className="text-ink-faint">{placeholder}</span>}
        </span>
        <ChevronsUpDown className="h-3.5 w-3.5 shrink-0 text-ink-muted" />
      </PopoverTrigger>
      <PopoverContent align="start" className="w-72 p-0">
        <Command>
          <CommandInput placeholder="Search icons…" />
          <CommandList className="max-h-64">
            <CommandEmpty>No matching icon.</CommandEmpty>
            <CommandGroup>
              <div className="grid grid-cols-6 gap-1 p-2">
                {ICON_OPTIONS.map(([name]) => (
                  <CommandItem
                    key={name}
                    value={name}
                    onSelect={() => {
                      onChange(name);
                      setOpen(false);
                    }}
                    aria-label={name}
                    title={name}
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-md p-0",
                      value === name && "bg-accent-tint ring-1 ring-inset ring-accent-strong",
                    )}
                  >
                    <Glyph name={name} className="h-4.5 w-4.5" />
                  </CommandItem>
                ))}
              </div>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
