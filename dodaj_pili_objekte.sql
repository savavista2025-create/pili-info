update objekti
set aktivan = false
where sifra in ('BECMEN', 'PILI2');

insert into objekti (naziv, sifra, aktivan)
values
  ('PILI 1', 'PILI1', true),
  ('PILI Plus', 'PILI_PLUS', true),
  ('PILI Boljevci', 'PILI_BOLJEVCI', true),
  ('PILI Galerija', 'PILI_GALERIJA', true),
  ('PILI Pakeraj', 'PILI_PAKERAJ', true),
  ('PILI Centralni Magacin', 'PILI_CENTRALNI_MAGACIN', true)
on conflict (sifra)
do update set naziv = excluded.naziv, aktivan = true;
