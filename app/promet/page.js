"use client";
import { useState } from "react";
import Top from "@/components/Top";
import { useData } from "@/components/DataProvider";
import { rsd } from "@/components/Money";

export default function Page(){
  const d=useData();
  const [file,setFile]=useState(null),[preview,setPreview]=useState(""),[reading,setReading]=useState(false);
  const [f,setF]=useState({objekat_id:"",mesec:new Date().toISOString().slice(0,7)+"-01",promet:"",broj_racuna:"",pdv:"",gotovina:"",kartice:"",napomena:""});

  function pick(e){ const x=e.target.files?.[0]; setFile(x||null); setPreview(x?URL.createObjectURL(x):""); }
  async function analyze(){
    if(!file){alert("Prvo uslikaj ili izaberi periodični izveštaj.");return}
    setReading(true);
    try{
      const fd=new FormData(); fd.append("image",file);
      const res=await fetch("/api/analyze-promet",{method:"POST",body:fd});
      const j=await res.json(); if(!res.ok) throw new Error(j.error||"AI čitanje nije uspelo.");
      setF(v=>({...v,
        mesec:j.mesec||v.mesec,
        promet:j.promet??v.promet,
        broj_racuna:j.broj_racuna??v.broj_racuna,
        pdv:j.pdv??v.pdv,
        gotovina:j.gotovina??v.gotovina,
        kartice:j.kartice??v.kartice,
        napomena:j.napomena||v.napomena
      }));
    }catch(err){alert(err.message)} finally{setReading(false)}
  }
  async function save(e){
    e.preventDefault();
    try{
      const dokument_url=file?await d.upload(file,"periodicni-izvestaji"):null;
      await d.insert("promet",{...f,promet:+f.promet||0,broj_racuna:+f.broj_racuna||0,pdv:+f.pdv||0,gotovina:+f.gotovina||0,kartice:+f.kartice||0,dokument_url});
      alert("Promet je sačuvan.");
    }catch(err){alert(err.message)}
  }
  return <>
    <Top title="Promet" subtitle="Uslikaj mesečni periodični izveštaj ili unesi podatke ručno"/>
    <div className="scan-card">
      <div className="scan-title">📷 Uslikaj periodični izveštaj</div>
      <div className="scan-sub">AI će pokušati da popuni mesec, promet, broj računa, PDV, gotovinu i kartice. Pre čuvanja obavezno proveri podatke.</div>
      <div className="scan-row">
        <input type="file" accept="image/*" capture="environment" onChange={pick}/>
        <button type="button" className="btn red" onClick={analyze} disabled={reading}>{reading?"Čitam izveštaj...":"Pročitaj sa slike"}</button>
      </div>
      {preview&&<img src={preview} alt="Periodični izveštaj" className="scan-preview"/>}
    </div>
    <form className="card form" onSubmit={save}>
      <select required value={f.objekat_id} onChange={e=>setF({...f,objekat_id:e.target.value})}><option value="">Izaberi objekat</option>{d.objekti.map(o=><option key={o.id} value={o.id}>{o.naziv}</option>)}</select>
      <input type="month" required value={f.mesec.slice(0,7)} onChange={e=>setF({...f,mesec:e.target.value+"-01"})}/>
      <input placeholder="Promet" value={f.promet} onChange={e=>setF({...f,promet:e.target.value})}/>
      <input placeholder="Broj računa" value={f.broj_racuna} onChange={e=>setF({...f,broj_racuna:e.target.value})}/>
      <input placeholder="PDV" value={f.pdv} onChange={e=>setF({...f,pdv:e.target.value})}/>
      <input placeholder="Gotovina" value={f.gotovina} onChange={e=>setF({...f,gotovina:e.target.value})}/>
      <input placeholder="Kartice" value={f.kartice} onChange={e=>setF({...f,kartice:e.target.value})}/>
      <textarea className="wide" placeholder="Napomena" value={f.napomena} onChange={e=>setF({...f,napomena:e.target.value})}/>
      <div className="wide"><button className="btn red">Sačuvaj proverene podatke</button></div>
    </form>
    <div className="section"><h2>Sačuvani mesečni izveštaji</h2><div className="table"><table><thead><tr><th>Objekat</th><th>Mesec</th><th>Promet</th><th>Broj računa</th><th>Dokument</th></tr></thead><tbody>{d.promet.map(x=><tr key={x.id}><td>{d.objekti.find(o=>o.id===x.objekat_id)?.naziv||"-"}</td><td>{x.mesec?.slice(0,7)}</td><td>{rsd(x.promet)}</td><td>{x.broj_racuna}</td><td>{x.dokument_url?<a className="btn light" target="_blank" href={x.dokument_url}>Otvori</a>:"-"}</td></tr>)}</tbody></table></div></div>
  </>
}
