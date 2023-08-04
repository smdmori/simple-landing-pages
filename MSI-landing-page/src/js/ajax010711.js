function msgbox(msgtext, optionalParams) {
	if (msgtext == undefined || msgtext == "")
		$("#modalMsg").modal('hide');
	else {
		$("#modalMsg .modal-body").html(msgtext);
		if (optionalParams != undefined && optionalParams['title'] != undefined && optionalParams['title'] != "")
			$("#modalMsg .modal-title").text(optionalParams['title']);
		if (optionalParams != undefined && optionalParams['dir'] == "ltr")
			$("#modalMsg .modal-body").css({
				"direction": "ltr"
			});
		// try {
		$("#modalMsg").modal('show');
		// } catch(e) {
		// console.log('خطا در نمایش پیام: '+e);
		// }
	}
}

function number_format(floatvar, decimallength, sepratorstr) {
	if (sepratorstr == undefined || sepratorstr == "") sepratorstr = ",";
	var intvar = parseInt(floatvar);
	var decimals = floatvar - intvar;
	if (decimallength != undefined)
		var decimalstr = "." + decimals.toFixed(decimallength).toString().substr(2);
	else
		var decimalstr = "";
	var stringint = intvar.toString();
	var stringlength = parseInt(stringint.length);
	var sepcount = parseInt(stringlength / 3);
	var firstchars = parseInt(stringlength % 3);
	var returnstr = "";
	for (var i = 1; i <= sepcount; i++)
		returnstr = sepratorstr + stringint.substr(i * (-3), 3) + returnstr;
	if (firstchars == 0) returnstr = returnstr.substr(1);
	else returnstr = stringint.substr(0, firstchars) + returnstr;
	return returnstr + decimalstr;
}

$("[data-filter_name]").on("click",function () {
	productListFilter($(this).data("filter_name"), $(this).data("filter_value"));
});

urlParse = document.location.toString().match(/profile\/(\w+)/);
if (urlParse != null) $(".sb_profile_tab[data-tab-nav=" + urlParse[1] + "]").trigger("click");

window.addEventListener('popstate',function (e) {
	urlParse = document.location.toString().match(/profile\/(\w+)/);
	if (urlParse != null) $(".sb_profile_tab[data-tab-nav=" + urlParse[1] + "]").trigger("click");
	else if (document.location.toString().search("profile") != -1) $(".sb_profile_tab[data-tab-nav=dashboard]").trigger("click");
});

$(".sb_categories_desc").before($("#sortAndPagination").clone());

if ($("#panelsStayOpen-headingCategories").offset() != undefined && $(".sb_list_tools_bar").length > 0) {
	$("html, body").scrollTop($("#panelsStayOpen-headingCategories").offset().top - 75);
}


// ███████████████████████

$("button#pay").on("click",function()
{
	var addressID = 0;
	var deliveryTime = 0;
	$("input[name=address_radio]").each(function () {
		if (this.checked) {
			addressID = this.value;
			return false;
		}
	});
	$("input[name=deliveryTime]").each(function () {
		if (this.checked) {
			deliveryTime = this.value;
			return false;
		}
	});

	msgbox('در حال انتقال به درگاه بانک، لطفاً شکیبا باشید...');
	$.ajax({
		method: "POST",
		url: baseURL + "ajax/orders/new",
		data: "addressID=" + addressID + "&deliveryTime=" + deliveryTime,
		success: orderNewS=function (response) {
			if (response.substr(0, 10) == "redirect: ") document.location = response.substr(10);
			else msgbox(response);
		},
		error: orderNewF=function () {
			msgbox('خطا در اتصال! از کارکردِ صحیحِ اینترنتتان اطمینان حاصل کرده و مجدداً تلاش کنید.');
		}
	});
});

$(".profileOrderRepay").on("click",function()
{
	event.preventDefault();
	var urlMatch = document.location.pathname.match('profile\\/orders\\/(\\d+)'); // [original regex] for structure such "profile/order/{oneOrMoreDigits}"
	if (urlMatch!=null) {
		msgbox('در حال برقراری ارتباط، لطفاً شکیبا باشید...');
		$.ajax({
			method: "POST",
			url: baseURL + "ajax/orders/repay",
			data: "id=" + urlMatch[1],
			success: profileOrderRepayS=function (response) {
				if (response.substr(0, 10) == "redirect: ") document.location = response.substr(10);
				else msgbox(response);
			},
			error: profileOrderRepayF=function () {
				msgbox('خطا در اتصال! از کارکردِ صحیحِ اینترنتتان اطمینان حاصل کرده و مجدداً تلاش کنید.');
			}
		});
	} else console.log('url does not match in .profileOrderRepay.on("click")');
});

function addressProvinceChange(cityTitle)
{
	$("#cna_city").html('<option value="0">در حال پردازش، لطفاً شکیبا باشید...</option>');
	$.ajax({
		method: "POST",
		url: baseURL + "ajax/users/provinceCities",
		data: "province=" + $("#cna_state").val() + "&city=" + cityTitle,
		success: addressProvinceChangeS=function (response) {
			$("#cna_city").html(response);
		},
		error: addressProvinceChangeF=function () {
			$("#cna_city").html('<option value="0">خطا! دوباره تلاش کنید.</option>');
			msgbox('خطا در اتصال! از کارکردِ صحیحِ اینترنتتان اطمینان حاصل کرده و مجدداً تلاش کنید.');
		}
	});
};
addressProvinceChange();

function addressEdit(that)
{
	var labelElem = $($(that).parents()[1]).find("label");
	$("#cna_fullname").val($(labelElem).find(".sb_address_title").text());
	$("#cna_state").val($(labelElem).find(".sb_address_done_state").data("province_id"));
	addressProvinceChange($(labelElem).find(".sb_address_done_city").text());
	$("#cna_phone").val($(labelElem).find(".userAddressTel").text());
	$("#cna_mobile").val($(labelElem).find(".sb_address_done_mobile").text());
	$("#cna_postalcode").val($(labelElem).find(".sb_address_done_postalCode").text());
	$("#cna_address").val($(labelElem).find(".sb_address_done_address").text());
	$("#cna_address_title").val($(labelElem).find(".sb_card_nickname").text());
	if ($(labelElem).find(".badge").length > 0) {
		$("#checkoutAddrAddForm #flexCheckChecked")[0].checked = true;
		$("#checkoutAddrAddForm #flexCheckChecked").attr("disabled", "disabled");
	} else {
		$("#checkoutAddrAddForm #flexCheckChecked")[0].checked = false;
		$("#checkoutAddrAddForm #flexCheckChecked").removeAttr("disabled");
	}
	$("#input_addressID").val($(labelElem).data("address_id"));
}

$("#cna_removeAddress").on("click",function()
{
	var addressID = $(this).data("address_id");
	if (addressID != 0) {
		$("#removeUserAddress .loader_container").addClass("d-flex");
		$.ajax({
			method: "POST",
			url: baseURL + "ajax/users/addressRemove",
			data: "id=" + addressID,
			success: cna_removeAddressS=function (response) {
				$("#removeUserAddress").modal('hide');
				$("#removeUserAddress .loader_container").removeClass("d-flex");
				msgbox(response);
				if (response == "حذف آدرس با موفقیت انجام شد.") {
					$($("label[data-address_id=" + addressID + "]").parents()[2]).remove();
					profileCheckAddresses();
					setTimeout(function () {
						console.log("calling deliveryPrice()...");
						deliveryPrice();
					}, 100);
				}
				if ($("[name=address_radio]").length > 0) {
					$("[name=address_radio]").each(function () {
						if ($(this).prop("checked")) {
							let selectedAddressInput;
							selectedAddressInput = $("[name=address_radio]:checked");
							$("#shippingItemCell .sb_checkout_step_done address").remove();
							let cloneAddress = $(selectedAddressInput).closest(".sb_card_info").find(".sb_address").clone();
							cloneAddress.appendTo("#shippingItemCell .sb_checkout_step_done");
							$(`#shippingItemCell .sb_checkout_step_action_done`).prop("disabled", false);
							$(`#shippingItemCell .sb_checkout_step_action_done`).removeClass("disabled");
							return;
						}
					})
				} else {
					$(`#shippingItemCell .sb_checkout_step_action_done`).prop("disabled", true);
					$(`#shippingItemCell .sb_checkout_step_action_done`).addClass("disabled");
				}
			},
			error: cna_removeAddressF=function () {
				$("#removeUserAddress .loader_container").removeClass("d-flex");
				msgbox('خطا در اتصال! از کارکردِ صحیحِ اینترنتتان اطمینان حاصل کرده و مجدداً تلاش کنید.');
			}
		});
	} else {
		msgbox('آدرس مورد نظر یافت نشد!');
		$("#removeUserAddress").modal('hide');
	}
});
$("#removeUserAddress").on("hide.bs.modal",function() {
	$("#cna_removeAddress").data('address_id', 0);
});

$(".checkoutAddrRadio").on("change",function() {
	deliveryPrice();
});

function deliveryPrice()
{
	var tipaxCityID;
	console.log("deliveryPrice() called...");
	$(".deliveryPriceRow strong, .toPayPriceRow strong").text("؟");
	$(".checkoutAddrRadio").each(function () {
		if (this.checked) tipaxCityID = $(this).data("tipax_id");
	});
	if (tipaxCityID != undefined) {
		$.ajax({
			method: "POST",
			url: baseURL + "ajax/orders/deliveryPrice",
			data: "destination=" + tipaxCityID,
			success: deliveryPriceS=function (response) {
				var resObj;
				try {
					resObj = JSON.parse(response);
				} catch (e) {
					console.log("deliveryPrice result is not JSON");
				}
				if (resObj != undefined) {
					if (resObj['result'] == "success") {
						$(".deliveryPriceRow strong").text(replaceAll(number_format(resObj.price)));
						$(".toPayPriceRow strong").text(replaceAll(number_format($(".cartPriceRow").data("unformatted_price") + resObj.price)));
					} else msgbox(resObj['msg']);
				} else msgbox('هزینه ارسالِ دریافتی از سرور، معتبر نیست.');
			},
			error: deliveryPriceF=function () {
				$(".deliveryPriceRow strong, .toPayPriceRow strong").text("!");
				msgbox('خطا در محاسبه هزینه ارسال');
			}
		});
	} else $(".deliveryPriceRow strong, .toPayPriceRow strong").text("؟");
}




// ███████████████████████


function searchHeader() {
	if ($(".sb_header_search input[type=search]").val().trim() != "") {
		if ($(".sb_header_search select").val() == "all")
			document.location = baseURL + "search/" + $(".sb_header_search input[type=search]").val()
		else
			document.location = baseURL + "category/" + $(".sb_header_search select").val() + "/search/" + $(".sb_header_search input[type=search]").val()
	} else
		$(".sb_header_search input[type=search]").trigger("click").trigger("focus");
}

function searchHeaderClear() {
	$(".sb_header_search input[type=search]").val('').trigger("click").trigger("focus");
	searchHeaderClearToggle()
}

function searchHeaderClearToggle() {
	if ($(".sb_header_search input[type=search]").val().trim() != "")
		$(".sb_header_trending.sb_taglist .fa-times").css({
			visibility: "visible"
		});
	else
		$(".sb_header_trending.sb_taglist .fa-times").css({
			visibility: "hidden"
		});
}
searchHeaderClearToggle();

function searchProductArchive() {
	if (document.location.pathname.search("category") == -1)
		document.location = baseURL + "search/" + $("#searchInDesc_top").val()
	else {
		var urlMatch = document.location.pathname.match('category\\/([\\w-]+)'); // [original regex] must have a combination of unicode word with or without dashes in between that comes after "category/"
		document.location = baseURL + "category/" + urlMatch[1] + "/search/" + $("#searchInDesc_top").val()
	}
}
var searchHeaderAjaxRequest;

function searchHeaderAjax() {
	$(".searchMiniResults").html("در حال پردازش...");
	if (searchHeaderAjaxRequest != undefined) searchHeaderAjaxRequest.abort();
	searchHeaderAjaxRequest = $.ajax({
		method: "POST",
		url: baseURL + "ajax/products/search",
		data: "q=" + $(".sb_header_search input[type=search]").val() + "&cat=" + $(".sb_header_search select").val(),
		success: searchHeaderAjaxS=function (response) {
			$(".searchMiniResults").html(response);
		},
		error: searchHeaderAjaxF=function (errorObj) {
			if (errorObj.statusText != "abort") $(".searchMiniResults").html("خطا در دریافتِ خلاصه‌ی نتایج جستجو");
		}
	});
}
$(".sb_header_search_box input").on("focus keyup",function () {
	searchHeaderAjax();
});

function windowResize() {
	var vpw=$("html, body").width();
	var vph=$("html, body").height();
	
	if (vpw<992) {
		$(".sb_product_promo").after($(".sb_product_addons"));
	} else {
		$(".sb_product_pane .sb_product_price").after($(".sb_product_addons"));
	}
	
	$(".searchMiniResults").css({
		"width": $(".sb_header_search_inner").width() - 4,
		"left": $(".sb_header_search_inner")[0].offsetLeft + 2,
		"top": $(".sb_header_search_inner")[0].offsetTop + 30
	});
}
windowResize();
$(window).on("resize", windowResize);
setInterval(function () {
	windowResize();
}, 100);

// ███████████████████████

// CART OVERLAY
function cartAjax(action)
{
	if (action != "loading" && action != "open" && action != "refresh" && action != "open&refresh") action = "open&refresh";
	$('.sb_cart_overlay .loader_container').addClass('d-flex');
	if (action != "loading") {
		if (action == "open" || action == "open&refresh")
			setTimeout(function () {
				var classAddResult = $('.sb_cart_overlay').addClass('is_active');
			}, 10);

		if (action == "refresh" || action == "open&refresh") {
			$.ajax({
				url: baseURL + "ajax/cart/list",
				type: 'GET',
				success: cartAjaxS=function (response) {
					$('.sb_cart_overlay .loader_container').removeClass('d-flex');
					$(".sb_cart_category, #cartOverlayCount, #cartOverlayPriceSum").remove();
					$(".sb_cart_empty").after(response);

					$('.sb_cart_category .sb_quantity_plus').on('click',function (e) {
						e.stopPropagation();
						qunaitytFunc($(this), 'sum');
					});
					$('.sb_cart_category .sb_quantity_minus').on('click',function (e) {
						e.stopPropagation();
						qunaitytFunc($(this), 'minus');
					});

					$("#cartPaneCount").text($("#cartOverlayCount").text());
					$("#cartPanePrice").text($("#cartOverlayPriceSum").text());
					isCartEmpty();
				},
				error: cartAjaxF=function (errorMessage) {
					$('.sb_cart_overlay .loader_container').removeClass('d-flex');
					msgbox('خطا در اتصال! از کارکردِ صحیحِ اینترنتتان اطمینان حاصل کرده و مجدداً تلاش کنید.');
				}
			});
		}
	}
}

function qunaitytFunc(element, action, withoutAjax) {
	if (withoutAjax != true) withoutAjax = false;
	$('.sb_quantity_btn').addClass('disabled');
	cartAjax("loading");

	$(".cartPacking").html('<a href="#">محاسبه مجدد</a>').on("click",function () {
		event.preventDefault();
		document.location = document.location;
	});
	var id = element.parent().data("product_id");

	let $quantityNum = $(".cartPro" + id + "_QTY");
	let num = Number($quantityNum.html());

	if (action == 'sum') {
		num++;
		$('.sb_quantity[data-product_id=' + id + ']').find('.fa-trash-can').removeClass('fa-trash-can').addClass('fa-minus');
		$(".pro" + id + "_addBtn").text("موجود در سبد خرید");
		$(".pro" + id + "_addBtn").parent().attr("onclick", "");
		$(".pro" + id + "_addBtn").parent().off("click");
		$(".pro" + id + "_addBtn").parent().on("click",function () {
			cartAjax();
		});
		$(".proSingleMobileCartQTY").removeClass("d-none");
	} else if (action == 'minus') {
		num--;
		if (num == 1)
			$('.sb_quantity[data-product_id=' + id + ']').find('.fa-minus').removeClass('fa-minus').addClass('fa-trash-can');
		else if (num == 0) {
			$('.sb_btn_added_basket').removeClass('d-flex');
			$('.sb_btn_not_added_basket').removeClass('d-none');
			$(".pro" + id + "_addBtn").text("افزودن به سبد خرید");
			$(".pro" + id + "_addBtn").parent().attr("onclick", "");
			$(".pro" + id + "_addBtn").parent().off("click");
			$(".pro" + id + "_addBtn").parent().on("click",function () {
				cart_add(id, 1);
			});
			$(".proSingleMobileCartQTY").addClass("d-none");
		}
	}
	$quantityNum.html(num);
	if (num == 0) $(".proSingleCartQTY").text("1"); // preparing default value for next time adding to cart

	var totalPrice, thisNum, thisID;
	var cartTotal = 0;
	$("[data-price]").each(function () {
		thisNum = $($(this).parents()[3]).find(".sb_quantity_num").text();
		totalPrice = thisNum * parseInt($(this).data("price"));

		thisID = $($(this).parents()[3]).find("[data-product_id]").data("product_id");
		$("#cartPro" + thisID + "_totalPrice").text(replaceAll(number_format(totalPrice)));

		cartTotal += totalPrice;
	});
	$("#cartItemsTotal").data("cart_items_total", cartTotal).text(replaceAll(number_format(cartTotal)));
	var toPay = cartTotal /*  + $("#deliveryPrice").data("delivery_price") */ ;
	$(".cartTotalPrice").data("to_pay_price", toPay).text(replaceAll(number_format(toPay)));

	if (!withoutAjax) { // when called in withoutAjax mode, it's usually just for undoing an failed ajax
		$.ajax({
			method: "POST",
			url: baseURL + "ajax/cart/edit",
			data: {
				"id": id,
				"count": num
			},
			success: qunaitytFuncS=function (response) {
				responseArr = JSON.parse(response);
				if (responseArr.msg=="productPriceID not found")
				{
					$('.sb_quantity_btn').removeClass('disabled');
					msgbox('تغییر تعداد با خطا مواجه شد، لطفاً صفحه را نوسازی/رفرش کنید و مجدداً تلاش کنید.');
					if (action == "sum") qunaitytFunc(element, "minus", true);
					else qunaitytFunc(element, "sum", true);
				}
				else if (responseArr.msg=="stock is below desired count")
				{
					$('.sb_quantity_btn').removeClass('disabled');
					msgbox('تغییر تعداد ممکن نیست، موجودی این آیتم در انبار کمتر از تعداد درخواستی شماست.');
					if (action == "sum") qunaitytFunc(element, "minus", true);
					else qunaitytFunc(element, "sum", true);
				}
				else if (responseArr.msg.substr(0, 9)=="limit is ")
				{
					$('.sb_quantity_btn').removeClass('disabled');
					msgbox('خطا! از این آیتم می‌توانید حداکثر '+replaceAll(responseArr.msg.substr(9))+' عدد به سبد خرید خود اضافه کنید.');
					if (action == "sum") qunaitytFunc(element, "minus", true);
					else qunaitytFunc(element, "sum", true);
				}
				else
				{
					if ($("#paymentItemCell").length > 0) document.location = document.location;

					$('.sb_quantity_btn').removeClass('disabled');
					if (responseArr.msg == "حذف از سبد خرید با موفقیت انجام شد.")
						$("#cartRow" + id).remove();

					if ($("#cartRows").length > 0 && $("#cartRows").children().length <= 0)
						document.location = baseURL + "cart";

					$("#cartCountElem").text("(" + replaceAll(responseArr.count) + ")");
					if ($(".sb_cart_overlay").hasClass("is_active")) cartAjax("refresh");
				}
			},
			error: qunaitytFuncF=function () {
				$('.sb_quantity_btn').removeClass('disabled');
				msgbox('خطا در اتصال! از کارکردِ صحیحِ اینترنتتان اطمینان حاصل کرده و مجدداً تلاش کنید.');
				if (action == "sum") qunaitytFunc(element, "minus", true);
				else qunaitytFunc(element, "sum", true);
			}
		});
	} else $('.sb_quantity_btn').removeClass('disabled');
}

function isCartEmpty() {
	let emptyCart = false;
	if ($('.sb_cart_overlay_middle').children().length == 1) {
		$('.sb_cart_empty').removeClass('d-none');
		$('#goToCheckout').addClass('disabled');
		$('#goToCart').addClass('disabled');
		emptyCart = true;
	} else {
		$('.sb_cart_empty').addClass('d-none');
		$('#goToCheckout').removeClass('disabled');
		$('#goToCart').removeClass('disabled');
	}
	return emptyCart;
}

// ██ cartCheck function only works fine on productSingle, using it on Cart or other pages may result bugs
function cartCheck(id) {
	$(".sb_product_buy_box .sb_price_current strong, .sb_product_bar .sb_price_current strong, .sb_price.d-lg-none strong").text($("#proSinglePrice" + id).text());
	
	if ($("#proSinglePrice"+id).data("price_before_discount")>0 && $("#proSinglePrice"+id).data("price_before_discount")>$("#proSinglePrice"+id).data("price"))
	{
		$(".sb_product_pane .sb_price_was .sb_price_was_data, .sb_product_wrapp_inner .sb_price_was .sb_price_was_data").text(replaceAll(number_format($("#proSinglePrice"+id).data("price_before_discount"))));
		var priceDiff=parseInt($("#proSinglePrice"+id).data("price_before_discount"))-parseInt($("#proSinglePrice"+id).data("price"));
		$(".sb_product_pane .sb_price_save_price span:first-child, .sb_product_wrapp_inner .sb_price_save_price span:first-child").text(replaceAll(number_format(priceDiff)));
		$(".sb_product_pane .sb_price_save_percent, .sb_product_wrapp_inner .sb_price_save_percent").text(replaceAll(Math.round((priceDiff/$("#proSinglePrice"+id).data("price_before_discount"))*100))+"%");
		$(".sb_product_pane .sb_price_was, sb_product_pane .sb_price_map, .sb_product_pane .sb_price_save").removeClass("d-none");
		$(".sb_product_wrapp_inner .sb_price_was, sb_product_wrapp_inner .sb_price_map, .sb_product_wrapp_inner .sb_price_save").removeClass("d-none");
	}
	else
	{
		$(".sb_product_pane .sb_price_was, sb_product_pane .sb_price_map, .sb_product_pane .sb_price_save").addClass("d-none");
		$(".sb_product_wrapp_inner .sb_price_was, sb_product_wrapp_inner .sb_price_map, .sb_product_wrapp_inner .sb_price_save").addClass("d-none");
	}
	
	$("#productBuy > .row > .col.d-flex").html("<p>در حال بررسی، لطفاً شکیبا باشید...</p>");
	$.ajax({
		method: "POST",
		url: baseURL + "ajax/cart/check",
		data: {
			"id": id
		},
		success: function (response) {
			$("#productBuy > .row > .col.d-flex").html(response); //changing content of productSingle addToCartBlock
			var oldPriceID = $(".proSingleMobileCartQTY").data("product_id"); //storing oldPriceID from mobileBar

			$(".proSingleMobileCartQTY").data("product_id", id); //changing priceID of mobileBar to new priceID
			$(".cartPro" + oldPriceID + "_QTY").removeClass("cartPro" + oldPriceID + "_QTY").addClass("cartPro" + id + "_QTY"); //changing priceID of mobileBar & addToCartBlock quantityIndicator to new priceID
			$(".pro" + oldPriceID + "_addBtn").removeClass("pro" + oldPriceID + "_addBtn").addClass("pro" + id + "_addBtn"); //changing priceID of fixedBar & mobileBar addToCart buttons to new priceID

			// ██ we must check status from response to add proper onClick and innerText
			$(".pro" + id + "_addBtn").parent().attr("onclick", "").off("click"); //removing fixedBar & mobileBar addToCart buttons action
			$(".sb_mobile_bar .sb_quantity_btn").off("click"); //removing mobileBar quantityButtons action

			$(".sb_mobile_bar .proSingleCartQTY").text($("#productBuy .cartPro" + id + "_QTY").text()); //changing innerText of mobileBar quantityIndicator
			$(".sb_mobile_bar .sb_quantity_plus").on("click",function () {
				qunaitytFunc($(this), "sum");
			}); //adding onClick of mobileBar quantityPlusButton
			$(".sb_mobile_bar .sb_quantity_minus").on("click",function () {
				qunaitytFunc($(this), "minus");
			}); //adding onClick of mobileBar quantityMinusButton
			if ($("#productBuy .cartPro" + id + "_QTY").text() <= 1) $(".sb_mobile_bar .sb_quantity_minus i").removeClass("fa-minus").addClass("fa-trash-can");
			else $(".sb_mobile_bar .sb_quantity_minus i").addClass("fa-minus").removeClass("fa-trash-can");

			if ($("#productBuy .sb_btn_added_basket").hasClass("d-flex")) {
				$(".pro" + id + "_addBtn").text("موجود در سبد خرید"); //changing innerText of fixedBar & mobileBar addToCart buttons
				$(".sb_mobile_bar .sb_quantity").removeClass("d-none");
				$(".pro" + id + "_addBtn").parent().on("click",function () {
					cartAjax();
				}); //adding onClick of fixedBar & mobileBar openCart buttons
			} else {
				$(".pro" + id + "_addBtn").text("افزودن به سبد خرید"); //changing innerText of fixedBar & mobileBar addToCart buttons
				$(".sb_mobile_bar .sb_quantity").addClass("d-none");
				$(".pro" + id + "_addBtn").parent().on("click",function () {
					cart_add(id, 1);
				}); //adding onClick of fixedBar & mobileBar addToCart buttons
			}
		},
		error: function () {
			$("#productBuy > .row > .col.d-flex").html("خطا در اتصال! از کارکرد صحیح اینترنتتان اطمینان حاصل کرده و صفحه را نوسازی کنید.");
			console.log('connection error in cartCheck(id: ' + id + ')');
		}
	});
}

function cart_add(id, count) {
	cartAjax("open");
	$('.sb_btn_not_added_basket').addClass('d-none');
	$.ajax({
		method: "POST",
		url: baseURL + "ajax/cart/add",
		data: {
			"id": id,
			"count": count
		},
		success: cart_addS=function (response) {
			if (response!="productPriceID not found")
			{					
				cartAjax("refesh");
				$('.sb_btn_added_basket').addClass('d-flex');
				$(".pro" + id + "_addBtn").text("موجود در سبد خرید");
				$(".pro" + id + "_addBtn").parent().attr("onclick", "");
				$(".pro" + id + "_addBtn").parent().off("click");
				$(".pro" + id + "_addBtn").parent().on("click",function () {
					cartAjax();
				});
				$(".proSingleMobileCartQTY").removeClass("d-none");

				if ($("#productBuy .cartPro" + id + "_QTY").text() <= 1) $(".sb_mobile_bar .sb_quantity_minus i, #productBuy .sb_quantity_minus i").removeClass("fa-minus").addClass("fa-trash-can");
				else $(".sb_mobile_bar .sb_quantity_minus i, #productBuy .sb_quantity_minus i").addClass("fa-minus").removeClass("fa-trash-can");
			}
			else if (response=="productPriceID not found")
			{
				msgbox('افزودن به سبد خرید با خطا مواجه شد، لطفاً صفحه را نوسازی/رفرش کنید و مجدداً تلاش کنید.');
				$('.sb_btn_not_added_basket').removeClass('d-none');
			}
			else if (response=="stock is below desired count")
			{
				msgbox('موجودی این آیتم به اتمام رسیده است، لطفاً صفحه را نوسازی/رفرش کنید و مجدداً تلاش کنید.');
				$('.sb_btn_not_added_basket').removeClass('d-none');
			}
			else if (response.substr(0, 9)=="limit is ")
			{
				msgbox('خطا! از این آیتم می‌توانید حداکثر '+replaceAll(response.substr(9))+' عدد به سبد خرید خود اضافه کنید.');
				$('.sb_btn_not_added_basket').removeClass('d-none');
			}
		},
		error: cart_addF=function () {
			msgbox('خطا در اتصال! از کارکردِ صحیحِ اینترنتتان اطمینان حاصل کرده و مجدداً تلاش کنید.');
			$('.sb_btn_not_added_basket').removeClass('d-none');
		}
	});
}

function cart_remove(id) {
	event.preventDefault();
	var qtyElem = $(".cartPro" + id + "_QTY")[0];
	$(qtyElem).text("1");
	$(qtyElem).next().trigger("click");
}


// ███████████████████████

function profileLastOrder() {
	$(".profileDashboardLastOrder").html($(".profileLastOrder").html());
	$(".profileDashboardLastOrder button").remove();
	$(".profileDashboardLastOrder, .profileDashboardLastOrderLink").attr("href", $(".profileLastOrder").attr("href"));
}
profileLastOrder();

function profileCheckAddresses() {
	if ($(".row.sb_checkout_card_cells").children().length > 0) {
		$(".profileAddressesEmpty").hide();
		$(".profileAddressesNotEmpty").show();
	} else {
		$(".profileAddressesEmpty").show();
		$(".profileAddressesNotEmpty").hide();
	}
}
profileCheckAddresses();

function profileUpdateBasicInfo() {
	msgbox('در حال پردازش، لطفاً شکیبا باشید...');
	$.ajax({
		method: "POST",
		url: baseURL + "ajax/users/updateBasicInfo",
		data: $("#profileBasicInfo").serialize(),
		success: profileUpdateBasicInfoS=function (response) {
			msgbox(response);
		},
		error: profileUpdateBasicInfoF=function () {
			msgbox('خطا در اتصال! از کارکردِ صحیحِ اینترنتتان اطمینان حاصل کرده و مجدداً تلاش کنید.');
		}
	});
}


// ███████████████████████


var initialProductSeriesForm = $(".sb_product_option.sb_form_cells").html();

function narrowProductsInSeries(seriesID, productIDsStr, selectedParamVal) {
	if (event) event.preventDefault();
	$(".sb_product_option.sb_form_cells").html("<p>در حال پردازش، لطفاً شکیبا باشید...</p>");
	$.ajax({
		method: "POST",
		url: baseURL + "ajax/productseries/narrowProducts",
		data: {
			"seriesID": seriesID,
			"productIDs": productIDsStr,
			"selectedParamVal": selectedParamVal
		},
		success: narrowProductsInSeriesS=function (response) {
			$(".sb_product_option.sb_form_cells").html(response);
		},
		error: narrowProductsInSeriesF=function () {
			resetProductSeries(true);
			console.log('connection error in narrowProductsInSeries(seriesID: ' + seriesID + ', productIDsStr: ' + productIDsStr + ')');
		}
	});
}

function resetProductSeries(showError) {
	if (event) event.preventDefault();
	var errorHtml = "";
	if (showError != true) showError = false;
	if (showError)
		errorHtml = '<p style="color: #c00; font-size: 12px; font-weight: 800">خطا در اتصال! از کارکردِ صحیحِ اینترنتتان اطمینان حاصل کرده و مجدداً تلاش کنید.</p>';
	$(".sb_product_option.sb_form_cells").html(errorHtml + initialProductSeriesForm);
}

function productListFilter(getParamName, getParamVal) {
	msgbox('لطفا شکیبا باشید...');
	var newGetStr = "?";
	var regex = /(\w+)=(\w+)/gm;
	var m;

	while ((m = regex.exec(document.location.search)) !== null) {
		if (m.index === regex.lastIndex) regex.lastIndex++;

		if (m[1] == getParamName) newGetStr += getParamName + "=" + getParamVal + "&";
		else newGetStr += m[1] + "=" + m[2] + "&";
	}

	if (newGetStr.search(getParamName) == -1) newGetStr += getParamName + "=" + getParamVal;
	else newGetStr = newGetStr.substr(0, newGetStr.length - 1);

	document.location = document.location.pathname + newGetStr;
}