"use strict";

const btn = document.querySelector(".js-btn");
const series = [];
const favorites = [];

//FASE 1
const searchInServer = function(ev) {
  ev.preventDefault();
  const searcherInput = document.querySelector(".js-input");
  const searcherInputValue = searcherInput.value;
  const url = `http://api.tvmaze.com/search/shows?q=${searcherInputValue}`;
  fetch(url)
    .then(response => response.json())
    .then(data => {
      formatAndSafeDataInSeries(data);
      printSeries();
      listenClickAtList();
    });
};

const formatAndSafeDataInSeries = function(data) {
  console.log(data);
  for (const serie of data) {
    series.push({
      name: serie.show.name,
      img: hasImage(serie)
    });
  }
  console.log(series);
};

const hasImage = function(serie) {
  if (serie.show.image === null) {
    return `https://via.placeholder.com/210x295/ffffff/666666/?text=${serie.show.name}`;
  } else {
    return serie.show.image.medium;
  }
};

const printSeries = function() {
  const ulSeries = document.querySelector(".js-ul-series");
  let htmlcode = "";
  for (let indexLi = 0; indexLi < series.length; indexLi++) {
    htmlcode += `<li class= "list-item" data-index="${indexLi}">`;
    htmlcode += `<div class="img-container" data-index="${indexLi}">`;
    htmlcode += `<img class="img" src="${series[indexLi].img}" />`;
    htmlcode += "</div>";
    htmlcode += `<h2 class="title">${series[indexLi].name}</h2>`;
    htmlcode += "</li>";
  }
  ulSeries.innerHTML = htmlcode;
};

//ejecutar funciones
btn.addEventListener("click", searchInServer);
