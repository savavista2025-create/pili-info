export const runtime = "nodejs";

function cleanJson(s){
  const t=(s||"").trim().replace(/^```json\s*/i,"").replace(/```$/i,"").trim();
  const a=t.indexOf("{"),b=t.lastIndexOf("}");
  if(a<0||b<a) throw new Error("AI nije vratio JSON podatke.");
  return JSON.parse(t.slice(a,b+1));
}

export async function POST(req){
  try{
    if(!process.env.OPENAI_API_KEY) return Response.json({error:"Nedostaje OPENAI_API_KEY u .env.local."},{status:500});
    const fd=await req.formData(); const file=fd.get("image");
    if(!file) return Response.json({error:"Slika nije poslata."},{status:400});
    const bytes=Buffer.from(await file.arrayBuffer());
    const dataUrl=`data:${file.type||"image/jpeg"};base64,${bytes.toString("base64")}`;
    const prompt=`Pročitaj fotografiju fiskalnog periodičnog/mesečnog izveštaja iz Srbije. Vrati ISKLJUČIVO JSON bez markdowna sa ključevima: mesec (YYYY-MM-01), promet (broj), broj_racuna (ceo broj), pdv (broj), gotovina (broj), kartice (broj), napomena (kratak tekst). Ako nešto nije jasno vrati null za to polje. Nemoj izmišljati cifre. Brojeve vrati bez tačaka za hiljade i bez oznake valute.`;
    const r=await fetch("https://api.openai.com/v1/responses",{method:"POST",headers:{"Authorization":`Bearer ${process.env.OPENAI_API_KEY}`,"Content-Type":"application/json"},body:JSON.stringify({model:"gpt-5.6-luna",input:[{role:"user",content:[{type:"input_text",text:prompt},{type:"input_image",image_url:dataUrl,detail:"high"}]}]})});
    const j=await r.json(); if(!r.ok) return Response.json({error:j?.error?.message||"OpenAI API greška."},{status:r.status});
    return Response.json(cleanJson(j.output_text));
  }catch(e){return Response.json({error:e.message||"Greška pri čitanju izveštaja."},{status:500})}
}
