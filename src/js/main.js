//#region HEADER
// const btnMobile = document.getElementById("btn-mobile");

// function toggleMenu(event) {
//   if (event.type === "touchstart") event.preventDefault();
//   const nav = document.getElementById("nav");
//   nav.classList.toggle("active");
//   const active = nav.classList.contains("active");
//   event.currentTarget.setAttribute("aria-expanded", active);

//   if (active) {
//     event.currentTarget.setAttribute("aria-label", "Fechar Menu");
//   } else {
//     event.currentTarget.setAttribute("aria-label", "Abrir Menu");
//   }
// }

// btnMobile.addEventListener("click", toggleMenu);
// btnMobile.addEventListener("touchstart", toggleMenu);
//#endregion

//#region HEADER
var pages = new Array("one", "two", "three", "four");

function toggleMenu() {
  document.getElementsByClassName("wrapper")[0].classList.toggle("menu-open");
}

function goToPage(page) {
  var wrapper = document.getElementsByClassName("wrapper")[0];
  var sections = document.getElementsByTagName("section");

  for (let i = 0; i < sections.length; i++) {
    sections[i].classList.remove("before", "after");

    if (i > page) {
      sections[i].classList.add("after");
    }
  }

  wrapper.classList.remove("menu-open", "page-one", "page-two");
  wrapper.classList.add("page-" + pages[page]);
}
//#endregion
