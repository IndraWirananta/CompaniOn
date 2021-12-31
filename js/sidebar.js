let arrow = document.querySelectorAll(".arrow");
for (var i = 0; i < arrow.length; i++) {
    arrow[i].addEventListener("click", (e) => {
        let arrowParent = e.target.parentElement.parentElement;
        arrowParent.classList.toggle("showMenu");
    });
}
let burger = document.querySelector(".burger-icon");
burger.addEventListener("click", () => {
    if (burger.classList.contains('arrow')) {
        burger.classList.remove('arrow');
    } else {
        burger.classList.add('arrow');
    }
});

let sidebar = document.querySelector(".sidebar");
let sidebarBtn = document.querySelector(".bxs-chevron-right");
sidebarBtn.addEventListener("click", () => {
    sidebar.classList.toggle("close");
});