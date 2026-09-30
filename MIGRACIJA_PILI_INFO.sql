-- Pokreni jednom u Supabase SQL Editoru
create table if not exists racun_stavke (
  id uuid primary key default gen_random_uuid(),
  trosak_id uuid not null references troskovi(id) on delete cascade,
  naziv text not null,
  kolicina numeric default 1,
  jedinicna_cena numeric default 0,
  iznos numeric default 0,
  created_at timestamptz default now()
);
alter table racun_stavke enable row level security;
drop policy if exists "pili_racun_stavke_all" on racun_stavke;
create policy "pili_racun_stavke_all" on racun_stavke for all using (true) with check (true);
insert into objekti(naziv,sifra,aktivan) values
('PILI 1','PILI1',true),('PILI Plus','PILI_PLUS',true),('PILI Boljevci','PILI_BOLJEVCI',true),('PILI Galerija','PILI_GALERIJA',true),('PILI Pakeraj','PILI_PAKERAJ',true),('PILI Centralni Magacin','PILI_CENTRALNI_MAGACIN',true)
on conflict(sifra) do update set naziv=excluded.naziv,aktivan=true;

-- PLATE / RADNICI - nova polja za direktno upravljanje iz aplikacije
alter table radnici add column if not exists dogovorena_plata numeric default 0;
alter table radnici add column if not exists doprinos_stopa numeric default 15.15;
alter table radnici add column if not exists doprinos_iznos numeric default 0;
alter table radnici add column if not exists bonus_default numeric default 0;
alter table radnici add column if not exists napomena text;

-- Pravi objekti koji se trenutno koriste
insert into objekti(naziv,sifra,aktivan) values
('PILI 1','PILI1',true),
('PILI 2','PILI2',true),
('PILI Bečmen','PILI_BECMEN',true),
('PILI Plus','PILI_PLUS',true),
('PILI Boljevci','PILI_BOLJEVCI',true),
('PILI Galerija','PILI_GALERIJA',true),
('PILI Pakeraj','PILI_PAKERAJ',true),
('PILI Centralni Magacin','PILI_CENTRALNI_MAGACIN',true)
on conflict(sifra) do update set naziv=excluded.naziv,aktivan=true;

-- Dodatna polja koja koristi ekran Plate
alter table radnici add column if not exists doprinos_iznos numeric default 0;
alter table radnici add column if not exists bonus_default numeric default 0;
alter table radnici add column if not exists dogovorena_plata numeric default 0;
alter table radnici add column if not exists doprinos_stopa numeric default 15.15;
