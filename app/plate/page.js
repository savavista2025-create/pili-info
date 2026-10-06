"use client";
import { useMemo, useRef, useState } from "react";
import Top from "@/components/Top";
import { useData } from "@/components/DataProvider";
import { rsd } from "@/components/Money";

function n(v){ return Number(String(v ?? 0).replace(",",".")) || 0; }
function pct(a,b){ return b>0 ? ((a/b)*100).toFixed(2)+"%" : "0.00%"; }

export default function Page(){
  const d=useData();
  const [q,setQ]=useState("");
  const [objFilter,setObjFilter]=useState("all");
  const [month,setMonth]=useState(new Date().toISOString().slice(0,7));
  const [edit,setEdit]=useState(null);
  const [showAdd,setShowAdd]=useState(false);
  const workersSectionRef=useRef(null);
  const [newWorker,setNewWorker]=useState({ime_prezime:"",objekat_id:"",pozicija:"",dogovorena_plata:"",doprinos_iznos:"",bonus_default:"",aktivan:true});

  const rows=useMemo(()=>d.radnici.filter(r=>{
    const matchQ=(r.ime_prezime||"").toLowerCase().includes(q.toLowerCase());
    const matchObj=objFilter==="all" || (objFilter==="owners" ? !r.objekat_id : r.objekat_id===objFilter);
    return matchQ && matchObj;
  }),[d.radnici,q,objFilter]);

  const objectStats=useMemo(()=>d.objekti.map(o=>{
    const workers=d.radnici.filter(r=>r.objekat_id===o.id && r.aktivan!==false);
    const plate=workers.reduce((s,r)=>s+n(r.dogovorena_plata),0);
    const doprinosi=workers.reduce((s,r)=>s+n(r.doprinos_iznos),0);
    const bonusi=workers.reduce((s,r)=>s+n(r.bonus_default),0);
    const ukupno=plate+doprinosi+bonusi;
    const promet=d.promet.filter(x=>x.objekat_id===o.id && x.mesec?.slice(0,7)===month).reduce((s,x)=>s+n(x.promet),0);
    return {id:o.id,naziv:o.naziv,plate,doprinosi,bonusi,ukupno,promet,netoPct:pct(plate,promet),ukupnoPct:pct(ukupno,promet)};
  }),[d.objekti,d.radnici,d.promet,month]);

  async function addWorker(e){
    e.preventDefault();
    try{
      await d.insert("radnici",{
        ime_prezime:newWorker.ime_prezime.trim().toUpperCase(),
        objekat_id:newWorker.objekat_id||null,
        pozicija:newWorker.pozicija||null,
        dogovorena_plata:n(newWorker.dogovorena_plata),
        doprinos_iznos:n(newWorker.doprinos_iznos),
        bonus_default:n(newWorker.bonus_default),
        doprinos_stopa:15.15,
        aktivan:newWorker.aktivan
      });
      setNewWorker({ime_prezime:"",objekat_id:"",pozicija:"",dogovorena_plata:"",doprinos_iznos:"",bonus_default:"",aktivan:true});
      setShowAdd(false);
      alert("Radnik je dodat.");
    }catch(err){ alert(err.message); }
  }

  function openEdit(r){
    setEdit({
      id:r.id,
      ime_prezime:r.ime_prezime||"",
      objekat_id:r.objekat_id||"",
      pozicija:r.pozicija||"",
      dogovorena_plata:r.dogovorena_plata??0,
      doprinos_iznos:r.doprinos_iznos??0,
      bonus_default:r.bonus_default??0,
      doprinos_stopa:r.doprinos_stopa??15.15,
      aktivan:r.aktivan!==false
    });
  }

  function calcContribution(){
    setEdit(v=>({...v,doprinos_iznos:Math.round((n(v.dogovorena_plata)*n(v.doprinos_stopa)/100)*100)/100}));
  }

  async function saveEdit(e){
    e.preventDefault();
    try{
      await d.update("radnici",edit.id,{
        ime_prezime:edit.ime_prezime.trim().toUpperCase(),
        objekat_id:edit.objekat_id||null,
        pozicija:edit.pozicija||null,
        dogovorena_plata:n(edit.dogovorena_plata),
        doprinos_iznos:n(edit.doprinos_iznos),
        bonus_default:n(edit.bonus_default),
        doprinos_stopa:n(edit.doprinos_stopa),
        aktivan:!!edit.aktivan
      });
      setEdit(null);
      alert("Izmene su sačuvane.");
    }catch(err){ alert(err.message); }
  }

  const totalPlata=rows.reduce((s,r)=>s+n(r.dogovorena_plata),0);
  const totalDoprinos=rows.reduce((s,r)=>s+n(r.doprinos_iznos),0);
  const totalBonus=rows.reduce((s,r)=>s+n(r.bonus_default),0);
  const selectedPromet=objFilter!=="all"&&objFilter!=="owners"
    ? d.promet.filter(x=>x.objekat_id===objFilter&&x.mesec?.slice(0,7)===month).reduce((s,x)=>s+n(x.promet),0)
    : d.promet.filter(x=>x.mesec?.slice(0,7)===month).reduce((s,x)=>s+n(x.promet),0);
  const selectedTotal=totalPlata+totalDoprinos+totalBonus;

  function openStoreWorkers(storeId){
    setObjFilter(storeId);
    setQ("");
    setTimeout(()=>workersSectionRef.current?.scrollIntoView({behavior:"smooth",block:"start"}),60);
  }

  return <>
    <div className="plate-toolbar">
      <h1>Plate</h1>
      <div className="filters">
        <input type="month" value={month} onChange={e=>setMonth(e.target.value)} />
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Pretraži radnika" />
        <select value={objFilter} onChange={e=>setObjFilter(e.target.value)}>
          <option value="all">Svi objekti</option>
          {d.objekti.map(o=><option key={o.id} value={o.id}>{o.naziv}</option>)}
          <option value="owners">Vlasnici / bez objekta</option>
        </select>
        <button className="btn red mini-add-btn" onClick={()=>setShowAdd(v=>!v)}>+ Dodaj radnika</button>
      </div>
    </div>

    {d.error && <div className="notice">{d.error}</div>}

    <div className="grid metric-grid salary-summary compact-summary">
      <div className="metric-box"><div className="metric-name">PLATE</div><div className="metric-amount">{rsd(totalPlata)}</div></div>
      <div className="metric-box"><div className="metric-name">DOPRINOSI</div><div className="metric-amount">{rsd(totalDoprinos)}</div></div>
      <div className="metric-box"><div className="metric-name">BONUSI</div><div className="metric-amount">{rsd(totalBonus)}</div></div>
      <div className="metric-box"><div className="metric-name">UKUPAN TROŠAK</div><div className="metric-amount">{rsd(selectedTotal)}</div></div>
      <div className="metric-box ratio-box"><div className="metric-name">PLATE / PROMET</div><div className="metric-amount">{pct(totalPlata,selectedPromet)}</div><div className="metric-extra">Promet: {rsd(selectedPromet)}</div></div>
      <div className="metric-box ratio-box"><div className="metric-name">UKUPAN TROŠAK / PROMET</div><div className="metric-amount">{pct(selectedTotal,selectedPromet)}</div><div className="metric-extra">Plata + doprinosi + bonusi</div></div>
    </div>

    {showAdd && <div className="card compact-add-card">
      <form className="form" onSubmit={addWorker}>
        <input required placeholder="Ime i prezime" value={newWorker.ime_prezime} onChange={e=>setNewWorker({...newWorker,ime_prezime:e.target.value})}/>
        <select value={newWorker.objekat_id} onChange={e=>setNewWorker({...newWorker,objekat_id:e.target.value})}><option value="">Bez objekta / vlasnik</option>{d.objekti.map(o=><option key={o.id} value={o.id}>{o.naziv}</option>)}</select>
        <input placeholder="Pozicija" value={newWorker.pozicija} onChange={e=>setNewWorker({...newWorker,pozicija:e.target.value})}/>
        <input placeholder="Dogovorena plata" value={newWorker.dogovorena_plata} onChange={e=>setNewWorker({...newWorker,dogovorena_plata:e.target.value})}/>
        <input placeholder="Doprinosi - iznos" value={newWorker.doprinos_iznos} onChange={e=>setNewWorker({...newWorker,doprinos_iznos:e.target.value})}/>
        <input placeholder="Bonus" value={newWorker.bonus_default} onChange={e=>setNewWorker({...newWorker,bonus_default:e.target.value})}/>
        <div className="wide add-actions"><button className="btn red">Sačuvaj radnika</button><button type="button" className="btn light" onClick={()=>setShowAdd(false)}>Zatvori</button></div>
      </form>
    </div>}

    <div className="section tight-section"><h2>Trošak plata po objektu — {month}</h2><div className="table"><table>
      <thead><tr><th>Objekat</th><th>Promet</th><th>Neto plate</th><th>Doprinosi</th><th>Bonusi</th><th>Ukupan trošak</th><th>Plate / promet</th><th>Ukupan trošak / promet</th></tr></thead>
      <tbody>{objectStats.map(x=><tr key={x.id} className={objFilter===x.id?"store-row store-row-active":"store-row"} onClick={()=>openStoreWorkers(x.id)} title={`Otvori radnike - ${x.naziv}`}><td><b>{x.naziv}</b><span className="store-open-arrow">›</span></td><td>{rsd(x.promet)}</td><td>{rsd(x.plate)}</td><td>{rsd(x.doprinosi)}</td><td>{rsd(x.bonusi)}</td><td><b>{rsd(x.ukupno)}</b></td><td className="ratio-cell">{x.netoPct}</td><td className="ratio-cell strong-ratio">{x.ukupnoPct}</td></tr>)}</tbody>
    </table></div></div>

    <div className="section tight-section" ref={workersSectionRef}><h2>{objFilter!=="all"&&objFilter!=="owners" ? `Radnici — ${d.objekti.find(o=>o.id===objFilter)?.naziv || "Objekat"} (${rows.length})` : `Radnici (${rows.length})`}</h2><div className="table"><table>
      <thead><tr><th>Radnik</th><th>Objekat</th><th>Plata</th><th>Doprinosi</th><th>Bonus</th><th>Ukupan trošak</th><th>Status</th><th></th></tr></thead>
      <tbody>{rows.map(r=>{
        const obj=d.objekti.find(o=>o.id===r.objekat_id)?.naziv || (r.pozicija==="Vlasnik"?"Vlasnik":"Neraspoređen");
        const total=n(r.dogovorena_plata)+n(r.doprinos_iznos)+n(r.bonus_default);
        return <tr key={r.id}>
          <td><b>{r.ime_prezime}</b><div className="tiny-muted">{r.pozicija||""}</div></td>
          <td>{obj}</td><td>{rsd(r.dogovorena_plata)}</td><td>{rsd(r.doprinos_iznos)}</td><td>{rsd(r.bonus_default)}</td><td><b>{rsd(total)}</b></td>
          <td><span className={r.aktivan!==false?"status-on":"status-off"}>{r.aktivan!==false?"Aktivan":"Neaktivan"}</span></td>
          <td><button className="btn light" onClick={()=>openEdit(r)}>Izmeni</button></td>
        </tr>
      })}</tbody>
    </table></div></div>

    {edit && <div className="modal-backdrop" onClick={()=>setEdit(null)}>
      <div className="edit-modal" onClick={e=>e.stopPropagation()}>
        <div className="edit-modal-head"><div><div className="edit-kicker">IZMENA RADNIKA</div><h2>{edit.ime_prezime}</h2></div><button className="close-x" onClick={()=>setEdit(null)}>×</button></div>
        <form className="form" onSubmit={saveEdit}>
          <input required placeholder="Ime i prezime" value={edit.ime_prezime} onChange={e=>setEdit({...edit,ime_prezime:e.target.value})}/>
          <select value={edit.objekat_id} onChange={e=>setEdit({...edit,objekat_id:e.target.value})}><option value="">Bez objekta / vlasnik</option>{d.objekti.map(o=><option key={o.id} value={o.id}>{o.naziv}</option>)}</select>
          <input placeholder="Pozicija" value={edit.pozicija} onChange={e=>setEdit({...edit,pozicija:e.target.value})}/>
          <input placeholder="Dogovorena plata" value={edit.dogovorena_plata} onChange={e=>setEdit({...edit,dogovorena_plata:e.target.value})}/>
          <input placeholder="Doprinosi - iznos" value={edit.doprinos_iznos} onChange={e=>setEdit({...edit,doprinos_iznos:e.target.value})}/>
          <input placeholder="Bonus" value={edit.bonus_default} onChange={e=>setEdit({...edit,bonus_default:e.target.value})}/>
          <input placeholder="Stopa doprinosa %" value={edit.doprinos_stopa} onChange={e=>setEdit({...edit,doprinos_stopa:e.target.value})}/>
          <button type="button" className="btn light" onClick={calcContribution}>Izračunaj doprinose po stopi</button>
          <label className="check-line"><input type="checkbox" checked={edit.aktivan} onChange={e=>setEdit({...edit,aktivan:e.target.checked})}/> Aktivan radnik</label>
          <div className="wide modal-actions"><button type="button" className="btn light" onClick={()=>setEdit(null)}>Otkaži</button><button className="btn red">Sačuvaj izmene</button></div>
        </form>
      </div>
    </div>}
  </>;
}
