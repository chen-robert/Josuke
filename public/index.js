$.get("/api/data", data => {
  const el = document.createElement("div");
  el.innerHTML = data;

  window.el = el;

  const children = Array.from(el.children)
    .filter(el => !["H1", "H2"].includes(el.tagName));
  const tags = [];

  let curr = { innerText: "", children: [] };
  for (let i = 0; i < children.length; i++) {
    const a = children[i];
    if (["H3"].includes(a.tagName)) {
      tags.push(curr);
      curr = { innerText: a.innerText, children: [] };
    } else {
      curr.children.push(a);
    }
  }
  tags.push(curr);

  const subText = a => {
    return `<p class="subtext">${a.innerHTML}</p>`;
  };
  const buildTag = a => {
    return `
  <strong class="tag">${a.innerText.split("T.").join("<br>T.")}</strong>
  ${
    a.children.length === 0
      ? "<br>"
      : `
  <section class="subtext-wrapper">
    <div class="subtext-container">
      ${a.children.map(subText).join("")}
    </div>
  </section>
  `
  }
  `;
  };
  const build = name => {
    $("#results").html(
      `
<h3 id="section-${name}" class="section-title">${name}</h3>
${tags
  .filter(a => a.innerText.toLowerCase().includes(name.toLowerCase()))
  .map(buildTag)
  .filter((v, i, a) => a.indexOf(v) === i)
  .join("")}
`
    );
  };
  window.build = build;
  $("#loading").hide();
});

const search = elem => {
  if (event.keyCode === 13) {
    const query = elem.value;
    elem.value = "";
    if (query.trim() === "") return;
    build(query);
  }
};
