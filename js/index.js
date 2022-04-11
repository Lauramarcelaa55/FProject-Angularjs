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
    });
});

let cartMap = new Map();


let productsMap = new Map();
productsMap.set("1", {
  name: "Product1 aaaaaaaaaa",
  price: 200,
  img: "img1.jpg",
  favorite: Boolean(localStorage.getItem("favorite1")),
});

productsMap.set("2", {
  name: "Product2",
  price: 300,
  img: "img2.jpg",
  favorite: Boolean(localStorage.getItem("favorite2")),
});
productsMap.set("3", {
  name: "Product3",
  price: 200,
  img: "img3.jpg",
  favorite: Boolean(localStorage.getItem("favorite3")),
});
productsMap.set("4", {
  name: "Product4",
  price: 200,
  img: "img4.jpg",
  favorite: Boolean(localStorage.getItem("favorite4")),
});
productsMap.set("5", {
  name: "Product5",
  price: 200,
  img: "img5.jpg",
  favorite: Boolean(localStorage.getItem("favorite5")),
});
productsMap.set("6", {
  name: "Product6",
  price: 200,
  img: "img6.jpg",
  favorite: Boolean(localStorage.getItem("favorite6")),
});
productsMap.set("7", {
  name: "Product7",
  price: 200,
  img: "img7.jpg",
  favorite: Boolean(localStorage.getItem("favorite7")),
});
productsMap.set("8", {
  name: "Product8",
  price: 200,
  img: "img8.jpg",
  favorite: Boolean(localStorage.getItem("favorite8")),
});
productsMap.set("9", {
  name: "Product9",
  price: 200,
  img: "img9.jpg",
  favorite: Boolean(localStorage.getItem("favorite9")),
});

productsMap.forEach(
  (product,key)=>{
    let cartProduct= JSON.parse(localStorage.getItem("cart"+key));
    if(cartProduct){
      cartMap.set(key,cartProduct)
    }
    else{
      cartMap.delete(key);
    }
  }
)


app.run(function ($rootScope) {
  $rootScope.cartVisible=false;
  $rootScope.showCart=function(){
    $rootScope.cartVisible=!$rootScope.cartVisible;
  }
  $rootScope.cartItems = Object.fromEntries(cartMap.entries());
  $rootScope.calcCartTotal = function () {
    let total = 0;
    cartMap.forEach((item) => {
      total+=(item.product.price * item.quantity);
    });
    return total;
  };
  $rootScope.addProductToCart = function (key) {
    let product = productsMap.get(key);
    let quantity = cartMap.get(key)?.quantity || 0;
    let newCartProduct={
      product: product,
      quantity: ++quantity,
    };
    cartMap.set(key, newCartProduct);
    localStorage.setItem("cart"+key,JSON.stringify(newCartProduct))
    $rootScope.cartItems = Object.fromEntries(cartMap.entries());
    $rootScope.cartVisible=true;
  };
  $rootScope.removeProductFromCart = function (key) {
    let quantity = cartMap.get(key).quantity;
    let product = productsMap.get(key);
    quantity--;
    if (!quantity) {
      cartMap.delete(key);
      localStorage.removeItem("cart"+key);
    } else {
      let newCartProduct= {
        product: product,
        quantity: quantity,
      }
      cartMap.set(key,newCartProduct);
      localStorage.setItem("cart"+key,JSON.stringify(newCartProduct));
    }
    $rootScope.cartItems = Object.fromEntries(cartMap.entries());
  };
});
app.controller("products_ctrl", function ($scope, $rootScope) {
  $scope.selectedProduct = {};
  $scope.isOpen = false;
  $scope.Products = Object.fromEntries(productsMap.entries());

  
  $scope.ShowModal = function (key) {
    let product = productsMap.get(key);
    $scope.selectedProduct = product;
    $scope.isOpen = true;
  };
  $scope.toggleFavorite = function (key) {
    let product = productsMap.get(key);
    if (product.favorite) {
      localStorage.removeItem("favorite"+key);
      product.favorite = false;
    } else {
      localStorage.setItem("favorite"+key, "1");
      product.favorite = true;
    }
    productsMap.set(key, product);
    $scope.Products = Object.fromEntries(productsMap.entries());
  };
  
});
