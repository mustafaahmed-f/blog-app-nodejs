export function pagination({
  page = 1,
  size = 10,
}: {
  page: number;
  size: number;
}) {
  const take = size;
  const skip = (page - 1) * size;
  return { take, skip };
}
