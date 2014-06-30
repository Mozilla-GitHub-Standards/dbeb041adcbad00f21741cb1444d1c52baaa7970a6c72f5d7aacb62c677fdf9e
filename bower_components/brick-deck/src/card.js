(function () {

  var BrickCardElementPrototype = Object.create(HTMLElement.prototype);

  BrickCardElementPrototype.createdCallback = function () {
    this.ns = {};
  };

  BrickCardElementPrototype.attachedCallback = function () {
    this.ns = {};
    this.ns.selected = this.hasAttribute("selected");
    var deck = this.parentNode;
    if (deck.nodeName.toLowerCase() === 'brick-deck') {
      this.ns.deck = deck;
      if (this !== deck.selectedCard && this.selected) {
        deck.showCard(this);
      }
    }
  };

  BrickCardElementPrototype.detachedCallback = function () {
    var deck = this.ns.deck;
    if (deck) {
      if (this === deck.selectedCard) {
        deck.selectedCard = null;
        deck.removeAttribute('selected-index');
      } else {
        deck.showCard(deck.selectedCard);
      }
      this.ns.deck = null;
    }
  };

  BrickCardElementPrototype.attributeChangedCallback = function (attr, oldVal, newVal) {
    if (attr in attrs) {
      attrs[attr].call(this, oldVal, newVal);
    }
  };

  // Attribute handlers
  var attrs = {
    'selected': function (oldVal, newVal) {
      this.ns.selected = newVal;
    },
  };

  // Property handlers
  Object.defineProperties(BrickCardElementPrototype, {
    'selected': {
      get : function () {
        return this.ns.selected;
      },
      set : function (newVal) {
        var deck = this.ns.deck;
        if (deck) {
          if (newVal) {
            if (this === deck.selectedCard) {
              this.setAttribute("selected");
            } else {
              deck.showCard(this);
            }
          } else {
            if (this === deck.selectedCard) {
              deck.hideCard(this);
            } else {
              this.removeAttribute("selected");
            }
          }
        }
      }
    },
    'transitionType': {
      get: function() {
        return this.getAttribute("transition-type");
      },
      set: function(newVal) {
        this.setAttribute("transition-type", newVal);
      }
    }
  });

  // Register the element
  window.BrickCardElement = document.registerElement('brick-card', {
    prototype: BrickCardElementPrototype
  });

})();
