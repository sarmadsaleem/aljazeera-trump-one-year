'use strict';
$(function(){

  $('[data-toggle="tooltip"]').tooltip()

  // fetch data and populate events
  const endpoint = 'https://spreadsheets.google.com/feeds/list/1lDT8cX1RX-mOMcTxkUq0lpNuuBdtgbbmqsiOl43-M-M/4/public/values?alt=json';
  
  $.getJSON(endpoint, function(data) {

    let rows = data.feed.entry;
    let count = 3;
    let splash = 1;

    $(rows).each(function(){

      let template = '';

      // monthly splash screen template
      if( this.gsx$type.$t === 'Splash' )
      {
        let months = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December', 'January'];
        //console.log('splash');
        //console.log(this);
        template = `
          <section class="swiper-slide section splash${splash}" id="s_${count}" data-md="${this.gsx$year.$t}-${this.gsx$month.$t}">
              <div class="splash-container">
                <div class="content">
                  <div class="month" style="background:url(images/splash-${splash}.jpg);">
                    <div class="month-name">
                      <div class="container">
                        <div class="row">${months[this.gsx$month.$t]}</div>
                      </div>
                    </div>  
                  </div>
                  <div class="summary">
                      <div class="container">
                        <div class="row">
                          <p>${this.gsx$text.$t}</p>
                          <div class="row stats">
                        <div class="col-xs-5">
                          <div class="stat-name">Executive Orders</div>
                          <div class="stat-value">${this.gsx$executiveorders.$t}</div>
                          <div class="stat-extra">${this.gsx$executiveorderextra.$t}</div>
                        </div>
                        <div class="col-xs-7">
                          <div class="stat-name">Hours at the golf course</div>
                          <div class="stat-value">${this.gsx$clubhours.$t}</div>
                        </div>
                      <div>
                        </div>
                      </div>
                      
                      
                  <div>
                </div>
              </div>
          </section>`;
          splash++;
      }

      // event template
      if( this.gsx$type.$t === 'Event' )
      {
        let tweet = this.gsx$tweet.$t;
        tweet = tweet.replace('<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>', '');

        template = `
          <section class="swiper-slide section" id="s_${count}">
              <div class="event-container">
                <div class="content">
                  <div class="event">
                    <div class="date"><div>${this.gsx$date.$t}</div></div>
                    <div class="text">
                      <div class="container">
                        <div class="row"><p style="text-align:center">${this.gsx$text.$t}</p></div>
                      </div>
                    </div>  
                  </div>
                  <div class="ratings">
                    <div class="approve">
                      <div class="head">APPROVE</div>
                      <div class="value">${this.gsx$approve.$t}%</div>  
                    </div>
                    <div class="disapprove">
                      <div class="head">DISAPPROVE</div>
                      <div class="value">${this.gsx$disapprove.$t}%</div>  
                    </div>
                    <div class="no-opinion">
                      <div class="head">NO OPINION</div>
                      <div class="value">${this.gsx$noopinion.$t}%</div>  
                    </div>
                  </div>
                  <div class="tweet">${tweet}</div>
                </div>
              </div>
          </section>`;
      }

      $('.swiper-wrapper').append(template);
      count++;
    });

    // twttr.widgets.load(
    //   document.getElementsByClassName("tweet")
    // )

    // create swiper based on fetched data
    const mySwiper = new Swiper ('.swiper-container', {
      direction: 'horizontal',
      loop: false,
      autoHeight: true,
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      }
    })   

    monthlyNavigation(mySwiper);
    toggleSpinner();
    toggleNavigation(mySwiper);
    setTimeout(coverSlider, 5000);

    
    
  });
});

/* hook up monthly navigation with proper slides */
function monthlyNavigation(mySwiper){

  $('.month-link').on('click', function(){
      let splashMd = $(this).attr('data-scroll');
      let splashId = $('section[data-md="' + splashMd + '"]').attr('id');
      splashId = splashId.split('_');
      mySwiper.slideTo(splashId[1]-1)
    });
}

/* hide spinner and show content */
function toggleSpinner(){

  $('.loader').toggleClass('hidden');
  $('#swiper-container').toggleClass('hidden');
}

/* show navigational arrows after first card */
function toggleNavigation(mySwiper){

  // on cover arrow click slide to index page
  $('.arrow-container').on('click', function(){
    mySwiper.slideNext();
    
  })

  // hide persistent navigation at bottom if first slide
  mySwiper.on('slideChange', function () {

    if(mySwiper.realIndex === 0)
    {
      $('.next').addClass('hidden');
    }
    else{
      $('.next').removeClass('hidden');
      
    }
  });

  // persistent navigation home button
  $('.next .a-home').on('click', function(){
    mySwiper.slideTo(1);
  });

}

/* animate cover images */
var images = Array("images/GettyImages-901874902.jpg", "images/GettyImages-902243502.jpg");
var currimg = 0;

function coverSlider(){

  $('.cover-image').animate({ opacity: 1 }, 500,function(){
    $('.cover-image').animate({ opacity: 0.7 }, 400,function(){
        currimg++;

        
        if(currimg > images.length-1){
            currimg=0;
        }
        var newimage = images[currimg];
        
        $('.cover-image').css("background", "none"); 
        $('.cover-image').css("background", "linear-gradient(rgba(0,0,0,0), rgba(0,0,0,0), rgba(0,0,0,0.8)), url("+newimage+")"); 
        $('.cover-image').animate({ opacity: 1 }, 400,function(){
            setTimeout(coverSlider,5000);
        });
    });
  });
}

