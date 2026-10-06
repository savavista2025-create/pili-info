"use client";
import { useState } from "react";
import Top from "@/components/Top";
import { useData } from "@/components/DataProvider";
import { rsd } from "@/components/Money";

const pct=(a,b)=> b===0 ? (a===0?"0.0%":"—") : `${(((a-b)/Math.abs(b))*100).toFixed(1)}%`;
const prevMonth=m=>{const [y,mo]=m.split("-").map(Number);const d=new Date(y,mo-2,1);return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}`};
const yearAgo=m=>`${Number(m.slice(0,4))-1}${m.slice(4)}`;

export default function Page(){
  const d=useData(); const [m,setM]=useState(new Date().toISOString().slice(0,7)); const [mode,setMode]=useState("prev"); const year=Number(m.slice(0,4));
  function metrics(objId,month){
    const p=d.promet.filter(x=>x.objekat_id===objId&&x.mesec?.slice(0,7)===month); const promet=p.reduce((s,x)=>s+Number(x.promet||0),0); const racuni=p.reduce((s,x)=>s+Number(x.broj_racuna||0),0);
    const plate=d.plate.filter(x=>x.objekat_id===objId&&x.mesec?.slice(0,7)===month).reduce((s,x)=>s+Number(x.neto||0)+Number(x.bonus||0),0);
    const tros=d.troskovi.filter(x=>x.objekat_id===objId&&x.datum?.slice(0,7)===month).reduce((s,x)=>s+Number(x.iznos||0),0);
    const mes=d.evidencije.filter(x=>x.objekat_id===objId&&x.datum_dospeca?.slice(0,7)===month).reduce((s,x)=>s+Number(x.iznos||0),0);
    return {promet,racuni,prosek:racuni?promet/racuni:0,plate,troskovi:tros+mes,rezultat:promet-plate-tros-mes};
  }
  function annual(objId,y){
    const months=Array.from({length:12},(_,i)=>`${y}-${String(i+1).padStart(2,"0")}`); return months.map(mm=>metrics(objId,mm)).reduce((a,x)=>({promet:a.promet+x.promet,racuni:a.racuni+x.racuni,plate:a.plate+x.plate,troskovi:a.troskovi+x.troskovi,rezultat:a.rezultat+x.rezultat}),{promet:0,racuni:0,plate:0,troskovi:0,rezultat:0});
  }
  const compareMonth=mode==="prev"?prevMonth(m):yearAgo(m);
  return <>
    <Top title="Analiza" subtitle="Poređenje poslovanja po objektima i periodima"><input type="month" value={m} onChange={e=>setM(e.target.value)}/></Top>
    <div className="mode-tabs">
      <button className={mode==="prev"?"mode active":"mode"} onClick={()=>setMode("prev")}>Prethodni mesec</button>
      <button className={mode==="yearago"?"mode active":"mode"} onClick={()=>setMode("yearago")}>Isti mesec prošle godine</button>
      <button className={mode==="annual"?"mode active":"mode"} onClick={()=>setMode("annual")}>Cela godina / prošle godine</button>
    </div>
    {mode!=="annual" ? <div className="table"><table><thead><tr><th>Objekat</th><th>Promet {m}</th><th>Promet {compareMonth}</th><th>Δ promet</th><th>Δ računi</th><th>Δ prosek</th><th>Δ plate</th><th>Δ troškovi</th><th>Rezultat {m}</th><th>Rezultat {compareMonth}</th><th>Δ rezultat</th></tr></thead><tbody>{d.objekti.map(o=>{const a=metrics(o.id,m),b=metrics(o.id,compareMonth);return <tr key={o.id}><td><b>{o.naziv}</b></td><td>{rsd(a.promet)}</td><td>{rsd(b.promet)}</td><td className={a.promet>=b.promet?"good":"bad"}>{pct(a.promet,b.promet)}</td><td>{pct(a.racuni,b.racuni)}</td><td>{pct(a.prosek,b.prosek)}</td><td>{pct(a.plate,b.plate)}</td><td>{pct(a.troskovi,b.troskovi)}</td><td className={a.rezultat>=0?"good":"bad"}>{rsd(a.rezultat)}</td><td>{rsd(b.rezultat)}</td><td className={a.rezultat>=b.rezultat?"good":"bad"}>{pct(a.rezultat,b.rezultat)}</td></tr>})}</tbody></table></div>
    : <div className="annual-block">{d.objekti.map(o=><div className="annual-card" key={o.id}><h3>{o.naziv}</h3><div className="table"><table><thead><tr><th>Godina</th><th>Promet</th><th>Broj računa</th><th>Plate</th><th>Troškovi</th><th>Rezultat</th><th>Promena rezultata</th></tr></thead><tbody>{[year,year-1,year-2,year-3].map((y,i)=>{const a=annual(o.id,y),b=annual(o.id,y-1);return <tr key={y}><td><b>{y}</b></td><td>{rsd(a.promet)}</td><td>{a.racuni}</td><td>{rsd(a.plate)}</td><td>{rsd(a.troskovi)}</td><td className={a.rezultat>=0?"good":"bad"}>{rsd(a.rezultat)}</td><td>{pct(a.rezultat,b.rezultat)}</td></tr>})}</tbody></table></div></div>)}</div>}
    <div className="notice section">Rezultat je operativni rezultat na osnovu unetog prometa, plata, računa i mesečnih troškova.</div>
  </>
}
