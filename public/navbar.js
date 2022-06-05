let toggleSwitch = document.querySelector("#toggle")
toggleSwitch.addEventListener("click",()=>{
    console.log("toggled")
    let toggleElements = document.querySelectorAll(".navItem, #s-icon, #search-box")
    console.log(toggleElements.length);
    let header = document.querySelector("header")
    for (const element of toggleElements) {
        element.classList.toggle("toggling");
    }
    header.classList.toggle("headerAdjust")
    
})

