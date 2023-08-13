'use strict';

///////////////////////////////////////
// Modal window
const section1 = document.getElementById('section--1');
const header = document.querySelector('.header');

const allSections = document.querySelectorAll('.section');
const imageTarget = document.querySelectorAll('img[data-src]');

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');

const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScroll = document.querySelector('.btn--scroll-to');

//tab components
const tabs = document.querySelectorAll('.operations__tab');
const tabContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

//nav components
const nav = document.querySelector('.nav');

//slide components
const slides = document.querySelectorAll('.slide');
const slider = document.querySelector('.slider');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');
const dotsContainer = document.querySelector('.dots');

// functions /////////////////////////

/******slider***********/
let curSlide = 0;
const maxSlide = slides.length;
//next slide
//slider functions

const allSlider = function() {

const goToSlide = function(slide) {
  slides.forEach((s, i) => {
    (s.style.transform = `translateX(${100 * (i - slide)}%)`);
  });
}
//curSlide = 1, -100%, 0%, 100%, 200%
const nextSlide = function(){
  if (curSlide === maxSlide -1){
    curSlide = 0;
  } else {
    curSlide++;
  }
  goToSlide(curSlide);
  activateDot(curSlide);
};
//previuse slide
const prevSlide = function(){
  if (curSlide === 0) {
    curSlide = maxSlide -1;
  } else {
  curSlide--;
  }
  goToSlide(curSlide);
  activateDot(curSlide);
}
//creating dots btn for slides *******************/////////////////////////////
const createDots = function(){
  slides.forEach(function(_, i) {
    dotsContainer.insertAdjacentHTML('beforeend', `<button class="dots__dot" data-slide="${i}"></button>`);
  });
};
//active dot 
const activateDot = function(slide) {
  //disattivare active dot
  document.querySelectorAll('.dots__dot').forEach(dot => dot.classList.remove('dots__dot--active'));
  //attivare active dot in base allo slide
  document.querySelector(`.dots__dot[data-slide = "${slide}"]`).classList.add('dots__dot--active');
};
const init = function(){
//mettere affiancati le slides, perchè all'inizio sono una sopra l'altro 0, 100%, 200% & dot slide 0 = active & creare dots
  goToSlide(0);
  createDots();
  activateDot(0);
};
init();
//slide event handlers
// btn addeventListener next & prev slide
btnRight.addEventListener('click', nextSlide);
btnLeft.addEventListener('click', prevSlide);
//keyboard event 
document.addEventListener('keydown', function(e){
  if (e.key === 'ArrowRight') nextSlide(); 
  e.key === 'ArrowLeft' && prevSlide(); //short circuting method
});
//dots add event listener by click
dotsContainer.addEventListener('click', function(e){
  if(e.target.classList.contains('dots__dot')){
    const slide = e.target.dataset.slide; // === const {slide} = e.target.dataset;
    goToSlide(slide);
    activateDot(slide);
  }
});
};
allSlider();
/*********lazy image loading*************/
const loadImage = function(entries, observer){
  const [entry] = entries;
  if(!entry.isIntersecting) return;

  //replace src dataset with data-src
  entry.target.src = entry.target.dataset.src;
  
  entry.target.addEventListener('load', function() {
    entry.target.classList.remove('lazy-img');
  });
  observer.unobserve(entry.target);
}
const imagesObserver = new IntersectionObserver(loadImage, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});
imageTarget.forEach(image => {
  imagesObserver.observe(image);
});

/**********lazy loading section scrolling using Intersection Observer Api**********/

const loadingSection = function(entries, observer){
  const [entry] = entries;
  
  if(!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);

};
const sectionObserver = new IntersectionObserver(loadingSection, {
  root: null,
  threshold: 0.15,
});
allSections.forEach(function(section){
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

/************sticky navbar using Intersection Observer API**********/
const navBarRectHeight = nav.getBoundingClientRect().height;

const stickyNavBar = function (entries) {
  const entry = entries[0];
  
  if(!entry.isIntersecting){
    nav.classList.add('sticky');
  }else{
    nav.classList.remove('sticky');
  }
}

const headerObserver = new IntersectionObserver(stickyNavBar, {
  root: null,
  threshold: 0,
  rootMargin: `-${navBarRectHeight}px`,
});
headerObserver.observe(header);

//Dry coding fade animation
const fading = function(e, opacity){
  if(e.target.classList.contains('nav__link')){
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if(el !== link) el.style.opacity = opacity;
    });
    logo.style.opacity= opacity;
  }
}

/*****modal functions*********/
const openModal = function () {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};


/*********scroll function**********/
const scrollTo = function(){
  section1.scrollIntoView({behavior: "smooth"});
}

/* metodo tradizionale per scrollInToView 
navLink.forEach(function(el){
  el.addEventListener('click', function(e) {
    e.preventDefault();
    const id = this.getAttribute("href");//una buona tecnica per creare id da href
    console.log(id);
    document.querySelector(id).scrollIntoView({behavior: "smooth"});
  })
})*/
/*
//howt to scrolling attraverso Event Delegation?
//1.add event listener to common parent element
//2.determine what element originated the event
navLinks.addEventListener('click', function(e){
  if(e.target.classList.contains('nav__link')){
    e.preventDefault();
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({behavior: "smooth"});
  }
});*/
// event handlers/////////////////

//Passing Arguments to event handlers
//menu fade animation
nav.addEventListener('mouseover', function(e){
  fading(e, 0.5);
});
nav.addEventListener('mouseout', function(e){
   fading(e, 1);
});

//modal handler
btnsOpenModal.forEach((btn) => btn.addEventListener('click', openModal));
// for (let i = 0; i < btnsOpenModal.length; i++)
//   btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

//scrolling handler 
btnScroll.addEventListener('click', scrollTo);

//TAB MAKING ///////////////////

//Event Delegation
tabContainer.addEventListener('click', function(e){
  //dom traversing
  const clicked = e.target.closest('.operations__tab');
  //Guard Clause
  if(!clicked)return;
  //disactive tab & content
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(tC => tC.classList.remove('operations__content--active'));
  //active tab
  clicked.classList.add('operations__tab--active');
  //active content
  const dataTab = clicked.dataset.tab;
  document.querySelector(`.operations__content--${dataTab}`).classList.add('operations__content--active'); 
});



//lecture
/*//selcting elements
console.log(document.documentElement);
console.log(document.body);
console.log(document.head);
const header = document.querySelector('.header');
console.log(document.querySelectorAll('.section'));
console.log(document.getElementById('section--1'));
console.log(document.getElementsByTagName('button'));
console.log(document.getElementsByClassName('btn'));

//creating and inserting elements
const cookieMessage = document.createElement('div');
cookieMessage.classList.add('cookie--massage');
cookieMessage.innerHTML = 'We use cookies!<button class="btn btn--close--cookie">Got it!</button>';

header.append(cookieMessage);
document
.querySelector('.btn--close--cookie')
.addEventListener('click', ()=> cookieMessage.remove());

//Styles, Attributes, Classes
cookieMessage.style.backgroundColor = 'gray';
cookieMessage.style.width = '120%';*/

