// 헤더
$('header nav >ul').mouseenter(function(){
    $('ul.lv2').slideDown(800)
})

$('header nav >ul').mouseleave(function(){
    $('ul.lv2').stop().slideUp(500)
})

// 슬라이드
setInterval(function(){
    $('.slideWrap').animate({'marginTop':'-300px'}, function(){
         $('.slide:first').appendTo('.slideWrap')
         $('.slideWrap').css({'marginTop':'0px'})
    })
},3000)

// 탭
$('.tabMenu li').click(function(){
    var idx=$(this).index()
    
    $('.tabItem >*').hide().removeClass('on')
    $('.tabItem >*').eq(idx).show().addClass('on')
    
    $('.tabMenu li').removeClass('on')
    $(this).addClass('on')
})



//또는 아이디로 지정해서 href값을 타고 보이기
$('.tabMenu li').click(function(){
    var href=$(this).find('a').attr('href')

    $('.tabItem >*').hide().removeClass('on')
    $(href).show().addClass('on')

    $('.tabMenu li').removeClass('on')
    $(this).addClass('on')
})