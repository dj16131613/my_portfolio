$(document).on('click', 'a[href="#"]', function(e){
  e.preventDefault();
});
/*====================================메인 고양이 클릭이벤트==========================*/
$(function(){

  $('.sum article').on('click', function(e){
    e.stopPropagation();

    $('.sum article > div').hide();   
    $(this).children('div').show();   
  });

  $(document).on('click', function(){
    $('.sum article > div').hide();
  });

});

$(function(){

  $('.fall article').on('click', function(e){
    e.stopPropagation();

    $('.fall article > div').hide();   
    $(this).children('div').show();   
  });

  $(document).on('click', function(){
    $('.fall article > div').hide();
  });

});

/*========================================메인 버튼이벤트=================================*/
$(function(){

  var $track = $('main > ul:first-of-type');  
  var $prev  = $('.mainbutton li:eq(0) a');   
  var $next  = $('.mainbutton li:eq(1) a');    

  var idx = 0; 
  var lock = false; 

  
  $prev.hide();

  function update(){
    $track.css('transform', 'translateX(' + (-50 * idx) + '%)');

    if(idx === 0){
      $prev.hide();
      $next.show();
    }else{
      $prev.show();
      $next.hide();
    }
  }

  function go(to){
    if(lock || idx === to) return;
    lock = true;
    idx = to;
    update();
    setTimeout(function(){ lock = false; }, 700);
  }

  $next.on('click', function(e){
    e.preventDefault();
    go(1);
  });


  $prev.on('click', function(e){
    e.preventDefault();
    go(0);
  });

});
/*=================================메뉴리스트 좌우 이동클릭 이벤트=====================*/
$(function () {


  var DURATION = 400; 

  $('.menu_list').each(function () {

    var $listItem = $(this);
    var $wrap = $listItem.find('.menu_wrap');
    var $prev = $wrap.find('.arrow.prev');
    var $next = $wrap.find('.arrow.next');
    var $ul   = $wrap.find('.menu_view > ul');

    var animating = false;


    function stepPx() {
      var $li = $ul.children('li').first();
      if (!$li.length) return 0;

      var liW = $li.outerWidth(true); 

      var $li2 = $li.next();
      if ($li2.length) {
        var x1 = $li.position().left;
        var x2 = $li2.position().left;
        return Math.round(x2 - x1);
      }
      return liW;
    }


    $ul.css('transform', 'translateX(0px)');


    $next.on('click', function (e) {
      e.preventDefault();
      if (animating) return;
      animating = true;

      var step = stepPx();
      if (!step) { animating = false; return; }


      $ul.css('transition', 'transform ' + DURATION + 'ms ease');
      $ul.css('transform', 'translateX(' + (-step) + 'px)');

      setTimeout(function () {

        $ul.css('transition', 'none');
        $ul.append($ul.children('li').first());
        $ul.css('transform', 'translateX(0px)');


        $ul[0].offsetHeight;

        animating = false;
      }, DURATION);
    });


    $prev.on('click', function (e) {
      e.preventDefault();
      if (animating) return;
      animating = true;

      var step = stepPx();
      if (!step) { animating = false; return; }


      $ul.css('transition', 'none');
      $ul.prepend($ul.children('li').last());
      $ul.css('transform', 'translateX(' + (-step) + 'px)');


      $ul[0].offsetHeight;

      $ul.css('transition', 'transform ' + DURATION + 'ms ease');
      $ul.css('transform', 'translateX(0px)');

      setTimeout(function () {
        $ul.css('transition', 'none');
        animating = false;
      }, DURATION);
    });


    $(window).on('resize', function () {
      $ul.css('transition', 'none');
      $ul.css('transform', 'translateX(0px)');
    });

  });

});
/*==================================md상품=================================*/
$(function () {


  $('.candlesmall .candlef').on('click', function (e) {
    e.preventDefault();

    const $clickedF = $(this);


    const cls = ($clickedF.attr('class').match(/candlef(\d+)/) || [])[1];
    if (!cls) return;


    $('.candlebig > li').removeClass('on');
    $('.candlebig .candle' + cls).addClass('on');

    $('.candlesmall .candlef.on').removeClass('on');
    $clickedF.addClass('on');
  });

});

document.addEventListener("DOMContentLoaded", function(){

  const box = document.querySelector(".story_back");
  if(!box) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {

      // 30% 이상 보이면 발동
      if(entry.isIntersecting){
        box.classList.add("is-show");

        // ✅ 반복 안 하게 (한 번만)
        observer.unobserve(box);
      }

    });
  }, {
    threshold: 0.3
  });

  observer.observe(box);

});

/*=========================================bg발자국=======================*/
$(function(){

  var $layer = $('.bgsteps-fixed');
  if(!$layer.length) return;

  // ✅ 발자국 6개만
 var path = [
  [12, 41],
  [28, 45],
  [44, 39],
  [60, 45],
  [76, 41],
  [90, 45]
];


  var stride = 38;   // 좌우 보폭

  $layer.empty();

  for(let i=0; i<path.length; i++){

    var x = path[i][0];
    var y = path[i][1];

    var next = path[Math.min(i+1, path.length-1)];
    var vx = next[0] - x;
    var vy = next[1] - y;

    var len = Math.hypot(vx, vy) || 1;

    var nx = (-vy / len);
    var ny = ( vx / len);

    var isLeft = (i % 2 === 0);
    var side = isLeft ? -1 : 1;

    var dx = nx * stride * side;
    var dy = ny * stride * side;

    var rot = isLeft ? -14 : 14;

    $('<img>',{
      class:'step',
      src:'images/bigcatfoot.png',
      alt:''
    }).css({
      left: x + '%',
      top:  y + '%',
      '--dx': dx + 'px',
      '--dy': dy + 'px',
      '--rot': rot + 'deg'
    }).appendTo($layer);
  }

  var $steps = $layer.find('.step');

  // 찍힘 → 사라짐 반복
  var gapIn=600, fadeIn=700, hold=1200;
  var gapOut=600, fadeOut=700, rest=900;

  function cycle(){
    $steps.stop(true,true).css('opacity',0);

    $steps.each(function(i){
      $(this).delay(i*gapIn).animate({opacity:0.55}, fadeIn);
    });

    var totalIn = ($steps.length-1)*gapIn + fadeIn;

    setTimeout(function(){
      $steps.each(function(i){
        $(this).delay(i*gapOut).animate({opacity:0}, fadeOut);
      });

      var totalOut = ($steps.length-1)*gapOut + fadeOut;
      setTimeout(cycle, totalOut + rest);

    }, totalIn + hold);
  }

  cycle();
});

/*=========================story================================*/
$(function(){

  $('.toTop').on('click', function(){
    $('html, body').stop().animate({scrollTop:0}, 650);
  });

});
