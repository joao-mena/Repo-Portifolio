//#region VERSION MOBILE
if (window.innerWidth < 992) {
  let pages = new Array("one", "two", "three", "four");

  function toggleMenu() {
    document.getElementsByClassName("wrapper")[0].classList.toggle("menu-open");
  }

  function goToPage(page) {
    let wrapper = document.getElementsByClassName("wrapper")[0];
    let sections = document.getElementsByTagName("section");

    for (let i = 0; i < sections.length; i++) {
      sections[i].classList.remove("before", "after");

      if (i > page) {
        sections[i].classList.add("after");
      }
    }

    wrapper.classList.remove("menu-open", "page-one", "page-two");
    wrapper.classList.add("page-" + pages[page]);
  }
}
//#endregion
