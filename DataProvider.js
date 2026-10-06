"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const DataContext = createContext(null);

export function DataProvider({children}) {
  const [data,setData] = useState({objekti:[],promet:[],radnici:[],plate:[],troskovi:[],evidencije:[],racun_stavke:[]});
  const [ready,setReady] = useState(false);
  const [error,setError] = useState("");

  async function refresh() {
    if (!supabase) { setError("Supabase nije povezan."); setReady(true); return; }
    try {
      const [o,p,r,pl,t,e,rs] = await Promise.all([
        supabase.from("objekti").select("*").eq("aktivan",true).order("naziv"),
        supabase.from("promet").select("*").order("mesec",{ascending:false}),
        supabase.from("radnici").select("*").order("ime_prezime"),
        supabase.from("plate").select("*").order("mesec",{ascending:false}),
        supabase.from("troskovi").select("*").order("datum",{ascending:false}),
        supabase.from("evidencije").select("*").order("datum_dospeca",{ascending:false}),
        supabase.from("racun_stavke").select("*")
      ]);
      const firstError=[o,p,r,pl,t,e,rs].find(x=>x.error)?.error;
      if(firstError) throw firstError;
      setData({objekti:o.data||[],promet:p.data||[],radnici:r.data||[],plate:pl.data||[],troskovi:t.data||[],evidencije:e.data||[],racun_stavke:rs.data||[]});
      setError("");
    } catch(err) { setError(err?.message || "Greška pri učitavanju podataka."); }
    finally { setReady(true); }
  }

  useEffect(()=>{refresh()},[]);

  async function insert(table,row) {
    if(!supabase) throw new Error("Supabase nije povezan.");
    const {error}=await supabase.from(table).insert(row);
    if(error) throw error;
    await refresh();
  }

  async function update(table,id,row) {
    if(!supabase) throw new Error("Supabase nije povezan.");
    const {error}=await supabase.from(table).update(row).eq("id",id);
    if(error) throw error;
    await refresh();
  }

  async function upload(file,folder="dokumenti") {
    if(!supabase) throw new Error("Supabase nije povezan.");
    if(!file) return null;
    const ext=(file.name?.split(".").pop()||"jpg").toLowerCase();
    const path=`${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const {error}=await supabase.storage.from("dokumenti").upload(path,file);
    if(error) throw error;
    return supabase.storage.from("dokumenti").getPublicUrl(path).data.publicUrl;
  }

  return <DataContext.Provider value={{...data,ready,error,refresh,insert,update,upload}}>{children}</DataContext.Provider>;
}
export function useData(){return useContext(DataContext)}
