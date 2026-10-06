"use client";
import { useState } from "react";
import Top from "@/components/Top";
import { useData } from "@/components/DataProvider";
import { rsd } from "@/components/Money";

export default function Page() {
  const d=useData();
  const [f,setF]=useState({objekat_id:"",naziv:"",kategorija:"Kirija",iznos:"",datum_dospeca:new Date().toISOString().slice(0,10),placeno:false,ponavlja_se:false,napomena:""});
  async function save(e){e.preventDefault();try{await d.insert("evidencije",{...f,iznos:+f.iznos||0});alert("Sačuvano.")}catch(err){alert(err.message)}}
  return <>
    <Top title="Mesečni troškovi" subtitle="Kirije, zakup, komunalije i ostale mesečne obaveze"/>
    <form className="card form" onSubmit={save}>
      <select required value={f.objekat_id} onChange={e=>setF({...f,objekat_id:e.target.value})}><option value="">Objekat</option>{d.objekti.map(o=><option key={o.id} value={o.id}>{o.naziv}</option>)}</select>
      <input required placeholder="Naziv obaveze" value={f.naziv} onChange={e=>setF({...f,naziv:e.target.value})}/>
      <select value={f.kategorija} onChange={e=>setF({...f,kategorija:e.target.value})}><option>Kirija</option><option>Zakup</option><option>Struja</option><option>Voda</option><option>Komunalije</option><option>Internet</option><option>Knjigovođa</option><option>Gorivo</option><option>Održavanje</option><option>Ostalo</option></select>
      <input placeholder="Iznos" value={f.iznos} onChange={e=>setF({...f,iznos:e.target.value})}/>
      <input type="date" value={f.datum_dospeca} onChange={e=>setF({...f,datum_dospeca:e.target.value})}/>
      <label><input type="checkbox" checked={f.placeno} onChange={e=>setF({...f,placeno:e.target.checked})}/> Plaćeno</label>
      <label><input type="checkbox" checked={f.ponavlja_se} onChange={e=>setF({...f,ponavlja_se:e.target.checked})}/> Ponavlja se mesečno</label>
      <textarea className="wide" placeholder="Napomena" value={f.napomena} onChange={e=>setF({...f,napomena:e.target.value})}/>
      <div className="wide"><button className="btn red">Sačuvaj</button></div>
    </form>
    <div className="section"><div className="table"><table><thead><tr><th>Objekat</th><th>Naziv</th><th>Kategorija</th><th>Iznos</th><th>Dospelo</th></tr></thead><tbody>
      {d.evidencije.map(x=><tr key={x.id}><td>{d.objekti.find(o=>o.id===x.objekat_id)?.naziv||"-"}</td><td>{x.naziv}</td><td>{x.kategorija}</td><td>{rsd(x.iznos)}</td><td>{x.datum_dospeca}</td></tr>)}
    </tbody></table></div></div>
  </>
}
