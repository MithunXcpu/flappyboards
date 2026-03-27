export function formatNowPlaying(title: string, artist: string): string[] {
  const maxWidth = 22;

  const truncate = (s: string) =>
    s.length > maxWidth ? s.slice(0, maxWidth - 1) + "." : s;

  const center = (s: string) => {
    const pad = Math.max(0, Math.floor((maxWidth - s.length) / 2));
    return " ".repeat(pad) + s;
  };

  return [
    "",
    center("NOW PLAYING"),
    center(truncate(title.toUpperCase())),
    "",
    center("- " + truncate(artist.toUpperCase())),
    "",
  ];
}
