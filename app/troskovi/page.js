"use client";
import { useState } from "react";
import Top from "@/components/Top";
import { useData } from "@/components/DataProvider";
import { rsd } from "@/components/Money";

export default function Page(){
  const d=useData(); const [obj,setObj]=useState("all"),[month,setMonth]=useState(new Date().toISOString().slice(0,7));
  const rows=d.troskovi.filter(x=>(obj==="all"||x.objekat_id===obj)&&(!month||x.datum?.slice(0,7)===month));
  const total=rows.reduce((s,x)=>s+Number(x.iznos||0),0);
  return <>
    <Top title="Troškovi" subtitle="Računi poslati iz aplikacije PILI Unos Troška">
      <input type="month" value={month} onChange={e=>setMonth(e.target.value)}/>
      <select value={obj} onChange={e=>setObj(e.target.value)}><option value="all">Svi objekti</option>{d.objekti.map(o=><option key={o.id} value={o.id}>{o.naziv}</option>)}</select>
    </Top>
    <div className="summary-strip"><span>Ukupan trošak za izbor</span><strong>{rsd(total)}</strong></div>
    <div className="table"><table><thead><tr><th>Datum</th><th>Objekat</th><th>Dobavljač</th><th>Broj računa</th><th>Kategorija</th><th>Iznos</th><th>Dokument</th></tr></thead><tbody>{rows.map(x=><tr key={x.id}><td>{x.datum}</td><td>{d.objekti.find(o=>o.id===x.objekat_id)?.naziv||"-"}</td><td>{x.dobavljac}</td><td>{x.broj_racuna}</td><td>{x.kategorija}</td><td>{rsd(x.iznos)}</td><td>{x.dokument_url?<a className="btn light" target="_blank" href={x.dokument_url}>Otvori račun</a>:"-"}</td></tr>)}</tbody></table></div>
  </>
}
