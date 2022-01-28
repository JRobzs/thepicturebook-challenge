(function() {
    //temp variable for testing
    var isDevice = false;

    var slotStartID = 1;
    var adOffset = 300;



    function loadOnPageSlots() {

        var type = 'desktop-slots';
        var slotPathAttr = 'data-dsp';
        var slotSizeAttr = 'data-d-size';

        if(isDevice){
            type = 'mobile-slots';
            slotPathAttr = 'data-msp';
            slotSizeAttr = 'data-m-size';
        }

        var slotDoms = jQuery('.dd-slots');

        if(slotDoms.length == 0)
            return;

        slotDoms.addClass(type);
        slotDoms.removeClass('dd-slots');

        for(var i = 0; i < slotDoms.length; i++) {

            var $slotDom = jQuery(slotDoms[i]);

            if(isDevice){
              $slotDom.remove();
            }

            var slotElement = $slotDom.find('.slot-data');

            if(slotElement) {
                  var slotName = jQuery(slotElement).attr(slotPathAttr);

                  var sizeAttrExists = jQuery(slotElement).attr(slotSizeAttr);
                  if (typeof sizeAttrExists !== typeof undefined && sizeAttrExists !== false) {
                      var slotSizes = JSON.parse(jQuery(slotElement).attr(slotSizeAttr));
                  } else {
                      var slotSizes = [[728,90]];

                      if(isDevice)
                          var slotSizes = [[300,250]];
                  }
                  var placeholderID = jQuery(slotElement).attr('id');

                  if(slotName !== 'false') {
                      deployOnPageSlot(slotName, slotSizes, placeholderID);
                  } else {
                      $slotDom.remove();
                  }
            }
        }

    }

    function deployOnPageSlot(slotName, slotSizes, placeholderID){
			googletag.cmd.push(function() {
					var slot = googletag.defineSlot(slotName, slotSizes, placeholderID)
					.addService(googletag.pubads());
					refreshBid(slot);
			});

		}


    var getSlotAdUnits = function() {
  		return adUnits.map(function (a) {
  			return Object.assign({}, a);
  		});
  	};

  	function refreshBid(slot) {
  		var adUnitCode = slot.getAdUnitPath();
  		var id = slot.getSlotElementId();

  		pbjs.que.push(function() {
  				pbjs.removeAdUnit(id);
  		});

  		var refreshAdUnits = [];

  		getSlotAdUnits().forEach(function(e) {
  				if (e.code == adUnitCode) {
  						e.code = id;
  						refreshAdUnits.push(e);
  				}
  		});

  		if (refreshAdUnits.length < 1) {
  			console.error('No ad units found in config to refresh for id', id);
  			return;
  		}

  		pbjs.que.push(function() {
  			pbjs.addAdUnits(refreshAdUnits);
  			pbjs.requestBids({
  				timeout: PREBID_TIMEOUT,
  				adUnitCodes: [id],
  				bidsBackHandler: function() {
  					pbjs.setTargetingForGPTAsync([id]);
  					googletag.pubads().refresh([slot]);
  				}
  			});
  		});
  	}


    function initLazyLoadUnits() {
        jQuery.fn.isInViewport = function(offset) {

            var elementTop = jQuery(this).offset().top - offset;
            var elementBottom = elementTop + jQuery(this).outerHeight();

            var viewportTop = jQuery(window).scrollTop();
            var viewportBottom = viewportTop + jQuery(window).height();

            return elementBottom > viewportTop && elementTop < viewportBottom;
        };

        var lazySlots = jQuery('.ad_slot');
        for(var i = 0; i < lazySlots.length; i++) {
            var element = jQuery(lazySlots[i]);
            if(element.isInViewport(adOffset)) {
                if(isDevice) {
                    var placeholderID = 'in-content-ad-'+slotStartID;
                    var slotPathAttr = 'data-msp';
                    var slotSizeAttr = 'data-m-size';
                } else {
                    var placeholderID = 'in-content-ad-'+slotStartID;
                    var slotPathAttr = 'data-dsp';
                    var slotSizeAttr = 'data-d-size';
                }

                var sizeAttrExists = element.attr(slotSizeAttr);
                if (typeof sizeAttrExists !== typeof undefined && sizeAttrExists !== false) {
                    var slotSizes = JSON.parse(jQuery(slotElement).attr(slotSizeAttr));
                } else {
                    var slotSizes = [[728,90]];

                    if(isDevice)
                        var slotSizes = [[300,250]];
                }

                var slotName = element.attr(slotPathAttr);

                if(slotName !== "false") {
                  var adUnit = jQuery('<div class="ad-container advertisment_notice"><span class="ad-label">Advertisement</span><div id="'+placeholderID+'"></div></div>');
                  if(isDevice){
                    var adUnit = jQuery('<div class="ad-container"><span class="ad-label">Advertisement</span><div id="'+placeholderID+'" align="center"></div></div>');
                  }
                  element.replaceWith(adUnit);
                  deployOnPageSlot(slotName, slotSizes, placeholderID);
                  slotStartID++;
                } else {
                    element.remove();
                }
            }
        }
    }

    jQuery(document).ready(function(){
        setTimeout(function(){
            loadOnPageSlots();
        }, 1);
    });
    jQuery(window).on('resize scroll', function() {
        initLazyLoadUnits();
    });
})();
