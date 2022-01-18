export async function getOrgAccessUrls(slug: string) {
  return await fetch("/api/v1/org/open?slug=" + encodeURIComponent(slug));
}
