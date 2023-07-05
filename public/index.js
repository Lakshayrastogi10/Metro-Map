document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("pathForm");
  const resultDiv = document.getElementById("result");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const source = document.getElementById("source").value;
    const destination = document.getElementById("destination").value;

    const response = await fetch(`/shortestPath/${source}/${destination}`);
    const data = await response.json();

    if (data.error) {
      resultDiv.innerHTML = `<p>${data.error}</p>`;
    } else {
      const shortestPath = data.shortestPath.join(" -> ");
      const cost = data.cost;
      resultDiv.innerHTML = `<p>Shortest Path: ${shortestPath}</p><p>Cost: ${cost}</p>`;
    }
  });
});
