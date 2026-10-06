"use client";
import { useState } from "react";
import Top from "@/components/Top";
import { useData } from "@/components/DataProvider";
import { rsd } from "@/components/Money";

export default function Page(){
  const d=useData(); const [q,setQ]=useState(""); const s=q.trim().toLowerCase();
  const itemMatches=new Set(d.racun_stavke.filter(i=>String(i.naziv||"").toLowerCase().includes(s)).map(i=>i.trosak_id));
  const rows=d.troskovi.filter(x=>!s || itemMatches.has(x.id) || [x.dobavljac,x.broj_racuna,x.naziv_artikla,x.kategorija,x.napomena,x.datum,String(x.iznos)].some(v=>String(v||"").toLowerCase().includes(s)));
  const itemNames=id=>d.racun_stavke.filter(i=>i.trosak_id===id).map(i=>i.naziv).filter(Boolean).join(", ");
  return <>
    <Top title="Arhiva računa" subtitle="Pronađi račun po artiklu, dobavljaču, datumu, broju računa ili iznosu"><input className="search-wide" placeholder="Npr. frižider, Gigatron, 74990..." value={q} onChange={e=>setQ(e.target.value)}/></Top>
    <div className="table"><table><thead><tr><th>Datum</th><th>Objekat</th><th>Dobavljač</th><th>Artikli</th><th>Iznos</th><th>Garancija</th><th>Dokument</th></tr></thead><tbody>{rows.map(x=><tr key={x.id}><td>{x.datum}</td><td>{d.objekti.find(o=>o.id===x.objekat_id)?.naziv||"-"}</td><td>{x.dobavljac}</td><td>{itemNames(x.id)||x.naziv_artikla||"-"}</td><td>{rsd(x.iznos)}</td><td>{x.garancija_do||"-"}</td><td>{x.dokument_url?<a className="btn light" target="_blank" href={x.dokument_url}>Otvori račun</a>:"-"}</td></tr>)}</tbody></table></div>
  </>
}
