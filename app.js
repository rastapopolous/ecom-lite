// TODO:
// 1. add material design light
// 2. checkout
(function (document) {
  'use strict';

  var productData = [{
      id: '1',
      title: 'Red Pen',
      desc: 'Cross out your foes with this pen',
      price: 2.5,
      quantity: 10,
      visible: true
    }, {
      id: '2',
      title: 'Blue Pen',
      desc: 'Lively and energetic',
      price: 2.5,
      quantity: 5,
      visible: true
    }, {
      id: '3',
      title: 'Black Pen',
      desc: 'Timeless Elegance',
      price: 2.5,
      quantity: 13,
      visible: true
    }
  ];

  function Grid (el, inventory, cart) {
    var self = this;

    self.el = el;

    self.createGrid = function () {
      var productIds = Object.keys(inventory.products);

      productIds.forEach(function (id) {
        self.el.appendChild(self.createProductElement(inventory.products[id]));
      });
    };

    self.createProductElement = function (product) {
      var el = document.createElement('div');
      el.className = 'product';
      el.id = 'gridProd' + product.id;
      el.dataset.id = product.id;

      var add = document.createElement('div');
      add.className = 'add-button';
      add.innerHTML = '+';
      add.addEventListener('click', addProductToCart);
      el.appendChild(add);

      var title = document.createElement('p');
      title.className = 'title';
      title.innerHTML = product.title;
      el.appendChild(title);

      var desc = document.createElement('p');
      desc.className = 'desc';
      desc.innerHTML = product.desc;
      el.appendChild(desc);

      return el;
    };

    function addProductToCart (event) {
      var productId = event.target.parentElement.dataset.id;
      cart.addProduct(productId);
    }
  }

  function Cart (el, inventory) {
    var self = this;

    self.el = el;
    self.el.querySelector('.clear-cart-button').addEventListener('click', clearCart);

    //Create order object, display order with all indiv items in it and order total sums, remove items from cart
    self.el.querySelector('.begin-checkout-button').addEventListener('click', beginCheckout, clearCart);

    self.addProduct = function (productId) {
      var productObj = inventory.products[productId];
      var quantity = 1; // TODO: pass in quantity

      // make sure the productId is valid
      if (productObj) {
        // attempt to decrease the quantity in the inventory
        if (productObj.decreaseQuantity(quantity)) {
          productObj.increaseCartQuantity(quantity);

          // look for a product already in the cart
          var cartProductElement = self.findProductCartElement(productId);

          if (!cartProductElement) {
            self.el.appendChild(self.createProductElement(productObj));
          } else {
            cartProductElement.querySelector('.quantity').innerHTML = productObj.cartQuantity;
          }
        } else {
          alert('Not enough product in stock.');
        }
      } else {
        alert('Could not find product. Check the id.');
      }
    };

    self.removeProduct = function (productId, quantity) {
      var productObj = inventory.products[productId];
      var quantity = quantity || 1;

      // make sure the productId is valid
      if (productObj) {
        // attempt to decrease the quantity in the cart
        if (productObj.decreaseCartQuantity(quantity)) {
          productObj.increaseQuantity(quantity);

          // look for a product already in the cart
          var cartProductElement = self.findProductCartElement(productId);

          cartProductElement.querySelector('.quantity').innerHTML = productObj.cartQuantity;
        }
        // remove the element from the cart if it's the last one
        else {
          productObj.increaseQuantity(quantity);

          var cartProductElement = self.findProductCartElement(productId);
          cartProductElement.remove();
        }
      } else {
        alert('Could not find product. Check the id.');
      }
    };

    self.findProductCartElement = function (productId) {
      return document.querySelector('#cartProd' + productId);
    };

    self.createProductElement = function (product) {
      var el = document.createElement('div');
      el.className = 'product';
      el.id = 'cartProd' + product.id;
      el.dataset.id = product.id;

      var remove = document.createElement('div');
      remove.className = 'remove-button';
      remove.innerHTML = 'X';
      remove.addEventListener('click', removeCartProduct);
      el.appendChild(remove);

      var title = document.createElement('p');
      title.className = 'title';
      title.innerHTML = product.title;
      el.appendChild(title);

      var desc = document.createElement('p');
      desc.className = 'desc';
      desc.innerHTML = product.desc;
      el.appendChild(desc);

      var quantity = document.createElement('span');
      quantity.className = 'quantity';
      quantity.innerHTML = product.cartQuantity;
      el.appendChild(quantity);

      return el;
    };

    function removeCartProduct (event) {
      var productId = event.target.parentElement.dataset.id;
      self.removeProduct(productId);
    }

    self.clearCart =  function (event) {
      var cartProductElements = self.el.querySelectorAll('.product');
      var productId = 0;
      var productQuantity = 0;

      for (var i = 0; i < cartProductElements.length; i++) {
        productId = cartProductElements[i].dataset.id;
        productQuantity = Number.parseInt(cartProductElements[i].querySelector('.quantity').innerHTML);

        self.removeProduct(productId, productQuantity);
      }
    }

    function addProductToCart (event) {
      var productId = event.target.parentElement.dataset.id;
      cart.addProduct(productId);
    }
  }



  function Order(el, cart){

    var self = this;
    self.el = el;
    el.style.visibility = "hidden";

    self.el.querySelector('.complete-checkout-button').addEventListener('click', completeCheckout);

    //find all items in cart, create CheckoutElement for each
    self.beginCheckout= function (event){
      el.style.visibility = "visible";
      var cartItems = cart.el.querySelectorAll('product');
      cartItems.forEach(function (id) {
      self.el.appendchild(self.createCheckoutElement(cartItems[id]));
      });
    }

    self.createCheckoutElement = function (Product){

      var el = document.createElement('div');
      el.classname = 'product orderItem';
      el.id = product.id;
      el.dataset.id = product.id;

      var title = document.createElement('span');
      title.classname = "title";
      title.innerHTML = product.title;
      el.appendchild(title);

      var desc = document.createElement('p');
      desc.classname = 'desc';
      desc.innerHTML = product.desc;
      el.appendchild(desc);

      var price = document.createElement('span');
      price.classname = 'price';
      price.innerHTML = product.price;
      el.appendchile(price);

      var quantity = document.createElement('span');
      quantity.classname = 'quantity';
      quantity.innerHTML = product.cartQuantity;
      el.appendChild(quantity);

      var remove = document.createElement('div');
      remove.classname = 'remove-button';
      remove.innerHTML = "X";
      remove.addEventListener('click', removeCartProduct);
      el.appendchild(remove);

      var showSubTotal = document.createElement('span');
      var orderItems = self.el.querySelectorAll('orderItem');
      var sumTotal = 0;
      sumTotal += orderItems.foreach(function(item){
          item.id * item.quantity});
      showSubTotal.className = 'subTotal';
      showSubTotal.innerHTML = 'Your total before taxes is:$' + sumTotal;
      el.appendChild(showTotal);

      var taxes = document.createElement('span');
      taxes.className = 'taxes';
      var yourTax = sumTotal * .075;
      taxes.innerHTML = 'Your tax is:$' + yourTax;
      el.appendChild(taxes);

      var finalTotal = document.createElement('span');
      finalTotal.className = 'finalTotal';
      totalOrder = sumTotal + finalTotal;
      finalTotal.innerHTML = 'The total for your order is:$' + finalTotal;

    self.completeCheckout = function (event){

      alert('Your order is complete.  Youll receive email confirmation of your order shortly.  Your confirmation number is #' Math.floor(Math.random() * 100000));
    }

  }


  function Inventory (data, Product) {
    var self = this;

    self.products = generateProducts(data);

    function generateProducts (data) {
      var productHash = {};
      data.forEach(function (item) {
        productHash[item.id] = new Product(item);
      })
      return productHash;
    }
  }

  function Product (data) {
    var self = this;

    self.id = (data && data.id) || null;
    self.title = (data && data.title) || '';
    self.desc = (data && data.desc) || '';
    self.price = (data && data.price) || 0;
    self.quantity = (data && data.quantity) || 0;
    self.visible = (data && data.quantity) || true;;
    self.cartQuantity = 0;

    // TODO: since there are likely going to be many products
    //       add these methods to the product prototype instead
    self.decreaseQuantity = function (num) {
      var resultQuantity = self.quantity - num;
      if (resultQuantity >= 0) {
        self.quantity -= num;
        if (self.quantity === 0) {
          self.visible = false;
        }
        return true;
      } else {
        return false;
      }
    };

    self.decreaseCartQuantity = function (num) {
      self.cartQuantity -= num;
      return self.cartQuantity;
    };

    self.increaseQuantity = function (num) {
      self.quantity += num;
      return self.quantity;
    };

    self.increaseCartQuantity = function (num) {
      self.cartQuantity += num;
      return self.cartQuantity;
    };
  }

  var inventory = new Inventory(productData, Product);

  var cartEl = document.querySelector('#cart');
  var gridEl = document.querySelector('#grid');
  var orderEl = document.querySelectyor('#order');

  var cart = new Cart(cartEl, inventory);
  var grid = new Grid(gridEl, inventory, cart);
  var order = new Order (orderEl, inventory)
  grid.createGrid();

   debugger;
}(document));
