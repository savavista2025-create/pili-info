create extension if not exists pgcrypto;

create table if not exists objekti (
  id uuid primary key default gen_random_uuid(),
  naziv text not null,
  sifra text unique,
  aktivan boolean default true,
  created_at timestamptz default now()
);

create table if not exists promet (
  id uuid primary key default gen_random_uuid(),
  objekat_id uuid references objekti(id) on delete cascade,
  mesec date not null,
  promet numeric default 0,
  broj_racuna integer default 0,
  pdv numeric default 0,
  gotovina numeric default 0,
  kartice numeric default 0,
  napomena text,
  dokument_url text,
  created_at timestamptz default now()
);

create table if not exists radnici (
  id uuid primary key default gen_random_uuid(),
  objekat_id uuid references objekti(id) on delete set null,
  ime_prezime text not null,
  pozicija text,
  status text default 'redovno zaposlen',
  aktivan boolean default true,
  created_at timestamptz default now()
);

create table if not exists plate (
  id uuid primary key default gen_random_uuid(),
  radnik_id uuid references radnici(id) on delete cascade,
  objekat_id uuid references objekti(id) on delete set null,
  mesec date not null,
  neto numeric default 0,
  preko_racuna numeric default 0,
  gotovina numeric default 0,
  bonus numeric default 0,
  odbici numeric default 0,
  trosak_poslodavca numeric default 0,
  vrsta text,
  dokument_url text,
  created_at timestamptz default now()
);

create table if not exists troskovi (
  id uuid primary key default gen_random_uuid(),
  objekat_id uuid references objekti(id) on delete set null,
  datum date not null default current_date,
  dobavljac text,
  broj_racuna text,
  naziv_artikla text,
  kategorija text,
  iznos numeric default 0,
  pdv numeric default 0,
  garancija_do date,
  napomena text,
  dokument_url text,
  created_at timestamptz default now()
);

create table if not exists evidencije (
  id uuid primary key default gen_random_uuid(),
  objekat_id uuid references objekti(id) on delete set null,
  naziv text not null,
  kategorija text,
  iznos numeric default 0,
  datum_dospeca date,
  datum_placanja date,
  placeno boolean default false,
  ponavlja_se boolean default false,
  napomena text,
  dokument_url text,
  created_at timestamptz default now()
);

insert into storage.buckets (id, name, public)
values ('dokumenti', 'dokumenti', true)
on conflict (id) do nothing;

alter table objekti enable row level security;
alter table promet enable row level security;
alter table radnici enable row level security;
alter table plate enable row level security;
alter table troskovi enable row level security;
alter table evidencije enable row level security;

drop policy if exists "pili_objekti_all" on objekti;
create policy "pili_objekti_all" on objekti for all using (true) with check (true);

drop policy if exists "pili_promet_all" on promet;
create policy "pili_promet_all" on promet for all using (true) with check (true);

drop policy if exists "pili_radnici_all" on radnici;
create policy "pili_radnici_all" on radnici for all using (true) with check (true);

drop policy if exists "pili_plate_all" on plate;
create policy "pili_plate_all" on plate for all using (true) with check (true);

drop policy if exists "pili_troskovi_all" on troskovi;
create policy "pili_troskovi_all" on troskovi for all using (true) with check (true);

drop policy if exists "pili_evidencije_all" on evidencije;
create policy "pili_evidencije_all" on evidencije for all using (true) with check (true);

drop policy if exists "pili_dokumenti_insert" on storage.objects;
create policy "pili_dokumenti_insert"
on storage.objects for insert
with check (bucket_id = 'dokumenti');

drop policy if exists "pili_dokumenti_select" on storage.objects;
create policy "pili_dokumenti_select"
on storage.objects for select
using (bucket_id = 'dokumenti');

update objekti set aktivan = false where sifra in ('BECMEN','PILI2');

insert into objekti (naziv, sifra, aktivan) values ('PILI 1','PILI1',true)
on conflict (sifra) do update set naziv=excluded.naziv, aktivan=true;
insert into objekti (naziv, sifra, aktivan) values ('PILI Plus','PILI_PLUS',true)
on conflict (sifra) do update set naziv=excluded.naziv, aktivan=true;
insert into objekti (naziv, sifra, aktivan) values ('PILI Boljevci','PILI_BOLJEVCI',true)
on conflict (sifra) do update set naziv=excluded.naziv, aktivan=true;
insert into objekti (naziv, sifra, aktivan) values ('PILI Galerija','PILI_GALERIJA',true)
on conflict (sifra) do update set naziv=excluded.naziv, aktivan=true;
insert into objekti (naziv, sifra, aktivan) values ('PILI Pakeraj','PILI_PAKERAJ',true)
on conflict (sifra) do update set naziv=excluded.naziv, aktivan=true;
insert into objekti (naziv, sifra, aktivan) values ('PILI Centralni Magacin','PILI_CENTRALNI_MAGACIN',true)
on conflict (sifra) do update set naziv=excluded.naziv, aktivan=true;
