# PILI INFO FINAL

1. Pokreni `MIGRACIJA_PILI_INFO.sql` jednom u Supabase SQL Editoru.
2. U `.env.local` dodaj `OPENAI_API_KEY` da radi AI čitanje periodičnog izveštaja.
3. `npm install`
4. `npm run dev -- -p 3001`
5. Otvori `http://localhost:3001`

Glavna aplikacija više nema kameru za račune. Računi se šalju iz zasebne aplikacije PILI Unos Troška.

## Plate - nova verzija
Pre pokretanja ove verzije ponovo pokreni `MIGRACIJA_PILI_INFO.sql` u Supabase SQL Editoru.
Time se dodaju polja za dogovorenu platu, doprinos u dinarima, bonus i direktno menjanje radnika iz aplikacije.
