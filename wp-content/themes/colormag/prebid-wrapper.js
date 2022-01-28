

var pbjs = pbjs || {};
pbjs.que = pbjs.que || [];

var googletag = googletag || {};
googletag.cmd = googletag.cmd || [];

var PREBID_TIMEOUT = 2500;
var FAILSAFE_TIMEOUT = 3000;
var adsOffset = 800;


var adUnits = [
    {
        // aditude_test1
        code: '/22360860229/Aditude/aditude_test1',
        mediaTypes: {
            banner: {
                sizes: [[970, 250]],
            },
        },
        bids: [
          {
               bidder: 'rhythmone',
               params: {
                   placementId: '238205',
               },
          },
          {
                bidder: '33across',
                params: {
                    siteId: 'a3U8Oug8Or7ik1aKlKyvbs',
                    productId: 'siab',
                },
            },
            {
                bidder: 'pubmatic',
                params: {
                    publisherId: '160912',
                },
            },
        ],
    },
    {
        // aditude_test2
        code: '/22360860229/Aditude/aditude_test2',
        mediaTypes: {
            banner: {
                sizes: [[300, 250]],
            },
        },
        bids: [
          {
               bidder: 'rhythmone',
               params: {
                   placementId: '238205',
               },
          },
          {
                bidder: '33across',
                params: {
                    siteId: 'a3U8Oug8Or7ik1aKlKyvbs',
                    productId: 'siab',
                },
            },
            {
                bidder: 'pubmatic',
                params: {
                    publisherId: '160912',
                },
            },
        ],
    },
    {
        // aditude_test3
        code: '/22360860229/Aditude/aditude_test3',
        mediaTypes: {
            banner: {
                sizes: [[300, 600], [300, 250]],
            },
        },
        bids: [
          {
               bidder: 'rhythmone',
               params: {
                   placementId: '238205',
               },
          },
          {
                bidder: '33across',
                params: {
                    siteId: 'a3U8Oug8Or7ik1aKlKyvbs',
                    productId: 'siab',
                },
            },
            {
                bidder: 'pubmatic',
                params: {
                    publisherId: '160912',
                },
            },
        ],
    },

];

var prop2map = {};
adUnits.forEach(function(entry) {
    prop2map[entry.code] = entry;
});

pbjs.que.push(function() {
    pbjs.addAdUnits(adUnits);
    pbjs.setConfig({
        priceGranularity: "high",
    });
});

googletag.cmd.push(function() {
  googletag.pubads().enableSingleRequest();
  googletag.pubads().disableInitialLoad();
  googletag.enableServices();
});




function initAdserver() {
  if (pbjs.initAdserverSet) return;
  pbjs.initAdserverSet = true;
  googletag.cmd.push(function() {
      pbjs.que.push(function() {
          pbjs.setTargetingForGPTAsync();
      });
  });
}

setTimeout(function() {
    initAdserver();
}, FAILSAFE_TIMEOUT);
