-- POKRENUTI JEDNOM u Supabase SQL Editoru, BEZ brisanja postojećih podataka.
-- Stari promet ostaje bez oznake kase, prikazuje se kao raniji unos.
alter table promet add column if not exists kasa text;
alter table promet add column if not exists osnovica_10 numeric;
alter table promet add column if not exists pdv_10 numeric;
alter table promet add column if not exists osnovica_20 numeric;
alter table promet add column if not exists pdv_20 numeric;
alter table promet add column if not exists bez_pdv numeric;
-- Ova polja čuvaju jasno dokumentovane iznose, a ne nagađanje o istorijskim unosima.
alter table radnici add column if not exists vrsta_angazovanja text default 'radnik';
alter table radnici add column if not exists isplata_racun numeric default 0;
alter table radnici add column if not exists isplata_kes numeric default 0;
alter table radnici add column if not exists porez_iznos numeric default 0;
-- Postojeći doprinos_iznos ostaje sačuvan. Iznosi radnika su evidencija, ne automatski obračun.
alter table troskovi add column if not exists pdv_odbitak_status text default 'provera';
alter table troskovi add column if not exists pdv_odbitak_iznos numeric;
alter table troskovi add column if not exists pdv_ai_razlog text;
-- Ne menjati automatski stare redove: ostaju na proveri.

-- Obračuni po mesecu su odvojeni od matičnih podataka zaposlenih.
alter table plate add column if not exists porez numeric default 0;
alter table plate add column if not exists doprinosi numeric default 0;
