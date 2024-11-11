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
  const links = getLinks();
  let delay = 0;

  links.forEach((link) => {
    setTimeout(() => {
      window.open(link, "_blank");
    }, delay);
    delay += 500;
  });
};

const listenToOpenAll = () => {
  const openAll = document.querySelector("#openAll");
  openAll.addEventListener("click", () => {
    openLinks();
  });
};

const listenToValidateAll = () => {
  const validateAll = document.querySelector("#validateAll");
  const checkedButtons = document.querySelectorAll(".js-quest .check");

  validateAll.addEventListener("mouseover", () => {
    checkedButtons.forEach((cButton) => {
      cButton.style.backgroundColor = "#23DC3D";
    });
  });

  validateAll.addEventListener("mouseout", () => {
    checkedButtons.forEach((cButton) => {
      cButton.style.backgroundColor = "";
    });
  });
};

const launchFunctions = () => {
  listenToOpenAll();
  listenToValidateAll();
};

document.addEventListener("DOMContentLoaded", launchFunctions);
document.addEventListener("turbo:frame-render", launchFunctions);
