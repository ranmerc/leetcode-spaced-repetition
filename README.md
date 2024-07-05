# Leetcode Spaced Repetition

Leetcode Spaced Repetition is a command line tool to get suggestions on what problem to solve (revise) next based on the set of previously solved problems.

## Requirements

- [bun](https://bun.sh/) runtime installed locally
- [sqlite](https://sqlite.org/) installed for local db
- [turso](https://turso.tech/) hosted db if you wish to use hosted version

## Setup

1. Clone repository

```console
git clone https://github.com/ranmerc/leetcode-spaced-repetition
```

2. Install dependencies

```console
bun i
```

3. Setup environment variables

- Copy over `.env.example` at root to `.env` and fill in the values.
- Set `TYPE` to `local` if you wish to local sqlite db instance.
- If `local` set `DB_PATH` to the file path name where you'd like to store the local sqlite3 db file.
- Set `TYPE` to `hosted` if you wish to use hosted turso db instance.
- Create a db on turso and execute the table sql present in [migrations](./migrations/create_practice_table.sql).
- Generate and fill in the `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` referring [turso auth docs](https://docs.turso.tech/cli/auth/token).

4. Run the app

```console
bun index.ts
```

And follow the accordingly.
