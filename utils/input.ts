export async function readUserInput(label: string) {
  process.stdout.write(label);
  for await (const input of console) {
    return input;
  }

  return "";
}
