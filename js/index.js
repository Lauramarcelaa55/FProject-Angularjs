const app = angular.module("app", ["ngRoute"]);
app.config(function ($routeProvider) {
  $routeProvider
    .when("/", {
      templateUrl: "./pages/products.html",
      controller: "products_ctrl",
    })
    .when("/login", {
      templateUrl: "./pages/login.html",
      controller: "payment_ctrl",
    })
    .when("/payment", {
      templateUrl: "./pages/payment.html",
      controller: "payment_ctrl",
    })
    .when("/order", {
      templateUrl: "./pages/order.html",
      controller: "order_ctrl",
    })
    
});

let cartMap = new Map();

let productsMap = new Map();
productsMap.set("1", {
  name: "Nest",
  price: 180,
  img: "img1.jpg",
  favorite: Boolean(localStorage.getItem("favorite1")),
});

productsMap.set("2", {
  name: "Dulce Sonrisa",
  price: 260,
  img: "img2.jpg",
  favorite: Boolean(localStorage.getItem("favorite2")),
});
productsMap.set("3", {
  name: "Sundays",
  price: 200,
  img: "img3.jpg",
  favorite: Boolean(localStorage.getItem("favorite3")),
});
productsMap.set("4", {
  name: "Mini Dried Bouquets",
  price: 250,
  img: "img4.jpg",
  favorite: Boolean(localStorage.getItem("favorite4")),
});
productsMap.set("5", {
  name: "Hey Honey",
  price: 200,
  img: "img5.jpg",
  favorite: Boolean(localStorage.getItem("favorite5")),
});
productsMap.set("6", {
  name: "Harmony",
  price: 190,
  img: "img6.jpg",
  favorite: Boolean(localStorage.getItem("favorite6")),
});
productsMap.set("7", {
  name: "Passionate",
  price: 195,
  img: "img7.jpg",
  favorite: Boolean(localStorage.getItem("favorite7")),
});
productsMap.set("8", {
  name: "Primer Amor",
  price: 160,
  img: "img8.jpg",
  favorite: Boolean(localStorage.getItem("favorite8")),
});
productsMap.set("9", {
  name: "Sweet Bonbon",
  price: 210,
  img: "img9.jpg",
  favorite: Boolean(localStorage.getItem("favorite9")),
});

productsMap.forEach((product, key) => {
  let cartProduct = JSON.parse(localStorage.getItem("cart" + key));
  if (cartProduct) {
    cartMap.set(key, cartProduct);
  } else {
    cartMap.delete(key);
  }
});

app.run(function ($rootScope) {
  $rootScope.cartVisible = false;
  $rootScope.checkoutState=false;
  $rootScope.modalVisible=false;
  $rootScope.closeModal=function(){
    $rootScope.modalVisible=false;
  }
  $rootScope.userData={
    firstname: localStorage.getItem("user_firstname"),
    lastname: localStorage.getItem("user_lastname"),
    email: localStorage.getItem("user_email"),
    phone: localStorage.getItem("user_phone"),
    country: "Canada",
    city: "AB",
    address: localStorage.getItem("user_address"),
    postalCode: localStorage.getItem("user_postalcode"),
    cardNumber: localStorage.getItem("user_cardnumber"),
    cardName: localStorage.getItem("user_cardname"),
    expiryDate: localStorage.getItem("user_expirydate"),
    securityCode: "",
  };
  $rootScope.showCart = function () {
    $rootScope.cartVisible = !$rootScope.cartVisible;
  };
  $rootScope.hideCart = function () {
    $rootScope.cartVisible = false;
  };
  $rootScope.cartItems = Object.fromEntries(cartMap.entries());
  $rootScope.calcCartTotal = function () {
    let total = 0;
    cartMap.forEach((item) => {
      total += item.product.price * item.quantity;
    });
    return total;
  };
  $rootScope.addProductToCart = function (key) {
    let product = productsMap.get(key);
    let quantity = cartMap.get(key)?.quantity || 0;
    let newCartProduct = {
      product: product,
      quantity: ++quantity,
    };
    cartMap.set(key, newCartProduct);
    localStorage.setItem("cart" + key, JSON.stringify(newCartProduct));
    $rootScope.cartItems = Object.fromEntries(cartMap.entries());
    $rootScope.cartVisible = true;
  };
  $rootScope.removeProductFromCart = function (key) {
    let quantity = cartMap.get(key).quantity;
    let product = productsMap.get(key);
    quantity--;
    if (!quantity) {
      cartMap.delete(key);
      localStorage.removeItem("cart" + key);
    } else {
      let newCartProduct = {
        product: product,
        quantity: quantity,
      };
      cartMap.set(key, newCartProduct);
      localStorage.setItem("cart" + key, JSON.stringify(newCartProduct));
    }
    $rootScope.cartItems = Object.fromEntries(cartMap.entries());
  };
  $rootScope.checkout = function () {
    $rootScope.cartVisible = false;
    window.location = "#!payment";
  };
});
app.controller("products_ctrl", function ($scope, $rootScope) {
  $scope.selectedProduct={
    key:"",
    product:{}
  };
  $scope.modal = {
    quantity:0
  };
  
  $scope.Products = Object.fromEntries(productsMap.entries());
  
  $scope.ShowModal = function (key) {
    let product = productsMap.get(key);
    let cartProduct = cartMap.get(key);
    $scope.modal = {key, ...product, quantity:cartProduct?.quantity||0};
    $rootScope.modalVisible = true;
  };
  $scope.removeProductFromCartModal=function(key){
    $rootScope.removeProductFromCart(key)
    $scope.modal.quantity=JSON.parse(localStorage.getItem("cart"+key))?.quantity||0;
  }
  $scope.addProductToCartModal=function(key){
    console.log($scope.modal);
    $rootScope.addProductToCart(key)
    $scope.modal.quantity=JSON.parse(localStorage.getItem("cart"+key))?.quantity||0;
  }
  $scope.addToCartModal= function(key){
    $rootScope.modalVisible = false;
    if($scope.modal.quantity>0){
      return;
    }
    $rootScope.addProductToCart(key)
  }
  $scope.toggleFavorite = function (key) {
    let product = productsMap.get(key);
    if (product.favorite) {
      localStorage.removeItem("favorite" + key);
      product.favorite = false;
    } else {
      localStorage.setItem("favorite" + key, "1");
      product.favorite = true;
    }
    productsMap.set(key, product);
    $scope.Products = Object.fromEntries(productsMap.entries());
  };
});


const CanadianProvinces = new Map(
  [
    ["AB", "Alberta"],
    ["BC", "British Columbia"],
    ["MB", "Manitoba"],
    ["NB", "New Brunswick"],
    ["NL", "Newfoundland and Labrador"],
    ["NT", "Northwest Territories"],
    ["NS", "Nova Scotia"],
    ["NU", "Nunavut"],
    ["ON", "Ontario"],
    ["PE", "Prince Edward Island"],
    ["QC", "Quebec"],
    ["SK", "Saskatchewan"],
    ["YT", "Yukon Territory"],
  ] //Canadian Provinces Map
);

const USAStates = new Map([
  ["AL", "Alabama"],
  ["AK", "Alaska"],
  ["AS", "American Samoa"],
  ["AZ", "Arizona"],
  ["AR", "Arkansas"],
  ["CA", "California"],
  ["CO", "Colorado"],
  ["CT", "Connecticut"],
  ["DE", "Delaware"],
  ["DC", "District Of Columbia"],
  ["FM", "Federated States Of Micronesia"],
  ["FL", "Florida"],
  ["GA", "Georgia"],
  ["GU", "Guam"],
  ["HI", "Hawaii"],
  ["ID", "Idaho"],
  ["IL", "Illinois"],
  ["IN", "Indiana"],
  ["IA", "Iowa"],
  ["KS", "Kansas"],
  ["KY", "Kentucky"],
  ["LA", "Louisiana"],
  ["ME", "Maine"],
  ["MH", "Marshall Islands"],
  ["MD", "Maryland"],
  ["MA", "Massachusetts"],
  ["MI", "Michigan"],
  ["MN", "Minnesota"],
  ["MS", "Mississippi"],
  ["MO", "Missouri"],
  ["MT", "Montana"],
  ["NE", "Nebraska"],
  ["NV", "Nevada"],
  ["NH", "New Hampshire"],
  ["NJ", "New Jersey"],
  ["NM", "New Mexico"],
  ["NY", "New York"],
  ["NC", "North Carolina"],
  ["ND", "North Dakota"],
  ["MP", "Northern Mariana Islands"],
  ["OH", "Ohio"],
  ["OK", "Oklahoma"],
  ["OR", "Oregon"],
  ["PW", "Palau"],
  ["PA", "Pennsylvania"],
  ["PR", "Puerto Rico"],
  ["RI", "Rhode Island"],
  ["SC", "South Carolina"],
  ["SD", "South Dakota"],
  ["TN", "Tennessee"],
  ["TX", "Texas"],
  ["UT", "Utah"],
  ["VT", "Vermont"],
  ["VI", "Virgin Islands"],
  ["VA", "Virginia"],
  ["WA", "Washington"],
  ["WV", "West Virginia"],
  ["WI", "Wisconsin"],
  ["WY", "Wyoming"],
]); // USA States Map

app.controller("payment_ctrl", function ($scope, $rootScope) {
  $scope.orderForm = {
    firstname: $rootScope.userData.firstname || "" ,
    lastname: $rootScope.userData.lastname || "",
    email: $rootScope.userData.email || "",
    phone: $rootScope.userData.phone || "",
    country: $rootScope.userData.country || "Canada",
    city: $rootScope.userData.city || "AB",
    address: $rootScope.userData.address || "",
    postalCode: $rootScope.userData.postalCode || "",
    cardNumber: $rootScope.userData. cardNumber || "",
    cardName: $rootScope.userData.cardName || "",
    expiryDate: $rootScope.userData.expiryDate|| "",
    securityCode: ""
  };
  $scope.States= Object.fromEntries(CanadianProvinces.entries());
  $scope.countryChange= function(){
    if($scope.orderForm.country==="USA"){
      $scope.States=Object.fromEntries(USAStates.entries());
      $scope.orderForm.city="AL";
    }
    else{
      $scope.States= Object.fromEntries(CanadianProvinces.entries());
      $scope.orderForm.city="AB";
    }
  }
  $scope.completeCheckout = function () {
    $rootScope.checkoutState=true;
    localStorage.setItem("user_firstname",$scope.orderForm.firstname);
    localStorage.setItem("user_lastname",$scope.orderForm.lastname);
    localStorage.setItem("user_email",$scope.orderForm.email);
    localStorage.setItem("user_phone",$scope.orderForm.phone);
    localStorage.setItem("user_city",$scope.orderForm.city);
    localStorage.setItem("user_address",$scope.orderForm.address);
    localStorage.setItem("user_postalcode",$scope.orderForm.postalCode);
    localStorage.setItem("user_cardnumber",$scope.orderForm.cardNumber);
    localStorage.setItem("user_cardname",$scope.orderForm.cardName);
    localStorage.setItem("user_expirydate",$scope.orderForm.expiryDate);
    window.location="#!order";
  };
});

app.controller("order_ctrl", function ($scope, $rootScope) {
  if(!$rootScope.checkoutState) window.location="#!";
  $rootScope.checkoutState=false;
});

const validateFirstName = function (e) {
  const regex = /[a-zA-Z]/g;
  const currentValue = e.key;
  const valid = regex.test(currentValue);
  if (!valid) {
    e.preventDefault();
    return;
  }
};
const validateLastName = function (e) {
  const regex = /[a-zA-Z]/g;
  const currentValue = e.key;
  const valid = regex.test(currentValue);
  if (!valid) {
    e.preventDefault();
    return;
  }
};
const validateCardName = function (e) {
  const regex = /[a-zA-Z ]/g;
  const currentValue = e.key;
  const valid = regex.test(currentValue);
  if (!valid) {
    e.preventDefault();
    return;
  }
};
const validateAddress = function (e) {
  const regex = /[a-zA-Z0-9#. ]/g;
  const currentValue = e.key;
  const valid = regex.test(currentValue);
  if (!valid) {
    e.preventDefault();
    return;
  }
};
const validatePostalCode = function (e) {
  const regex = /[a-zA-Z0-9]/g;
  const currentValue = e.key;
  const valid = regex.test(currentValue);
  if (!valid) {
    e.preventDefault();
    return;
  }
};
const validatePhoneNumber = function (e) {
  const regex = /[0-9]/g;
  const currentValue = e.key;
  const valid = regex.test(currentValue);
  if (!valid) {
    e.preventDefault();
    return;
  }
};
const securityCodeInputHandler=(e)=>{
  const regex = /[0-9]/g;
  const currentValue = e.key;
  const valid = regex.test(currentValue);
  console.log(e);
  if ((!valid||e.currentTarget.value.length>3) && e.key!=="Backspace") {
    e.preventDefault();
    return;
  }
}

// https://codepen.io/murani/pen/KyVbrp

let ccNumberInput = document.querySelector("#cardNumber");
const ccNumberPattern = /^\d{0,16}$/g;
const ccNumberSeparator = " ";
let ccNumberInputOldValue;
let ccNumberInputOldCursor;
const ccExpiryInput = document.querySelector("#expiryDate");
const ccExpiryPattern = /^\d{0,4}$/g;
const ccExpirySeparator = "/";
let ccExpiryInputOldValue;
let ccExpiryInputOldCursor;
const ccCVCInput = document.querySelector("#securityCode");
const ccCVCPattern = /^\d{0,3}$/g;
const mask = (value, limit, separator) => {
  var output = [];
  for (let i = 0; i < value.length; i++) {
    if (i !== 0 && i % limit === 0) {
      output.push(separator);
    }

    output.push(value[i]);
  }

  return output.join("");
};
const unmask = (value) => value.replace(/[^\d]/g, "");
const checkSeparator = (position, interval) =>
  Math.floor(position / (interval + 1));
const ccNumberInputKeyDownHandler = (e) => {
  let el = e.target;
  console.log(el);
  ccNumberInputOldValue = el.value;
  ccNumberInputOldCursor = el.selectionEnd;
};
const ccNumberInputInputHandler = (e) => {
  let el = e.target;
  let newValue = unmask(el.value);
  let newCursorPosition;

  if (newValue.match(ccNumberPattern)) {
    newValue = mask(newValue, 4, ccNumberSeparator);

    newCursorPosition =
      ccNumberInputOldCursor -
      checkSeparator(ccNumberInputOldCursor, 4) +
      checkSeparator(
        ccNumberInputOldCursor +
          (newValue.length - ccNumberInputOldValue.length),
        4
      ) +
      (unmask(newValue).length - unmask(ccNumberInputOldValue).length);

    el.value = newValue !== "" ? newValue : "";
  } else {
    el.value = ccNumberInputOldValue;
    newCursorPosition = ccNumberInputOldCursor;
  }

  el.setSelectionRange(newCursorPosition, newCursorPosition);

  highlightCC(el.value);
};
const highlightCC = (ccValue) => {
  let ccCardType = "";
  let ccCardTypePatterns = {
    amex: /^3/,
    visa: /^4/,
    mastercard: /^5/,
    disc: /^6/,

    genric: /(^1|^2|^7|^8|^9|^0)/,
  };

  for (const cardType in ccCardTypePatterns) {
    if (ccCardTypePatterns[cardType].test(ccValue)) {
      ccCardType = cardType;
      break;
    }
  }

  let activeCC = document.querySelector(".cc-types__img--active");
  let newActiveCC = document.querySelector(`.cc-types__img--${ccCardType}`);

  if (activeCC) activeCC.classList.remove("cc-types__img--active");
  if (newActiveCC) newActiveCC.classList.add("cc-types__img--active");
};
const ccExpiryInputKeyDownHandler = (e) => {
  let el = e.target;
  ccExpiryInputOldValue = el.value;
  ccExpiryInputOldCursor = el.selectionEnd;
};
const ccExpiryInputInputHandler = (e) => {
  let el = e.target;
  let newValue = el.value;

  newValue = unmask(newValue);
  if (newValue.match(ccExpiryPattern)) {
    newValue = mask(newValue, 2, ccExpirySeparator);
    el.value = newValue;
  } else {
    el.value = ccExpiryInputOldValue;
  }
};