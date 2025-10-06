export default function errorHandler(err, _req, res, _next) {
  console.log("Working");
  if (res.status <= 200) res.status(500);
  res.json({ message: err.message });
}
