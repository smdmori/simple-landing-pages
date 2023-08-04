"use strict";
let rotate = 0;

function replaceAll(str) {
	str = str.toString();
	str = str.replace(/0/g, "۰");
	str = str.replace(/1/g, "۱");
	str = str.replace(/2/g, "۲");
	str = str.replace(/3/g, "۳");
	str = str.replace(/4/g, "۴");
	str = str.replace(/5/g, "۵");
	str = str.replace(/6/g, "۶");
	str = str.replace(/7/g, "۷");
	str = str.replace(/8/g, "۸");
	str = str.replace(/9/g, "۹");
	return str;
}
let sb_masker = document.createElement("div");
sb_masker.setAttribute("class", "sb_masker");
// enable bs popover
var popoverTriggerList = [].slice.call(
	document.querySelectorAll('[data-bs-toggle="popover"]')
);
var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
	return new bootstrap.Popover(popoverTriggerEl);
});
// scroll to top
$("#sb_To_Top").click(function () {
	$("html, body").animate({
			scrollTop: 0,
		},
		"slow"
	);
	return false;
});
// sticky header on scroll
$(window).scroll(function () {
	// show / hide scrollToTop btn
	if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
		$("#sb_To_Top").removeClass("d-none");
	} else {
		$("#sb_To_Top").addClass("d-none");
	}
	if (
		document.body.scrollTop > 100 ||
		document.documentElement.scrollTop > 100
	) {
		$(".sb_product_bar").addClass("is_fixed");
	} else {
		$(".sb_product_bar").removeClass("is_fixed");
	}
	// sticky menu
	var sticky = $("#sb_main_header"),
		scroll = $(window).scrollTop();
	if (scroll >= 100) sticky.addClass("is_sticky");
	else sticky.removeClass("is_sticky");
});
// on page load
$(function () {
	// validation field
	const messages = {
		valueMissing: () => "مقدار اجباری میباشد",
		patternMismatch: () => "فرمت وارد شده اشتباه است",
		tooShort: (target) => `حداقل باید ${target.minLength} کاراکتر وارد شود`,
		//
		serverProb: () => "مشکلی رخ داده است مجدد تلاش کنید",
		loginNoExist: () => "کاربری با این شماره موبایل موجود نمی باشد",
		registerExist: () => "این شماره موبایل قبلاً ثبت نام نموده است",
		wrongPass: () => "رمز عبور اشتباه است",
	};
	const validityKeys = Object.keys(messages);
	let sb_validate = [];

	function checkValidityForm(target) {
		sb_validate = [];
		validityKeys.forEach((key) => {
			if (target.validity[key]) {
				appendError(key, target);
				sb_validate.push(target.validity[key]);
			} else {
				sb_validate.push(target.validity[key]);
			}
			// console.log(sb_validate);
		});
		if (sb_validate.includes(true)) {
			return false;
		}
		return true;
	}

	function removeError(target) {
		const errorEl =
			target.parentElement.parentElement.querySelectorAll("small");
		errorEl.forEach((el) => el.remove());
	}

	function appendError(key, target) {
		const errorEl = document.createElement("small");
		errorEl.setAttribute("class", "sb-form-error");
		errorEl.innerText = messages[key] ? messages[key](target) : key;
		target.parentElement.parentElement.prepend(errorEl);
	}

	// ███████████████████████
	// register login modal
	// ███████████████████████
	// animate card
	let prevAnimateCardData;

	function NextAnimateCards(targetData) {
		prevAnimateCardData = $(".sb_log_reg_container.sb_form_active").attr(
			"data-login-form"
		);
		$(".sb_log_reg_container").each(function () {
			if (targetData == $(this).attr("data-login-form")) {
				$(this).addClass("sb_form_active");
				$(this).siblings().removeClass("sb_form_active");
			}
		});
		$(".sb_log_reg_container.sb_form_active .sb_form_btn_back").attr(
			"data-login-form",
			prevAnimateCardData
		);
	}

	function prevAnimateCards(prevAnimateCardData) {
		$(".sb_log_reg_container").each(function () {
			if (prevAnimateCardData == $(this).attr("data-login-form")) {
				$(this).addClass("sb_form_active");
				$(this).siblings().removeClass("sb_form_active");
			}
		});
	}
	let t;
	let time = 0;

	function createTimerSmsCode() {
		$("#smsCodeAgain").prop("disabled", true);
		let smsCodeAgainElem = document.getElementById("smsCodeAgain");
		time = 60;
		t = setInterval(() => {
			time--;
			smsCodeAgainElem.innerHTML = time + " ثانیه ";
			if (time == 0) {
				clearInterval(t);
				smsCodeAgainElem.innerHTML = "ارسال مجدد";
				$("#smsCodeAgain").prop("disabled", false);
			}
		}, 1000);
	}
	// listeners
	$("#createAccount").on("click", function (e) {
		NextAnimateCards($(this).attr("data-login-form"));
	});
	$(".sb_form_btn_back").on("click", function () {
		prevAnimateCards($(this).attr("data-login-form"));
	});

	$(".sb_validate").keypress(function (e) {
		var key = e.which;
		if (key == 13) 
		{
			$(this).closest('.sb_validate_key_parent').find('.sb_validate_key').click();
			return false;
		}
	});

	$("[data-form-status]").on("click", function (e) {
		let request = e.target.getAttribute("data-form-status");
		let input = e.target.parentElement.querySelector("input");
		$("[name=sb_sms_user_data]").val(input.value);
		if (request == "smsCode" && time > 0) {
			NextAnimateCards("regSms");
		} else if (request == "smsCode" && time == 0) {
			NextAnimateCards("regSms");
			loginRegisterRequest(input, request);
		} else {
			loginRegisterRequest(input, request);
		}
	});

	function loginRegisterRequest(inputElem, requestType) {
		removeError(inputElem);
		if (checkValidityForm(inputElem)) {
			$("#register_login_modal .loader_container").addClass("d-flex");
			$.ajax({
				url: baseURL + "ajax/users/loginRegister",
				type: "POST",
				data: {
					userMobile: inputElem.value,
					userRequest: requestType,
				},
				success: function (response) {
					response = JSON.parse(response);
					$("#register_login_modal .loader_container").removeClass("d-flex");
					// let responseReq = response.responseReq; /* 'login' */
					let responseUserExist = response.responseUserExist; /* true */
					let loginSuccessful =
						response.loginSuccessful; /* responseUserPass = true */
					switch (requestType) {
						case "register":
							if (responseUserExist) {
								if (response.hasPass) NextAnimateCards("passSection");
								else {
									NextAnimateCards("regSms");
									$(".sb_log_show_mob_number").html($(inputElem).val());
									if (time == 0) loginRegisterRequest(inputElem, "smsCode");
								}
								appendError("registerExist", inputElem);
							} else {
								$(".sb_log_show_mob_number").html($(inputElem).val());
								NextAnimateCards("regSms");
								if (time == 0) loginRegisterRequest(inputElem, "smsCode");
							}
							break;
						case "smsCode":
							$(".sb_log_show_mob_number").html($(inputElem).val());
							createTimerSmsCode();
							break;
						case "smsCodeAgain":
							if (response.error != undefined)
								appendError(response.error, inputElem);
							else createTimerSmsCode();
							break;
						case "finalizeCode":
							if (loginSuccessful) document.location = document.location;
							else {
								if (response.error != undefined)
									appendError(response.error, inputElem);
								else appendError("serverProb", inputElem);
							}
							break;
						case "login":
							if (responseUserExist) {
								if (response.hasPass) NextAnimateCards("passSection");
								else {
									NextAnimateCards("regSms");
									$(".sb_log_show_mob_number").html($(inputElem).val());
									if (time == 0) loginRegisterRequest(inputElem, "smsCode");
								}
							} else appendError("loginNoExist", inputElem);
							break;
						case "loginPass":
							if (loginSuccessful) {
								document.location = document.location;
							} else {
								appendError("wrongPass", inputElem);
							}
							break;
						default:
							console.log("default case happened! requestType: " + requestType);
							break;
					}
				},
				error: function (errorMessage) {
					$("#register_login_modal .loader_container").removeClass("d-flex");
				},
			});
		}
	}

	// ███████████████████████
	// Sliders
	// ███████████████████████
	// hero-slider
	const swiper = new Swiper(".sb_hero_slider", {
		// Optional parameters
		direction: "horizontal",
		loop: true,
		slidesPerView: 1,
		autoplay: {
			delay: 4000,
		},
		// Navigation arrows
		navigation: {
			nextEl: ".swiper-button-next",
			prevEl: ".swiper-button-prev",
		},
	});
	$(".sb_hero_slider").on("mouseenter", function (e) {
		swiper.autoplay.stop();
	});
	$(".sb_hero_slider").on("mouseleave", function (e) {
		swiper.autoplay.start();
	});

	// homepage aside hero section category menu / check height and position of submenu to open
	/* let negtopmsgbar = $("#negtopmsgbar").height();
	let mainHeader = document.getElementById("sb_main_header").getBoundingClientRect().height;
	let offsetHeader = mainHeader + negtopmsgbar;
	let navItems = document.querySelectorAll(".sb_main_tab_store .nav-item.sb_has_submenu");
	navItems.forEach(function (e) {
		let navItemRect = e.getBoundingClientRect();
		let submenu = e.querySelector(".submenu");
		if (navItemRect.bottom - offsetHeader >= submenu.getBoundingClientRect().height) {
			e.classList.add("position-relative");
		}
	}); */

	// categories-home-slider
	const swiper_categories = new Swiper(".sb_categories_nav_swiper", {
		// Optional parameters
		direction: "horizontal",
		loop: true,
		nav: false,
		slidesPerView: 10,
		spaceBetween: 10,
		// Navigation arrows
		navigation: {
			nextEl: ".swiper-button-next",
			prevEl: ".swiper-button-prev",
		},
		breakpoints: {
			320: {
				slidesPerView: 1,
			},
			576: {
				slidesPerView: 2,
			},
			768: {
				slidesPerView: 4,
			},
			992: {
				slidesPerView: 6,
			},
			1200: {
				slidesPerView: 10,
			},
		},
	});
	// common slider
	const swiper_container = new Swiper(".sb_swiper_container", {
		// Optional parameters
		direction: "horizontal",
		loop: false,
		spaceBetween: 20,
		scrollbar: {
			el: ".swiper-scrollbar",
			hide: true,
		},
		breakpoints: {
			320: {
				slidesPerView: 2,
			},
			576: {
				slidesPerView: 4,
			},
			768: {
				slidesPerView: 7,
			},
			992: {
				slidesPerView: 8,
			},
			1200: {
				slidesPerView: 10,
			},
		},
	});
	// header menu slider
	const swiper_header_menu = new Swiper(".sb_header_swiper", {
		loop: false,
		freeMode: true,
		nav: true,
		slidesPerView: 8,
		scrollbar: {
			el: ".swiper-scrollbar",
			hide: true,
		},
		navigation: {
			nextEl: ".swiper-button-next.header-swiper-btn",
			prevEl: ".swiper-button-prev.header-swiper-btn",
		},
		breakpoints: {
			0: {
				spaceBetween: 10,
				slidesPerView: 1,
			},
			320: {
				slidesPerView: 3,
			},
			576: {
				slidesPerView: 4,
			},
			768: {
				slidesPerView: 5,
			},
			868: {
				slidesPerView: 6,
			},
			992: {
				slidesPerView: 4,
			},
			1200: {
				slidesPerView: 8,
				spaceBetween: 25,
			},
		},
	});

	// ███████████████████████
	// Header
	// ███████████████████████
	// change select option search box header
	$(".sb_header_search_whitin select").on("change", function () {
		let selectedVal = $(this).find(":selected").text();
		$(".sb_header_search_whitin_name").html(selectedVal);
		$(".sb_header_search_box input").focus();
		interactHeaderSearch();
	});
	// switch DARK/LIGHT mode
	let checkDarkMode = $("#checkdarkmode");
	let $html = $("html");
	checkDarkMode.on("click", (e) => {
		$html.toggleClass("dark_mode");
		localStorage.setItem("theme_mode", $html.attr("class"));
		if ($html.hasClass("dark_mode"))
			$("img.brandLogo").each(function () {
				$(this).attr("src", $(this).data("logo_dark"));
			});
		else
			$("img.brandLogo").each(function () {
				$(this).attr("src", $(this).data("logo_light"));
			});
	});
	if (localStorage.getItem("theme_mode") == "dark_mode") {
		$("#checkdarkmode").prop("checked", true);
		$("img.brandLogo").each(function () {
			$(this).attr("src", $(this).data("logo_dark"));
		});
	} else {
		$("#checkdarkmode").prop("checked", false);
		$("img.brandLogo").each(function () {
			$(this).attr("src", $(this).data("logo_light"));
		});
	}
	$("#archive_filter_mob").on("click", function (e) {
		e.preventDefault();
		$("#archive_filter_aside").addClass("is_active");
	});

	// header search take active on click
	// $(".sb_header_search input").on('focus', function (e) {
	// 	interactHeaderSearch();
	// });

	$(".sb_header_search input").on("click", function (e) {
		interactHeaderSearch();
	});

	$(".sb_header_search_open").on("click", function () {
		interactHeaderSearch();
	});

	function interactHeaderSearch() {
		$(".sb_header_search").addClass("is_active");
		$(".sb_header_search").before(sb_masker);
		$(".sb_masker").on("click", function () {
			$(this).remove();
			$(".sb_header_search").removeClass("is_active");
			$(".searchMiniResults").removeClass("d-flex");
			$("body").css("overflow", "visible");
			$(".sb_header_right_section  .sb_masker").remove();
		});
		$(".searchMiniResults").addClass("d-flex");
		$("body").css("overflow", "hidden");
		// searchHeaderAjax();
		$(".sb_header_search input").trigger("focus");
	}

	// $(".sb_header_search_box input").on("blur", function () {
	// });

	$(".sb_header_account").hover(
		function (e) {
			$(this).closest(".sb_header_account").before(sb_masker);
			$(this).addClass("is_active");
		},
		function () {
			$(this).closest(".sidebar ").find(".sb_masker").remove();
			$(this).removeClass("is_active");
		}
	);
	// header hamburger menu
	$(".sb_header_hamburger").click(function (e) {
		// open hamburger menu
		$(this).addClass("is_active");
		// append overlay to dom
		$(this).before(sb_masker);
		// go one level
		if (
			$(e.target).hasClass("sb_has_submenu") ||
			($(e.target).parent().hasClass("sb_has_submenu") &&
				!e.target.classList.contains("sb_menu_lvl_back"))
		) {
			//  prevent link if not submenu
			if (
				$(e.target).parent().hasClass("sb_has_submenu") &&
				!$(e.target).parent().hasClass("is_current")
			) {
				e.preventDefault();
			}
			$(".sb_menu_lvl_1").addClass("is_active");
			$(e.target).parent().addClass("is_current");
			$(e.target).parent().parent().parent().addClass("is_open is_current");
			let lvlBackText = $(e.target)
				.parent()
				.parent()
				.parent()
				.find(".sb_menu_list_link")
				.html();
			let sb_menu_lvl_back = `<div class="sb_menu_lvl_back sb-bg_lighter_blue sb-bg_transparent_gray is_active">
            <i class="ico ico-angle-right me-2"></i> ${lvlBackText} </div>`;
			// create lvl back
			if (!$(e.target).parent().children().hasClass("sb_menu_lvl_back")) {
				$(e.target).parent().prepend(sb_menu_lvl_back);
			} else {
				$(e.target)
					.parent()
					.find(".sb_menu_lvl_back")[0]
					.classList.add("is_active");
			}
		}
		// back one level
		if (e.target.classList.contains("sb_menu_lvl_back")) {
			console.log($(e.target));
			$(e.target).removeClass("is_active");
			$(e.target)
				.closest(".sb_menu.sb_has_submenu")
				.closest(".is_open")
				.find("ul li.is_current")
				.removeClass("is_current");
			$(e.target)
				.closest(".sb_menu.sb_has_submenu")
				.removeClass("is_current is_open");
			$(e.target)
				.closest(".sb_menu.sb_has_submenu")
				.closest(".is_open")
				.removeClass("is_open");
			if ($(".sb_menu_lvl_back.is_active").length < 1) {
				$(".sb_menu_lvl_1").removeClass("is_active");
				$(".sb_menu_lvl_2").removeClass("is_current is_open");
			}
			if (!$(".sb_menu_lvl_back")[0].classList.contains("is_active")) {
				$(".sb_menu_lvl_1").removeClass("is_active");
				$(".sb_menu_lvl_2").removeClass("is_current is_open");
				$(".sb_menu_lvl_back.is_active").removeClass("is_active");
				$(".sb_menu.sb_has_submenu").removeClass("is_current is_open");
			}
		}
	});
	// footer accordion mobile view
	$(".sb_footer_sitemap_list").click(function () {
		$(this).toggleClass("is_active");
	});

	// ███████████████████████
	// single-product
	// ███████████████████████
	var scrollSpy = new bootstrap.ScrollSpy(document.body, {
		target: "#navbar-example",
	});
	// tab-content product-details
	$(".sb_tab_navs .sb_tab_nav").on("click", function () {
		let navIndex = $(this).index() + 1;
		$(".sb_tab_navs .sb_tab_nav:nth-child(" + navIndex + ")").addClass(
			"active"
		);
		$(".sb_tab_navs .sb_tab_nav:nth-child(" + navIndex + ")")
			.siblings()
			.removeClass("active");
		$(".sb_tab_panes .sb_tab_pane:nth-child(" + navIndex + ")").addClass(
			"active"
		);
		$(".sb_tab_panes .sb_tab_pane:nth-child(" + navIndex + ")")
			.siblings()
			.removeClass("active");
	});
	//single product addons selector
	$(".sb_product_addons_option ").on("click", function () {
		let radioImg = $(this).find("[name=sb_product_addon_select]").data("img");
		$(".sb_product_addons_item").addClass("is-active");
		$(".sb_product_addons_item img").attr("src", radioImg);
	});
	$(".sb_product_addons_item i").on("click", function () {
		$("[name=sb_product_addon_select]").each(function () {
			$(this).prop("checked", false);
			$(".sb_product_addons_item").removeClass("is-active");
		});
	});
	$(".sb_qty_box_minus").on("click", function () {});
	$(".sb_qty_box_minus").on("click", function () {});
	var singleProductGalleryThumbs = new Swiper(".sb_product_gallery_thumbs", {
		spaceBetween: 10,
		watchSlidesProgress: true,
		grabCursor: true,
		breakpoints: {
			320: {
				slidesPerView: 4,
			},
			768: {
				slidesPerView: 4,
			},
			992: {
				slidesPerView: 6,
			},
			1200: {
				slidesPerView: 8,
			},
		},
	});
	var singleProductGallerySlider = new Swiper(".sb_product_gallery_slider", {
		zoom: true,
		loop: false,
		nav: false,
		navigation: {
			nextEl: ".swiper-button-next",
			prevEl: ".swiper-button-prev",
		},
		on: {
			slideChange: function (e) {
				$("#sb_product_gallery_slider  img").css({
					transform: "rotate(0deg)",
				});
				rotate = 0;
			},
		},
		thumbs: {
			swiper: singleProductGalleryThumbs,
		},
	});
	let sliderActiveIndex, sliderPrevActive, originalProductImg;
	var singleProductViewGgallery = new Swiper(".sb_product_view_gallery", {
		zoom: true,
		loop: false,
		nav: true,
		navigation: {
			nextEl: ".swiper-button-next",
			prevEl: ".swiper-button-prev",
		},
		thumbs: {
			swiper: singleProductGallerySlider,
		},
		on: {
			slideChange: function (e) {
				sliderActiveIndex = singleProductViewGgallery.activeIndex;
				if (sliderPrevActive != undefined) {
					sliderPrevActive.removeClass("is-active");
				}
				if (sliderActiveIndex >= 10) {
					$(
						".sb_customer_thumbs .sb_thumb_slide:nth-child(" +
						(sliderActiveIndex - (originalProductImg - 1)) +
						")"
					).addClass("is-active");
					sliderPrevActive = $(
						".sb_customer_thumbs .sb_thumb_slide:nth-child(" +
						(sliderActiveIndex - (originalProductImg - 1)) +
						")"
					);
				} else {
					$(
						".sb_product_thumbs .sb_thumb_slide:nth-child(" +
						(sliderActiveIndex + 1) +
						")"
					).addClass("is-active");
					sliderPrevActive = $(
						".sb_product_thumbs .sb_thumb_slide:nth-child(" +
						(sliderActiveIndex + 1) +
						")"
					);
				}
			},
		},
	});
	$(".sb_product_thumbs .sb_thumb_slide").on("click", function () {
		singleProductViewGgallery.slideTo($(this).index());
	});
	$(".sb_product_thumbs .sb_thumb_content ").each(function () {
		originalProductImg = $(this).children().length;
	});
	$(".sb_customer_thumbs .sb_thumb_slide").on("click", function () {
		singleProductViewGgallery.slideTo($(this).index() + originalProductImg);
	});
	var singleProductSlider = new Swiper(".sb_swiper_product_slider", {
		loop: false,
		nav: true,
		spaceBetween: 50,
		navigation: {
			nextEl: ".swiper-box-arrow-next",
			prevEl: ".swiper-box-arrow-prev",
		},
		breakpoints: {
			320: {
				slidesPerView: 1,
			},
			576: {
				slidesPerView: 2,
			},
			768: {
				slidesPerView: 2,
			},
			992: {
				slidesPerView: 3,
			},
			1200: {
				slidesPerView: 4,
			},
			1400: {
				slidesPerView: 5,
			},
		},
	});
	var singleProductTagSlider = new Swiper(".sb_tag_slider", {
		loop: false,
		nav: false,
		spaceBetween: 15,
		navigation: {
			nextEl: ".swiper-box-arrow-next",
			prevEl: ".swiper-box-arrow-prev",
		},
		breakpoints: {
			320: {
				slidesPerView: 2,
			},
			576: {
				slidesPerView: 3,
			},
			768: {
				slidesPerView: 3,
			},
			992: {
				slidesPerView: 4,
			},
			1200: {
				slidesPerView: 8,
			},
		},
	});
	// single review slider
	var singleProductReviewsGalleryThumbs = new Swiper(
		".sb_product_reviews_gallery_thumbs", {
			spaceBetween: 5,
			direction: "horizontal",
			slidesPerView: 3,
			watchSlidesProgress: true,
			breakpoints: {
				0: {
					slidesPerView: 2,
				},
				576: {
					slidesPerView: 3,
				},
				768: {
					spaceBetween: 15,
					slidesPerView: 4,
				},
				992: {
					slidesPerView: 6,
				},
				1200: {
					slidesPerView: 9,
					direction: "vertical",
				},
			},
		}
	);
	var singleProductReviewsGallerySlider = new Swiper(
		".sb_product_reviews_gallery_slider", {
			zoom: true,
			loop: false,
			nav: true,
			navigation: {
				nextEl: ".swiper-button-next",
				prevEl: ".swiper-button-prev",
			},
			thumbs: {
				swiper: singleProductReviewsGalleryThumbs,
			},
		}
	);
	singleProductReviewsGallerySlider.on("slideChange", function () {
		const index_currentSlide = this.realIndex;
		console.log(this.realIndex);
		console.log(this.slides);
		const currentSlideData = this.slides[index_currentSlide].dataset.commentId;
		$(".sb_modal_gallery_reviews .sb_comments_cell").each(function () {
			if ($(this).data("comment-id") == currentSlideData) {
				console.log("this ", $(this).data("comment-id"));
				console.log("activeSlide ", currentSlideData);
				$(this).addClass("is-active");
				$(this).siblings().removeClass("is-active");
			}
		});
	});
	// active first child reviews comment in modal
	$(
		".sb_modal_gallery_reviews .sb_comments_cell:nth-child(" +
		(singleProductReviewsGallerySlider.activeIndex + 1) +
		")"
	).addClass("is-active");
	$('.sb_comments_img[data-bs-target="#modal-comments-gallery"]').on(
		"click",
		function () {
			setTimeout(() => {
				singleProductReviewsGallerySlider.slideTo($(this).data("slider"));
			}, 500);
		}
	);

	// ███████████████████████
	// Archive Product
	// ███████████████████████
	if (localStorage.getItem("archive_view") == null) {
		localStorage.setItem("archive_view", "grid");
	} else {
		$(".sb_item_cells_wrap").addClass(localStorage.getItem("archive_view"));
	}
	if (localStorage.getItem("archive_view") == "grid") {
		$(".sb_grid_view_btn").addClass("active");
	} else {
		$(".sb_list_view_btn").addClass("active");
	}
	$(".sb_list_view_btn").on("click", function () {
		$(this).addClass("active");
		$(this).siblings().removeClass("active");
		localStorage.setItem("archive_view", "sb_items_list_view");
		$(".sb_item_cells_wrap").addClass("sb_items_list_view");
		$("html, body").scrollTop($("#panelsStayOpen-headingCategories").offset().top - 75);
	});
	$(".sb_grid_view_btn").on("click", function () {
		$(this).addClass("active");
		$(this).siblings().removeClass("active");
		localStorage.setItem("archive_view", "grid");
		$(".sb_item_cells_wrap").removeClass("sb_items_list_view");
		$("html, body").scrollTop($("#panelsStayOpen-headingCategories").offset().top - 75);
	});
	// filter aside archive page checkbox check tree
	$(".sb_filter_box_label i").on("click", function () {
		$(this).closest(".sb_has_submenu").toggleClass("is-active");
		if ($(this).closest(".sb_has_submenu").hasClass("is-active")) {
			$(this)
				.closest(".sb_has_submenu")
				.find(".sb_filter_box_list")
				.slideDown(300, "linear");
		} else {
			$(this)
				.closest(".sb_has_submenu")
				.find(".sb_filter_box_list")
				.slideUp(300, "linear");
		}
	});
	// filterbox checkbox check items
	//  helper function to create nodeArrays (not collections)
	const nodeArray = (selector, parent = document) => [].slice.call(parent.querySelectorAll(selector));
	//  checkboxes of interest
	const allThings = nodeArray(".sb_left_nav input");
	//  global listener
	addEventListener("change", (e) => {
		let check = e.target;
		//  exit if change event did not come from
		//  our list of allThings
		if (allThings.indexOf(check) === -1) return;
		//  check/unchek children (includes check itself)
		const children = nodeArray("input", check.parentNode);
		children.forEach((child) => {
			child.checked = check.checked;
			// $('.sb_filter_box_bottom .sb_btn_tool').removeClass('d-none');
		});
		//  traverse up from target check
		while (check) {
			// $('.sb_filter_box_bottom .sb_btn_tool').removeClass('d-none');
			//  find parent and sibling checkboxes (quick'n'dirty)
			const parent = check.closest(["ul"]).parentNode.querySelector("input");
			const siblings = nodeArray(
				"input",
				parent.closest("li").querySelector(["ul"])
			);
			//  get checked state of siblings
			//  are every or some siblings checked (using Boolean as test function)
			const checkStatus = siblings.map((check) => check.checked);
			const every = checkStatus.every(Boolean);
			const some = checkStatus.some(Boolean);
			//  check parent if all siblings are checked
			//  set indeterminate if not all and not none are checked
			parent.checked = every;
			parent.indeterminate = !every && every !== some;
			//  prepare for next loop
			check = check != parent ? parent : 0;
			// console.log((parent));
			// console.log((parent.closest('li')));
			// if (!parent.checked && !parent.indeterminate) {
			//     console.log('welcome');
			//     $('.sb_filter_box_bottom .sb_btn_tool').addClass('d-none');
			// }
		}
	});
	$(".sb_has_submenu>.sb_filter_box_label>.sb_form_checkbox").on(
		"click",
		function () {
			let propStates = $(this).find("input").prop("checked");
			$(this)
				.closest(".sb_has_submenu")
				.find("li")
				.each(function () {
					$(this).find("input").prop("checked", propStates);
				});
		}
	);

	// ███████████████████████
	// cart & checkout
	// ███████████████████████
	$(".sb_close_cart").on("click", () =>
		$(".sb_cart_overlay").removeClass("is_active")
	);

	function disabledCheckout(containerId) {
		$(`#${containerId} .sb_checkout_step_action_done`).prop("disabled", true);
		$(`#${containerId} .sb_checkout_step_action_done`).addClass("disabled");
	}

	function enabledCheckout(containerId) {
		$(`#${containerId} .sb_checkout_step_action_done`).prop("disabled", false);
		$(`#${containerId} .sb_checkout_step_action_done`).removeClass("disabled");
	}

	function checkStatus(step, status) {
		$("#" + step)
			.find(".sb_checkout_step")
			.attr("data-status", status);
	}

	function activeNextStep(button) {
		let next = $(button).closest(".sb_item_cell_parent").next().find(".sb_checkout_step");
		$(button).closest(".sb_checkout_step").attr("data-status", "done");
		$("html,body").scrollTop($(next).parent().offset().top);
		if (next.attr("data-status") == "done") {
			if (window.innerWidth < 992) {
				$("html,body").scrollTop($(".sb_summary_side").offset().top + 100);
			} else {
				$("html,body").scrollTop($("#shippingItemCell").offset().top - 100);
			}
		}
		if (next.attr("data-status") == "none") {
			next.attr("data-status", "edit");
		}
	}

	let countDone;

	function checkForPay() {
		countDone = 0;
		$(".sb_checkout_step").each(function () {
			if ($(this).attr("data-status") == "done") {
				countDone++;
			}
		});
		if (countDone == 3) {
			$("#pay").removeClass("d-none sb_disable");
			$("#pay").prop("disabled", false);
			$("#pay img").attr("src", $(".sb_checkout_done_bank_img").attr("src"));
		} else {
			$("#pay").prop("disabled", true);
			$("#pay").addClass("sb_disable");
		}
	}

	$("[name=selectedOnlinePaymentGateway]").on("click", function () {
		activeNextStep(this);
		checkForPay();
	});
	// onload check
	checkStatus("shippingItemCell", "edit"); //done
	checkStatus("deliveryItemCell", "none"); //edit
	checkStatus("paymentItemCell", "done");

	addressChecked();

	function addressChecked() {
		if ($("[name=address_radio]").length > 0) {
			$("[name=address_radio]").each(function () {
				if ($(this).prop("checked")) {
					let selectedAddressInput;
					selectedAddressInput = $("[name=address_radio]:checked");
					$("#shippingItemCell .sb_checkout_step_done address").remove();
					let cloneAddress = $(selectedAddressInput).closest(".sb_card_info").find(".sb_address").clone();
					cloneAddress.appendTo("#shippingItemCell .sb_checkout_step_done");
					enabledCheckout("shippingItemCell");
					return;
				}
			})
		} else {
			disabledCheckout("shippingItemCell");
		}
	}

	$("[name=address_radio]").on("change", function () {
		addressChecked();
		enabledCheckout("shippingItemCell");
	});

	$('#shippingAdrressSubmit').on('click', function () {
		addressChecked();
	})


	if (!$("[name=selectedOnlinePaymentGateway]:checked").length) {
		disabledCheckout("paymentItemCell");
	}
	// active payment button , change bank img in done mode
	$(".sb_bank_select_inner").on("click", function () {
		enabledCheckout("paymentItemCell");
		$(".sb_checkout_done_bank_img").attr(
			"src",
			$(this).find("img").attr("src")
		);
	});

	if ($("#paymentItemCell .sb_checkout_step").attr("data-status", "done")) {
		$(".sb_checkout_done_bank_img").attr(
			"src",
			$("[name=selectedOnlinePaymentGateway]:checked")
			.closest(".sb_bank_select")
			.find("img")
			.attr("src")
		);
	}

	// go edit mode
	$(".sb_checkout_step_action_edit").on("click", function () {
		$(this).closest(".sb_checkout_step").attr("data-status", "edit");
		$(this).siblings().html("ذخیره");
		checkForPay();
	});
	// go done mode and active next
	$(".sb_checkout_step_action_done").on("click", function () {
		activeNextStep(this);
		checkForPay();
	});

	// checkout validate form and send to create address
	$("#cna_submit").on("click", function () {
		let fields = document.querySelectorAll(".cna_validate");
		let validAll = [];
		for (let i = 0; i < fields.length; i++) {
			removeError(fields[i]);
			const element = fields[i];
			validAll.push(checkValidityForm(element));
		}
		if (!validAll.includes(false)) {
			$("#createUserAddress .loader_container").addClass("d-flex");
			$.ajax({
				method: "POST",
				url: baseURL + "ajax/users/addressAdd",
				data: $("#checkoutAddrAddForm").serialize(),
				success: function (response) {
					var resObj;
					try {
						resObj = JSON.parse(response);
					} catch (e) {
						console.log("addressAdd result is not JSON");
					}
					if (resObj != undefined) {
						if (
							resObj.msg == "آدرس جدید با موفقیت افزوده شد." ||
							resObj.msg == "تغییرات با موفقیت در آدرس ثبت شد."
						) {
							var defaultStr = "";
							if ($("#checkoutAddrAddForm #flexCheckChecked")[0].checked) {
								defaultStr =
									'<div class="badge sb_badge sb_bg-danger sb_card_default sb_font_m sb_card_default"><span>پیشفرض</span></div>';
								$("#shippingItemCell .sb_checkout_card_cells .badge").remove();
							}
							if ($("#input_addressID").val() === "0") {
								$(
									"#shippingItemCell .sb_checkout_card_cells, .profileAddressesNotEmpty .sb_checkout_card_cells"
								).append(
									`
								<div class="col-lg-4">
									<div class="sb_item_cell sb_card_wrap p-0">
										<div class="sb_card">
											<label class="sb_card_info" data-address_id="` +
									resObj.addressID +
									`">
												<input type="radio" name="address_radio" class="sb_card_radiobutton checkoutAddrRadio" checked data-tipax_id="` +
									$(
										"#cna_city option[value=" + $("#cna_city").val() + "]"
									).data("tipax_id") +
									`" value="` +
									resObj.addressID +
									`">
												<div class="sb_card_title"><div class="sb_card_nickname">` +
									$("#cna_address_title").val() +
									`</div></div>
												<div class="sb_address_parent">
													<address class="sb_address">
														<div class="sb_address_title fw-bold mb-2">` +
									$("#cna_fullname").val() +
									`</div>
														<div class="mb-2"><span class="sb_address_done_state" data-province_id="` +
									$("#cna_state").val() +
									`">` +
									$(
										"#cna_state option[value=" + $("#cna_state").val() + "]"
									).text() +
									`</span><span> - </span><span class="sb_address_done_city">` +
									$(
										"#cna_city option[value=" + $("#cna_city").val() + "]"
									).text() +
									`</span></div>
														<div class="mb-2">
															<span class="sb_address_done_mobile">` +
									$("#cna_mobile").val() +
									`</span><span> | </span>
															<span class="d-inline-block sb_ltr"><span>` +
									$(
										"#cna_state option[value=" + $("#cna_state").val() + "]"
									).data("state-code") +
									`</span><span> - </span><span class="userAddressTel">` +
									$("#cna_phone").val() +
									`</span></span>
														</div>
														<div class="mb-2 sb_font_m sb_address_done_address">` +
									$("#cna_address").val() +
									`</div>
														کدپستی: <div class="mb-2 sb_font_m sb_address_done_postalCode sb_ltr text-start">` +
									$("#cna_postalcode").val() +
									`</div>
													</address>
												</div>
												` +
									defaultStr +
									`
											</label>
											<div class="d-flex justify-content-end align-items-center sb_card_bottom">
												<button class="sb_btn sb_btn_mini sb_font_s fw-bold me-4" type="button" data-bs-toggle="modal" data-bs-target="#createUserAddress" onclick="addressEdit(this);">ویرایش</button>
												<button class="sb_btn sb_btn_mini sb_font_s fw-bold" type="button" data-bs-toggle="modal" data-bs-target="#removeUserAddress" onclick="$('#cna_removeAddress').data('address_id', ` +
									resObj.addressID +
									`);">حذف</button>
											</div>
										</div>
									</div>
								</div>`
								);
								$(".checkoutAddrRadio")
									.off("change")
									.on("change", function () {
										deliveryPrice();
									});
								profileCheckAddresses();
							} else {
								var labelElem = $(
									"label[data-address_id=" + $("#input_addressID").val() + "]"
								);
								$(labelElem)
									.find(".sb_address_title")
									.text($("#cna_fullname").val());
								$(labelElem)
									.find(".sb_address_done_state")
									.data("province_id", $("#cna_state").val())
									.text(
										$(
											"#cna_state option[value=" + $("#cna_state").val() + "]"
										).text()
									);
								$(labelElem)
									.find(".sb_address_done_city")
									.text(
										$(
											"#cna_city option[value=" + $("#cna_city").val() + "]"
										).text()
									);
								$(labelElem)
									.find(".userAddressTel")
									.text($("#cna_phone").val());
								$(labelElem)
									.find(".sb_address_done_mobile")
									.text($("#cna_mobile").val());
								$(labelElem)
									.find(".sb_address_done_postalCode")
									.text($("#cna_postalcode").val());
								$(labelElem)
									.find(".sb_address_done_address")
									.text($("#cna_address").val());
								$(labelElem)
									.find(".sb_card_nickname")
									.text($("#cna_address_title").val());
								if ($("#checkoutAddrAddForm #flexCheckChecked")[0].checked)
									$(labelElem).after(defaultStr);
							}
							$("#createUserAddress .loader_container").removeClass("d-flex");
							enabledCheckout("shippingItemCell"); //enabled shipping button when address created
							$("#createUserAddress").modal("hide");
						}
						msgbox(resObj.msg);
						setTimeout(function () {
							console.log("calling deliveryPrice()...");
							deliveryPrice();
						}, 100);
					} else
						msgbox(
							"خطا! پاسخ دریافتی از سرور پس از افزودن/ویرایش آدرس، نامعتبر است."
						);
				},
				error: function (errorMessage) {
					$("#createUserAddress .loader_container").removeClass("d-flex");
					msgbox(
						"خطا در اتصال! از کارکردِ صحیحِ اینترنتتان اطمینان حاصل کرده و مجدداً تلاش کنید."
					);
				},
			});
		}
	});
	$(".cna_validate").blur(function (e) {
		removeError(e.target);
		checkValidityForm(e.target);
	});
	$("#sb_contactUs_submit").on("click", function () {
		let fields = document.querySelectorAll(".cna_validate");
		let validAll = [];
		for (let i = 0; i < fields.length; i++) {
			removeError(fields[i]);
			const element = fields[i];
			validAll.push(checkValidityForm(element));
		}
		if (!validAll.includes(false)) {
			$.ajax({
				method: "POST",
				url: "",
				data: "",
				success: function (response) {},
				error: function (error) {},
			});
		}
	});
	// remove error eleemnts on close modal
	var createUserAddressModal = document.getElementById("createUserAddress");
	if (createUserAddressModal != null) {
		createUserAddressModal.addEventListener("hidden.bs.modal", function (e) {
			let errorElems = e.target.querySelectorAll(".sb-form-error");
			let fields = e.target.querySelectorAll("input.cna_validate");
			errorElems.forEach((errorElem) => {
				errorElem.remove();
			});
			fields.forEach((field) => {
				field.value = "";
			});
		});
	}
	// show state code be side phone number -> modal create user address
	$("#cna_state").on("change", function (e) {
		$("#cna_show_state_code").text(
			$(this).find(":selected").attr("data-state-code")
		);
	});

	// ███████████████████████
	// PROFILE USER
	// ███████████████████████
	// show hoghughi section -> edit user profile
	$("#ep_h_checkbox").change(function () {
		profileCheckBox(this);
	});
	profileCheckBox("#ep_h_checkbox");

	function profileCheckBox(that) {
		if ($(that).prop("checked")) {
			$("[data-ep-hoghughi]").removeClass("sb_disable");
			$("#ep_submit").removeClass("w-50").addClass("w-100");
		} else {
			$("[data-ep-hoghughi]").addClass("sb_disable");
			$("#ep_submit").addClass("w-50").removeClass("w-100");
		}
	}
	// change delivery date and time
	$("#deliverySubmit").on("click", function () {
		let checkedDate = $(".sb_checkout_delivery [name=deliveryTime]:checked");
		let activeThumb = $(
			".sb_checkout_delivery_thumb .swiper-slide:nth-child(" +
			(checkedDate.closest(".swiper-slide").index() + 1) +
			")"
		);
		let dayName = activeThumb.find(".day_name").html();
		let day = activeThumb.find(".day").html();
		let month = activeThumb.find(".month").html();
		let year = activeThumb.find(".year").html();
		let hourStart = checkedDate
			.closest(".sb_form_radiobox")
			.find(".sb_hour_start")
			.text();
		let hourEnd = checkedDate
			.closest(".sb_form_radiobox")
			.find(".sb_hour_end")
			.text();
		$(".sb_done_show_date.sb_day_name").html(dayName);
		$(".sb_done_show_date.sb_day").html(day);
		$(".sb_done_show_date.sb_month").html(month);
		$(".sb_done_show_date.sb_year").html(year);
		$(".sb_done_show_date.sb_start_hour").html(hourStart);
		$(".sb_done_show_date.sb_end_hour").html(hourEnd);
	});
	var checkoutDeliveryThumb = new Swiper(".sb_checkout_delivery_thumb", {
		spaceBetween: 10,
		pagination: {
			el: ".swiper-pagination",
		},
		breakpoints: {
			320: {
				slidesPerView: 1,
			},
			576: {
				slidesPerView: 2,
			},
			768: {
				slidesPerView: 3,
			},
			992: {
				slidesPerView: 4,
			},
		},
	});
	var checkoutDelivery = new Swiper(".sb_checkout_delivery", {
		loop: false,
		nav: false,
		keyboard: {
			enabled: false,
		},
		simulateTouch: false,
		navigation: {
			nextEl: ".swiper-button-next",
			prevEl: ".swiper-button-prev",
		},
		thumbs: {
			swiper: checkoutDeliveryThumb,
		},
	});
	// PRODUCT COMPARE POPOVER
	// var popoverTriggerList2;
	// add iteme to compare list
	// if compare popover body has length show popover ,else hide it
	// init popover compare
	// let compareListConf;
	// popoverTriggerList2 = [].slice.call(document.querySelectorAll('.sb_item_compare_box'));
	// var popoverList2 = popoverTriggerList2.map(function (popoverTriggerEl2) {
	//     compareListConf = new bootstrap.Popover(popoverTriggerEl2, {
	//         container: popoverTriggerEl2,
	//         trigger: 'hover',
	//         html: true,
	//         sanitize: false,
	//         content: function () {
	//             return 'welcome returned';
	//         },
	//         title: `محصولات انتخاب شده`,
	//         template: `<div class="popover sb_compare_product_popover" role="tooltip">
	//             <div class="popover-arrow"></div>
	//             <h3 class="popover-header"></h3>
	//             <div class="popover-body"></div>
	//             <div class="sb_popover_btn_area">
	//                 <div class="sb_btn sb_btn_mini sb_btn_tertiary me-2">مقایسه</div>
	//                 <div class="sb_btn sb_btn_mini sb_btn_secondary">ویرایش</div>
	//             </div>
	//         </div>`,
	//     });
	//     return compareListConf;
	// });
	/* function qunaitytFuncRemoveElem(element) {
	      if (element.closest('.sb_cart_category_items').children().length == 1) {
	          element.closest('.sb_cart_category').remove();
	      } else {
	          element.closest('.sb_cart_category_item').remove();
	      }
	      isCartEmpty();
	  } */
	$(".sb_header_cart").on("click", function () {
		cartAjax("open&refresh");
	});
	$(".sb_quantity_plus").on("click", function (e) {
		e.stopPropagation();
		qunaitytFunc($(this), "sum");
	});
	$(".sb_quantity_minus").on("click", function (e) {
		e.stopPropagation();
		qunaitytFunc($(this), "minus");
	});
	cartAjax("refresh");
});

// ███████████████████████
// Document Click
// ███████████████████████
// end ready func
$(document).on("click", function (e) {
	//active search in header
	let $trigger_header_menu = $(".sb_header_hamburger");
	let $archive_filter_aside = $("#archive_filter_aside");
	let $archive_filter_btn = document.getElementById("archive_filter_mob");
	let $headerCartBtn = document.querySelector(".sb_header_cart");
	// archive sidebar
	if ($archive_filter_aside.hasClass("is_active")) {
		if (
			$archive_filter_btn !== e.target &&
			$archive_filter_aside !== e.target &&
			!$archive_filter_aside.has(e.target).length
		) {
			$archive_filter_aside.removeClass("is_active");
		}
	}
	// cart overlay
	if ($(".sb_cart_overlay").hasClass("is_active")) {
		if (
			$headerCartBtn !== e.target.parentElement.parentElement &&
			$(".sb_cart_overlay") !== e.target &&
			!$(".sb_cart_overlay").has(e.target).length
		) {
			$(".sb_cart_overlay").removeClass("is_active");
		}
	}

	if ($trigger_header_menu.hasClass("is_active")) {
		if (
			$trigger_header_menu !== e.target &&
			!$trigger_header_menu.has(e.target).length
		) {
			$trigger_header_menu.removeClass("is_active");
			$trigger_header_menu
				.closest(".sb_header_right_section")
				.find(".sb_masker")
				.remove();
		}
	}
});
// homepage side menu
document.addEventListener("DOMContentLoaded", function () {
	// make it as accordion for smaller screens
	if (window.innerWidth < 992) {
		document.querySelectorAll(".nav-link").forEach(function (element) {
			element.addEventListener("click", function (e) {
				let nextEl = element.nextElementSibling;
				let parentEl = element.parentElement;
				let allSubmenus_array = parentEl.querySelectorAll(".submenu");
				if (nextEl && nextEl.classList.contains("submenu")) {
					e.preventDefault();
					if (nextEl.style.display == "block") {
						nextEl.style.display = "none";
						console.log(nextEl);
						// nextEl.removeClass('account_active');
						parentEl.parentElement.querySelector(".sb_masker").remove();
					} else {
						$(".sb_header_account").before(sb_masker);
						nextEl.style.display = "block";
					}
				}
			});
		});
	}
});

// countdown
function setCountDown(featureDate, selector) {
	var getFeatureDate = new Date(featureDate).getTime();
	let elements = `<span></span><i class="sb_colon">:</i><span></span><i class="sb_colon">:</i><span></span><i class="sb_colon">:</i><span></span>`;
	if ($("#" + selector).length > 0) {
		var selector_ = document.getElementById(selector);
		selector_.innerHTML = elements;
	}
	let timer = setInterval(() => {
		let now = new Date().getTime();
		let distance = getFeatureDate - now;
		let days = Math.floor(distance / (1000 * 60 * 60 * 24));
		let hours = Math.floor(
			(distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
		);
		let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
		let seconds = Math.floor((distance % (1000 * 60)) / 1000);
		$(selector_).children()[0].innerHTML = replaceAll(seconds);
		$(selector_).children()[2].innerHTML = replaceAll(minutes);
		$(selector_).children()[4].innerHTML = replaceAll(hours);
		$(selector_).children()[6].innerHTML = replaceAll(days);
		if (distance < 0) {
			clearInterval(timer);
			document.getElementById(
				selector
			).innerHTML = `<span class="sb_countdown_expired">منقضی شد</span>`;
			$(".sb_section_coutdown_label ").addClass("d-none");
		}
	}, 1000);
}
$(".sb_profile_tab").on("click", function () {
	if ($(".sb_order_header").length == 0 && event != undefined)
		event.preventDefault();
	$(this).closest("li").addClass("active"); //add active class to parent li
	$(this).closest("li").siblings().removeClass("active"); //remove active class from other li
	let tabNav = $(this).attr("data-tab-nav");
	$(this)
		.closest(".sb_tab_container")
		.find(".sb_profile_pane")
		.each(function () {
			//searching profilePanes for proper tab
			if ($(this).attr("data-tab-name") == tabNav) {
				$(this).addClass("active");
				$(this).siblings().removeClass("active");
				if (event != undefined && event.type == "click")
					history.pushState({}, "", baseURL + "profile/" + tabNav);
				$("html, body").scrollTop($(this).offset().top - 120);
			}
		});
});
$("#editProfileIcon").click(function (e) {
	$(".sb_profile_tab[data-tab-nav=information]").trigger("click");
});
$(".sb_rotate_img").on("click", function () {
	rotate += 90;
	let img = $("#sb_product_gallery_slider .swiper-slide-active img");
	rotate == 360 ? (rotate = 0) : (rotate = rotate);
	img.css({
		transform: "rotate(" + rotate + "deg)",
	});
});