document.addEventListener("DOMContentLoaded",function(){

console.log("Portfolio loaded");

// =========================
// MOBILE HAMBURGER MENU
// =========================
const hamburger=document.getElementById("hamburger");
const navLinks=document.querySelector(".nav-links");
const navItems=document.querySelectorAll(".nav-links a");

// Toggle menu
if(hamburger && navLinks){

hamburger.addEventListener("click",function(){
navLinks.classList.toggle("active");
hamburger.classList.toggle("active");
});

// Close menu on click
navItems.forEach(link=>{
link.addEventListener("click",function(){
navLinks.classList.remove("active");
hamburger.classList.remove("active");
});
});

}

// =========================
// SMOOTH SCROLL
// =========================
const links=document.querySelectorAll("a[href^='#']");

links.forEach(link=>{
link.addEventListener("click",function(e){
e.preventDefault();

const target=document.querySelector(this.getAttribute("href"));

if(target){
window.scrollTo({
top:target.offsetTop-60,
behavior:"smooth"
});
}

});
});

// =========================
// ACTIVE LINK ON SCROLL
// =========================
const sections=document.querySelectorAll("section");

window.addEventListener("scroll",function(){

let current="";

sections.forEach(section=>{
const sectionTop=section.offsetTop-80;
if(pageYOffset>=sectionTop){
current=section.getAttribute("id");
}
});

navItems.forEach(link=>{
link.classList.remove("active");

if(link.getAttribute("href")==="#"+current){
link.classList.add("active");
}

});

});

});
