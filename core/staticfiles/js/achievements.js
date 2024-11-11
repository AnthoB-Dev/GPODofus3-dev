const getLinks = () => {
  const jsQuest = document.querySelectorAll(".js-quest");
  const links = [];
  jsQuest.forEach((quest) => {
    const link = quest.querySelector("a").href;
    links.push(link);
  });
  return links;
};

const openLinks = () => {
  console.log("Button clicked");
  const links = getLinks();
  let delay = 0;

  links.forEach((link) => {
    setTimeout(() => {
      console.log("Opening link: ", link);
      window.open(link, "_blank");
    }, delay);
    delay += 500; // Délai de 500ms entre chaque ouverture
  });
};

const listenToOpenAll = () => {
  console.log("Listening");
  const openAll = document.querySelector("#openAll");
  openAll.addEventListener("click", () => {
    openLinks();
  });
};

document.addEventListener("DOMContentLoaded", listenToOpenAll);
document.addEventListener("turbo:frame-render", listenToOpenAll);
