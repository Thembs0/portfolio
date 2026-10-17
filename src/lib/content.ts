import { useEffect, useState } from "react";
import { hasSupabase, supabase } from "./supabase";
import {
  services as fallbackServices,
  fallbackSkills,
  fallbackCredentials,
  fallbackProfile,
  type Service,
  type Skill,
  type Credential,
  type Profile,
} from "./types";

// ------------------------------------------------------------
// Services
// ------------------------------------------------------------
export function useServices() {
  const [services, setServices] = useState<Service[]>(fallbackServices);
  useEffect(() => {
    if (!hasSupabase) return;
    let alive = true;
    supabase
      .from("services")
      .select("*")
      .eq("published", true)
      .order("sort_order", { ascending: true })
      .then(({ data, error }) => {
        if (!alive) return;
        if (error || !data || data.length === 0) return; // keep fallbacks
        setServices(
          data.map((s: any) => ({
            id: s.id,
            title: s.title,
            description: s.description,
            items: s.items || [],
            sort_order: s.sort_order,
            published: s.published,
          }))
        );
      });
    return () => { alive = false; };
  }, []);
  return services;
}

// ------------------------------------------------------------
// Skills
// ------------------------------------------------------------
export function useSkills() {
  const [skills, setSkills] = useState<Skill[]>(fallbackSkills);
  useEffect(() => {
    if (!hasSupabase) return;
    let alive = true;
    supabase
      .from("skills")
      .select("*")
      .eq("published", true)
      .order("sort_order", { ascending: true })
      .then(({ data, error }) => {
        if (!alive) return;
        if (error || !data || data.length === 0) return;
        setSkills(data as Skill[]);
      });
    return () => { alive = false; };
  }, []);
  return skills;
}

// ------------------------------------------------------------
// Credentials
// ------------------------------------------------------------
export function useCredentials() {
  const [creds, setCreds] = useState<Credential[]>(fallbackCredentials);
  useEffect(() => {
    if (!hasSupabase) return;
    let alive = true;
    supabase
      .from("credentials")
      .select("*")
      .eq("published", true)
      .order("sort_order", { ascending: true })
      .then(({ data, error }) => {
        if (!alive) return;
        if (error || !data || data.length === 0) return;
        setCreds(data as Credential[]);
      });
    return () => { alive = false; };
  }, []);
  return creds;
}

// ------------------------------------------------------------
// Profile
// ------------------------------------------------------------
export function useProfile() {
  const [profile, setProfile] = useState<Profile>(fallbackProfile);
  useEffect(() => {
    if (!hasSupabase) return;
    let alive = true;
    supabase
      .from("profile")
      .select("*")
      .eq("id", 1)
      .maybeSingle()
      .then(({ data, error }) => {
        if (!alive) return;
        if (error || !data) return;
        setProfile({ ...fallbackProfile, ...(data as Profile) });
      });
    return () => { alive = false; };
  }, []);
  return profile;
}