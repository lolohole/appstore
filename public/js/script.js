// public/js/script.js

document.addEventListener("DOMContentLoaded", function () {
    console.log("الصفحة تم تحميلها بنجاح.");
  
    const links = document.querySelectorAll("a");
  
    links.forEach(link => {
      link.addEventListener("mouseover", () => {
        link.style.color = "#00bcd4";
      });
  
      link.addEventListener("mouseout", () => {
        link.style.color = "";
      });
    });
  });
  