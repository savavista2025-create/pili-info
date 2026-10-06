"use client";
import { useState } from "react";
import BannerLink from "@/components/BannerLink";
import Top from "@/components/Top";
import { useData } from "@/components/DataProvider";
import { rsd } from "@/components/Money";

export default function Home(){
  const d=useData();
  const [month,setMonth]=useState(new Date().toISOString().slice(0,7));
  const [obj,setObj]=useState("all");
  const filt=(x,dateField)=> (obj==="all"||x.objekat_id===obj) && x[dateField]?.slice(0,7)===month;
  const p=d.promet.filter(x=>filt(x,"mesec"));
  const pl=d.plate.filter(x=>filt(x,"mesec"));
  const tr=d.troskovi.filter(x=>filt(x,"datum"));
  const ev=d.evidencije.filter(x=>filt(x,"datum_dospeca"));
  const promet=p.reduce((s,x)=>s+Number(x.promet||0),0);
  const broj=p.reduce((s,x)=>s+Number(x.broj_racuna||0),0);
  const plate=pl.reduce((s,x)=>s+Number(x.neto||0)+Number(x.bonus||0),0);
  const troskovi=tr.reduce((s,x)=>s+Number(x.iznos||0),0)+ev.reduce((s,x)=>s+Number(x.iznos||0),0);
  const rezultat=promet-plate-troskovi;

  return <>
    <section className="welcome-strip">
      <div>
        <div className="welcome-eyebrow">PILI POSLOVANJE</div>
        <h1>Kontrola svih objekata na jednom mestu</h1>
        <p>Promet, plate, troškovi, arhiva računa i analiza zarade po objektima.</p>
      </div>
      <div className="welcome-badge">PILI INFO</div>
    </section>

    <section className="banner-grid">
      <BannerLink href="/promet" icon="📊" title="PROMET" subtitle="Uslikaj periodični izveštaj, promet i broj računa" wide />
      <BannerLink href="/plate" icon="👥" title="PLATE" subtitle="Radnici, mesečne zarade i statusi" />
      <BannerLink href="/troskovi" icon="🧾" title="TROŠKOVI" subtitle="Računi koji stižu iz posebne aplikacije PILI Unos Troška" />
      <BannerLink href="/evidencije" icon="📅" title="MESEČNI TROŠKOVI" subtitle="Kirije, struja, voda, zakup i ponavljajuće obaveze" />
      <BannerLink href="/analiza" icon="📈" title="ANALIZA" subtitle="Mesečna i godišnja poređenja po objektima" />
      <BannerLink href="/arhiva" icon="🔎" title="ARHIVA RAČUNA" subtitle="Pronađi originalni račun po artiklu, datumu ili dobavljaču" />
    </section>

    <div className="dashboard-panel colorful-panel">
      <Top title="Brzi pregled" subtitle="Izaberi mesec i objekat">
        <input type="month" value={month} onChange={e=>setMonth(e.target.value)}/>
        <select value={obj} onChange={e=>setObj(e.target.value)}><option value="all">Svi objekti</option>{d.objekti.map(o=><option key={o.id} value={o.id}>{o.naziv}</option>)}</select>
      </Top>
      {d.error&&<div className="notice">{d.error}</div>}
      <div className="grid metric-grid">
        <div className="metric-box">
          <div className="metric-name">PROMET</div>
          <div className="metric-amount">{rsd(promet)}</div>
        </div>
        <div className="metric-box">
          <div className="metric-name">BROJ RAČUNA</div>
          <div className="metric-amount">{broj}</div>
          <div className="metric-extra">Prosečan račun: {rsd(broj?promet/broj:0)}</div>
        </div>
        <div className="metric-box">
          <div className="metric-name">PLATE</div>
          <div className="metric-amount">{rsd(plate)}</div>
        </div>
        <div className="metric-box result-box">
          <div className="metric-name">OPERATIVNI REZULTAT</div>
          <div className={"metric-amount "+(rezultat>=0?"good":"bad")}>{rsd(rezultat)}</div>
        </div>
      </div>
    </div>
  </>
}
