export const formatDate = (date: string) => {
  const dateStr = date,
    [yyyy, mm, dd, hh, mi] = dateStr.split(/[/:\-T]/);
  return `${dd}-${mm}-${yyyy} ${hh}:${mi}`;
};

export function sum(a: number, b: number) {
  return a + b;
}
