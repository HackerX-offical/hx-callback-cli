export function truncateBody(body: string, max = 2048): string {
  return body.slice(0, max);
}
