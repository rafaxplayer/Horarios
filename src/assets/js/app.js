console.log('working');
var typed = new Typed('.site-title', {
    strings: ["Working Hours..."],
    typeSpeed: 40,
    loop:false,
    cursorChar: '_',
    showCursor: true,
    onComplete: function(self) { 
      setTimeout(function(){
        document.getElementsByClassName('typed-cursor')[0].style.display="none";
      },2000)
      
    }
    
  });
   
  