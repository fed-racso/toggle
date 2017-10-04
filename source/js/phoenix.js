window.phoenixVars = {
  epgQuickLinksTop: 0,
  epgNavTop: 0,
  navHoverDelay: 500,
  localNavTop: 0,
  localNavMoreLimit: 5,
  navItems: [],
  breakpoints: {
    small: 480,
    small2: 560,
    medium: 760,
    mLarge: 980,
    large: 1140,
    xlarge: 1440
  },

  megaSliderConfigurations: {
    megaSlider: {
      targetClass: '.megaslider',
      ignoredClasses: '.megaslider__single, .megaslider__portrait, .megaslider__8, .megaslider__8--3up, .megaslider__4',
      config: {
        numItemsToShow: {
          760: 2,
          1140: 3
        }
      }
    },
    megaSliderSingle: {
      targetClass: '.megaslider__single',
      config: {
        numItemsToShow: {
          760: 4,
          1140: 6
        }
      }
    },
    megaSliderPortrait: {
      targetClass: '.megaslider__portrait',
      config: {
        numItemsToShow: {
          760: 6,
          1140: 8
        }
      }
    },
    megaSliderIn8: {
      targetClass: '.megaslider__8',
      config: {
        numItemsToShow: {
          760: 2,
        }
      }
    },
    megaSliderIn4: {
      targetClass: '.megaslider__4',
      config: {
        numItemsToShow: {
          0: 1,
        }
      }
    },
    megaSlider3up: {
      targetClass: '.megaslider__8--3up',
      config: {
        numItemsToShow: {
          760: 3,
        }
      }
    },
    megaSlider4upPortrait: {
      targetClass: '.megaslider__8--4up-portrait',
      config: {
        numItemsToShow: {
          760: 4,
        }
      }
    }
  }
};