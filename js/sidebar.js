let arrow = document.querySelectorAll(".arrow");
for (var i = 0; i < arrow.length; i++) {
    arrow[i].addEventListener("click", (e) => {
        let arrowParent = e.target.parentElement.parentElement;
        arrowParent.classList.toggle("showMenu");
    });
}
let burger = document.querySelector(".burger_icon");
burger.addEventListener("click", () => {
    if (burger.classList.contains('bxs-chevron-right')) {
        burger.classList.add('bxs-chevron-left');
        burger.classList.remove('bxs-chevron-right');
    } else {
        burger.classList.add('bxs-chevron-right');
        burger.classList.remove('bxs-chevron-left');
    }
});

let sidebar = document.querySelector(".sidebar");
let sidebarBtn = document.querySelector(".bxs-chevron-right");
sidebarBtn.addEventListener("click", () => {
    sidebar.classList.toggle("close");
});