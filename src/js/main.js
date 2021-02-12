import $ from './libraries/jquery-3.5.1'
import Swiper, { Pagination, Navigation } from 'swiper'

$('select').each(function () {
  var $this = $(this),
    numberOfOptions = $(this).children('option').length

  $this.addClass('select-hidden')
  $this.wrap('<div class="select"></div>')
  $this.after('<div class="select-styled"></div>')

  var $styledSelect = $this.next('div.select-styled')
  $styledSelect.text($this.children('option').eq(0).text())

  var $list = $('<ul />', {
    class: 'select-options',
  }).insertAfter($styledSelect)

  for (var i = 0; i < numberOfOptions; i++) {
    $('<li />', {
      text: $this.children('option').eq(i).text(),
      rel: $this.children('option').eq(i).val(),
    }).appendTo($list)
  }

  var $listItems = $list.children('li')

  $styledSelect.click(function (e) {
    e.stopPropagation()
    $('div.select-styled.active')
      .not(this)
      .each(function () {
        $(this).removeClass('active').next('ul.select-options').hide()
      })
    $(this).toggleClass('active').next('ul.select-options').toggle()
  })

  $listItems.click(function (e) {
    e.stopPropagation()
    $styledSelect.text($(this).text()).removeClass('active')
    $this.val($(this).attr('rel'))
    $list.hide()
    //console.log($this.val());
  })

  $(document).click(function () {
    $styledSelect.removeClass('active')
    $list.hide()
  })
})

Swiper.use([Navigation, Pagination])

const teachersSwiper = new Swiper('.teachers-slider', {
  slidesPerView: 3,
  spaceBetween: 15,
  pagination: {
    el: '.teachers-slider-pagination',
    clickable: true,
    type: 'bullets',
    renderBullet: function (index, className) {
      return `<span class="dot swiper-pagination-bullet"></span>`
    },
  },
  breakpoints: {
    320: {
      slidesPerView: 1,
      spaceBetween: 10,
    },
    768: {
      slidesPerView: 2,
    },
    1100: {
      slidesPerView: 3,
    },
  },
})

const participantsSwiper = new Swiper('.participants-slider ', {
  slidesPerView: 3,
  spaceBetween: 15,
  pagination: {
    el: '.participants-pagination',
    clickable: true,
    type: 'bullets',
    renderBullet: function (index, className) {
      return `<span class="dot swiper-pagination-bullet"></span>`
    },
  },
  breakpoints: {
    320: {
      slidesPerView: 1,
      spaceBetween: 10,
    },
    768: {
      slidesPerView: 2,
    },
    1100: {
      slidesPerView: 3,
    },
  },
})
