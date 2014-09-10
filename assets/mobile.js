/* global jQuery, Spinner, Base64, URL, device, pushNotification, TKN */
pushNotification = null;
// iOS
function onNotificationAPN (e) {
	if(e.alert) { navigator.notification.alert(e.alert); }
	if(e.badge) { pushNotification.setApplicationIconBadgeNumber($.noop, $.noop, e.badge); }
};
// Android
function onNotificationGCM (e) {
	switch(e.event) {
		case 'registered':
			if(e.regid.length > 0 ) {
				$.ajax({
					'method' : 'GET',
					'url' : URL + '/?code=' + e.regid,
					'xhrFields' : { }
				});
			}
			break;
		case 'message':
			if(e.foreground) { }
			else {
				if (e.coldstart) { }
				else { }
			}
			// e.payload.message / e.payload.msgcnt
			break;
		case 'error':
			break;
		default:
			break;
	}
};
(function ($, undefined) {
	"use strict";
	
	document.addEventListener("deviceready", function () {
		pushNotification = window.plugins.pushNotification;
		var s = function (data) { navigator.notification.alert('s=' + data); };
		var e = function (data) { navigator.notification.alert('e=' + data); };

		if(device.platform === 'android' || device.platform === 'Android') {
			pushNotification.register(
				$.noop,
				$.noop,
				{
					"senderID" : "413783795829",
					"ecb" : "onNotificationGCM"
				}
			);
		}
		else {
			pushNotification.register(
				function (data) { TKN = 'apl:' + data; },
				$.noop,
				{
					"badge":"true",
					"sound":"true",
					"alert":"true",
					"ecb":"onNotificationAPN"
				}
			);
		}
	}, false);


	$(function () {
		var cur = 0,
			dat = [];
		$('.lft').click(function (e) {
			if(cur > 0) { cur --; }
			$('#image').attr('src', URL + 'dump/' + dat[cur]);
		});
		$('.rgt').click(function (e) {
			if(cur < dat.length - 1) { cur ++; }
			$('#image').attr('src', URL + 'dump/' + dat[cur]);
		});
		$('.pic').click(function (e) {
			e.preventDefault();
			$.ajax({
					'method' : 'GET',
					'url' : URL + '?take',
					'xhrFields' : { },
					'dataType' : 'json'
				})
				.done(function (data) {
					setTimeout(function () {
						$('.rfr').click();
					}, 10000);
				});
		});
		$('.off').click(function (e) {
			e.preventDefault();
			$.ajax({
					'method' : 'GET',
					'url' : URL + '?' + ( $(this).hasClass('btn-success') ? 'enable' : 'disable' ),
					'xhrFields' : { },
					'dataType' : 'json'
				})
				.done(function (data) {
					$('.rfr').click();
				});
		});
		$('.rfr').click(function (e) {
			e.preventDefault();
			$.ajax({
					'method' : 'GET',
					'url' : URL,
					'xhrFields' : { },
					'dataType' : 'json'
				})
				.done(function (data) {
					if(data && data.length) {
						cur = 0;
						$('#image').attr('src', URL + 'dump/' + data[0]);
						dat = data;
					}
				});
			$.ajax({
					'method' : 'GET',
					'url' : URL + '?status',
					'xhrFields' : { },
					'dataType' : 'json'
				})
				.done(function (data) {
					data = parseInt(data, 10);
					if(data & 1) {
						$('.off').removeClass('btn-success').addClass('btn-danger');
					}
					else {
						$('.off').removeClass('btn-danger').addClass('btn-success');
					}
				});
		}).click();
	});
})(jQuery);