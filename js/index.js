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

let cartMap= new Map();

app.run(function ($rootScope) {
  $rootScope.login = false;
  
  $rootScope.cartItems=Object.fromEntries(cartMap.entries());
  $rootScope.calcCartTotal= function(){
    let total=0;  
    cartMap.forEach(
        (item)=>{
            item.product.price*item.quantity
        }
    );
  }
});

let productsMap= new Map();
productsMap.set("1",{
    name:"Product1",
    price:200,
    img:"../img/img1.jpg"
});

productsMap.set("2",{
    name:"Product2",
    price:300,
    img:"../img/img2.jpg"
});
 productsMap.set("3",{
    name:"Product3",
    price:200,
    img:"../img/img3.jpg"
});
productsMap.set("4",{
    name:"Product4",
    price:200,
    img:"../img/img4.jpg"
});
productsMap.set("5",{
    name:"Product5",
    price:200,
    img:"../img/img5.jpg"
});
productsMap.set("6",{
    name:"Product6",
    price:200,
    img:"../img/img6.jpg"
}); 
productsMap.set("7",{
    name:"Product7",
    price:200,
    img:"../img/img7.jpg"
}); 
productsMap.set("8",{
    name:"Product8",
    price:200,
    img:"../img/img8.jpg"
}); 
productsMap.set("9",{
    name:"Product9",
    price:200,
    img:"../img/img9.jpg"
}); 

app.controller("products_ctrl", function ($scope, $rootScope) {
    $scope.selectedProduct={};
    $scope.isOpen=false;
    $scope.Products=Object.fromEntries(productsMap.entries());
    $scope.addProductToCart=function(key){
        let product= productsMap.get(key);
        let quantity= cartMap.get(key).quantity;
        cartMap.set(key,{
            product:product,
            quantity:quantity++
        });
        $rootScope.cartItems=Object.fromEntries(cartMap.entries());
    }
    $scope.removeProductFromCart= function(key){
        let quantity= cartMap.get(key).quantity;
        let product= productsMap.get(key);
        quantity--;
        if(!quantity)
        {
            cartMap.delete(key);
        }
        else{
            cartMap.set(key,{
                product:product,
                quantity:quantity
            });
        }
        $rootScope.cartItems=Object.fromEntries(cartMap.entries());
    }
    $scope.ShowModal= function(key){
        let product= productsMap.get(key);
        $scope.selectedProduct= product;
        $scope.isOpen=true;
    }
});
