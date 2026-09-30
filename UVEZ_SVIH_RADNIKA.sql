-- PILI INFO - kompletan uvoz svih radnika iz dostavljenog spiska
-- Može bezbedno da se pokrene ponovo: postojeće radnike ažurira, nedostajuće dodaje.

alter table radnici add column if not exists dogovorena_plata numeric default 0;
alter table radnici add column if not exists doprinos_stopa numeric default 15.15;
alter table radnici add column if not exists doprinos_iznos numeric default 0;
alter table radnici add column if not exists bonus_default numeric default 0;
alter table radnici add column if not exists napomena text;

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

do $$
declare
  rec record;
  oid uuid;
begin
  for rec in
    select * from (values
      ('MARIJANOVIC MILAN',80000.00,'PILI_CENTRALNI_MAGACIN',null),
      ('PAVEL DEJAN',80000.00,'PILI_PAKERAJ',null),
      ('SVILAR SLAVA',60000.00,'PILI_PAKERAJ',null),
      ('STOJANOVIC ZIVKO',100000.00,'PILI_CENTRALNI_MAGACIN',null),
      ('STOJANOVIC VESNA',100000.00,'PILI_CENTRALNI_MAGACIN',null),
      ('STOJANOVIC IVANA',95000.00,'PILI_CENTRALNI_MAGACIN',null),
      ('IVKOVIC SONJA',100000.00,'PILI_CENTRALNI_MAGACIN',null),
      ('FILIPOVIC PREDRAG',80000.00,'PILI_CENTRALNI_MAGACIN',null),
      ('GRUJIC GORAN',95000.00,'PILI_CENTRALNI_MAGACIN',null),

      ('STANKOVIC JELENA',95000.00,'PILI1',null),
      ('MLADENOVIC DALIBORKA',85000.00,'PILI1',null),
      ('UGARAK JELENA',82000.00,'PILI1',null),
      ('PAVLOVIC MILAN',78000.00,'PILI1',null),
      ('RASKOV MIROSLAVA',82000.00,'PILI1',null),
      ('MARJANOVIC JELENA',85000.00,'PILI1',null),
      ('STANKOVIC IVA',80000.00,'PILI1',null),
      ('ANDRIJASEVIC BOJANA',80000.00,'PILI1',null),

      ('CUMIC JELENA',85000.00,'PILI2',null),
      ('OTANJAC IRENA',85000.00,'PILI2',null),
      ('JOKIC SLAVICA',80000.00,'PILI2',null),
      ('NATASA MILICEVIC',78000.00,'PILI2',null),

      ('VRDOLJAK MIRJANA',87000.00,'PILI_BECMEN',null),
      ('BELIC BILJANA',85000.00,'PILI_BECMEN',null),
      ('LIDIJA',0.00,'PILI_BECMEN',null),

      ('POPOVIC MILENA',110000.00,'PILI_PLUS',null),
      ('JELENA SOLAKOVIC',80000.00,'PILI_PLUS',null),
      ('CAPRDJA ZIVKO',140000.00,'PILI_PLUS',null),
      ('RISTIVOJEVIC BRANKA',0.00,'PILI_PLUS',null),
      ('ZIGIC IVANA',90000.00,'PILI_PLUS',null),
      ('VIDAKOVIC SREBRANKA',88000.00,'PILI_PLUS',null),
      ('MLADENOVIC VESNA',78000.00,'PILI_PLUS',null),
      ('GUT MILIJANA',90000.00,'PILI_PLUS',null),
      ('KODZO MARUJA',85000.00,'PILI_PLUS',null),
      ('JELENA RACA',90000.00,'PILI_PLUS',null),

      ('MIJATOVIC OLGICA',110000.00,'PILI_BOLJEVCI',null),
      ('MILOSEVIC DANIJELA',92000.00,'PILI_BOLJEVCI',null),
      ('RATKA JOVANOVIC',88000.00,'PILI_BOLJEVCI',null),
      ('PUZIC MARIJA',87000.00,'PILI_BOLJEVCI',null),
      ('FILIPOVIC IVAN',92000.00,'PILI_BOLJEVCI',null),
      ('TOPOLSKI ZDENKA',85000.00,'PILI_BOLJEVCI',null),
      ('SPASOJEVIC SLAVICA',80000.00,'PILI_BOLJEVCI',null),
      ('NOVAKOV MARIJA',83000.00,'PILI_BOLJEVCI',null),
      ('DOBRIC MATEJA',80000.00,'PILI_BOLJEVCI',null),

      ('JOVANOVIC NADICA',70000.00,'PILI_GALERIJA',null),
      ('STANIMIROVIC NEVENKA',30000.00,'PILI_GALERIJA',null),

      ('PILIPOVIC NIKOLA',116962.56,null,'Vlasnik'),
      ('PILIPOVIC GORDANA',119962.95,null,'Vlasnik'),
      ('GREBOVIC DUSICA',116105.30,null,'Vlasnik')
    ) as x(ime,plata,sifra_objekta,pozicija)
  loop
    oid := null;
    if rec.sifra_objekta is not null then
      select id into oid from objekti where sifra=rec.sifra_objekta limit 1;
    end if;

    if exists(select 1 from radnici where upper(trim(ime_prezime))=upper(trim(rec.ime))) then
      update radnici
      set ime_prezime=rec.ime,
          objekat_id=oid,
          pozicija=coalesce(rec.pozicija,pozicija),
          dogovorena_plata=rec.plata,
          doprinos_stopa=coalesce(doprinos_stopa,15.15),
          bonus_default=coalesce(bonus_default,0),
          doprinos_iznos=coalesce(doprinos_iznos,0),
          aktivan=case when rec.plata=0 and rec.ime in ('LIDIJA','RISTIVOJEVIC BRANKA') then false else true end
      where upper(trim(ime_prezime))=upper(trim(rec.ime));
    else
      insert into radnici(ime_prezime,objekat_id,pozicija,dogovorena_plata,doprinos_stopa,doprinos_iznos,bonus_default,aktivan)
      values(rec.ime,oid,rec.pozicija,rec.plata,15.15,0,0,case when rec.plata=0 and rec.ime in ('LIDIJA','RISTIVOJEVIC BRANKA') then false else true end);
    end if;
  end loop;
end $$;

select r.ime_prezime,r.dogovorena_plata,o.naziv as objekat,r.pozicija,r.aktivan
from radnici r
left join objekti o on o.id=r.objekat_id
order by o.naziv nulls last,r.ime_prezime;
