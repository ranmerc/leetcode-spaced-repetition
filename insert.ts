import { Database } from "bun:sqlite";
import { Problem } from "./types/problem";

async function input(label: string) {
  process.stdout.write(label);
  for await (const input of console) {
    return input;
  }
}

const db = new Database("db.sqlite");

const name = await input("Problem name: ");
const url = await input("Problem URL: ");
const confidence = Number(await input("Confidence level: "));
const date = new Date().toISOString().substring(0, 10);

const { data, error } = Problem.safeParse({
  name,
  url,
  confidence,
  date,
  times: 1,
});

if (error) {
  console.error(error);
  process.exit(1);
}

const result = db.query(`
  INSERT INTO 'problems' (name, url, date, confidence, times) 
  VALUES ($1, $2, $3, $4, $5)
  ON CONFLICT(url) 
  DO UPDATE SET times = excluded.times + 1, date = $3, confidence = $4;
`);

result.run({
  $1: data.name,
  $2: data.url,
  $3: data.date,
  $4: data.confidence,
  $5: data.times,
});

console.log("Problem added successfully!");

db.close();
